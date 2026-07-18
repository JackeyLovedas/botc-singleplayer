import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import {
  OwnershipContractError,
  auditOwnershipContracts,
  sha256CanonicalLines,
  validateOwnershipContracts
} from "./vitest-ownership-contracts.mjs";

const APPLICATION_FILE = "packages/application/src/synthetic.test.ts";
const LEGACY_PROJECTS = Object.freeze(["legacy-a", "legacy-b"]);
const NON_OWNED_POLICY =
  "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS";
const ZERO_SHA256 = "0".repeat(64);

function identity(project, title, ancestorPath = ["synthetic ownership"] ) {
  return { project, file: APPLICATION_FILE, ancestorPath, title };
}

function traceability(contractId, title, options = {}) {
  const criterion = options.criterion ?? "C01";
  const supportingReference = options.supportingReference ?? `SUP-${contractId}-001`;
  const mechanism = options.mechanism ?? "PASS";
  const criterionRows = options.criterionRows ?? [
    `| ${criterion} | \`${APPLICATION_FILE}\` | \`${title}\` | R1 | T1 | LAYER | ${supportingReference} | ${mechanism} | synthetic |`
  ];
  const registryRows = options.registryRows ?? [
    `| SUP-${contractId}-001 | synthetic supporting authority |`
  ];
  return `${[...criterionRows, ...registryRows].join("\n")}\n`;
}

function writeFixture(root, relative, content) {
  const destination = path.resolve(root, relative);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, content, "utf8");
}

function encodeFields(fields) {
  return fields.map((field) => `${field.length}:${field}`).join("|");
}

function semanticKey(entry) {
  return encodeFields([
    entry.file,
    encodeFields(entry.ancestorPath),
    entry.title
  ]);
}

function makeContract({
  contractId,
  ownerProject,
  traceabilityFile,
  fullInventory,
  registeredContractIds,
  criterionIds = ["C01"],
  dynamicTestAuthorityRows = 1,
  supportingAuthorityCount = 1,
  traceabilityRowCount = criterionIds.length
}) {
  const markerPrefix = `[${contractId}-`;
  const owned = fullInventory.filter((entry) => entry.title.includes(markerPrefix));
  const semanticLines = new Map();
  for (const entry of owned) {
    semanticLines.set(
      semanticKey(entry),
      [entry.file, entry.ancestorPath.join(" > "), entry.title].join("\t")
    );
  }
  const nonOwned = fullInventory.filter(
    (entry) =>
      !registeredContractIds.some((id) => entry.title.includes(`[${id}-`))
  );
  const nonOwnedOwners = new Map();
  for (const entry of nonOwned) {
    const key = semanticKey(entry);
    const existing = nonOwnedOwners.get(key) ?? { entry, owners: new Set() };
    existing.owners.add(entry.project);
    nonOwnedOwners.set(key, existing);
  }
  const nonOwnedLines = [...nonOwnedOwners.values()].map(({ entry, owners }) =>
    [
      entry.file,
      entry.ancestorPath.join(" > "),
      entry.title,
      [...owners].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)).join(",")
    ].join("\t")
  );
  const projectLines = owned.map((entry) =>
    [entry.project, entry.file, entry.ancestorPath.join(" > "), entry.title].join("\t")
  );
  return {
    applicationTestFile: APPLICATION_FILE,
    contractId,
    criterionIds: [...criterionIds],
    frozenBaseline: {
      authorityInventorySha256: sha256CanonicalLines(
        new Set(owned.map((entry) => /^\[([^\]]+)\]/u.exec(entry.title)?.[1] ?? ""))
      ),
      currentProjectInventorySha256: sha256CanonicalLines(projectLines),
      dynamicTestAuthorityRows,
      nonMarkerOwnershipSha256: sha256CanonicalLines(nonOwnedLines),
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      physicalTestFileSetSha256: sha256CanonicalLines(
        new Set(fullInventory.map((entry) => entry.file))
      ),
      projectExecutionsAfter: owned.length,
      projectExecutionsBefore: owned.length,
      projectInventorySha256: ZERO_SHA256,
      semanticInventorySha256: sha256CanonicalLines(semanticLines.values()),
      supportingAuthorityCount,
      traceabilityRowCount
    },
    markerPattern: `^\\[${contractId}-[^\\]]+\\]`,
    markerPrefix,
    ownerProject,
    status: "ACTIVE",
    supportingAuthorityPrefix: `SUP-${contractId}-`,
    traceabilityFile
  };
}

function expectCode(code, operation) {
  try {
    operation();
  } catch (error) {
    if (error instanceof OwnershipContractError && error.code === code) return;
    throw new Error(
      `expected ${code}; received ${error instanceof Error ? error.message : String(error)}`
    );
  }
  throw new Error(`expected ${code}; operation passed`);
}

function expectRejected(operation) {
  try {
    operation();
  } catch (error) {
    if (error instanceof OwnershipContractError) return;
    throw error;
  }
  throw new Error("expected ownership contract rejection; operation passed");
}

function audit(root, contracts, inventory) {
  return auditOwnershipContracts({
    repoRoot: root,
    contracts,
    fullInventory: inventory,
    legacyApplicationServiceProjects: LEGACY_PROJECTS
  });
}

function createFixture(root, ids = ["2BTESTA"], options = {}) {
  const legacy = identity("legacy-a", "[2BLEGACY-01] frozen accepted marker");
  const owned = ids.map((id, index) =>
    identity(`owner-${id}`, `[${id}-C01] synthetic ${index + 1}`)
  );
  const inventory = options.withoutLegacy ? [...owned] : [legacy, ...owned];
  const contracts = ids.map((id, index) => {
    const traceabilityFile = `trace/${id.toLowerCase()}.md`;
    writeFixture(root, traceabilityFile, traceability(id, owned[index].title));
    return makeContract({
      contractId: id,
      ownerProject: `owner-${id}`,
      traceabilityFile,
      fullInventory: inventory,
      registeredContractIds: ids
    });
  });
  return { contracts, inventory, legacy, owned };
}

function runSelfTest() {
  const root = mkdtempSync(path.join(tmpdir(), "botc-ownership-contracts-"));
  const results = [];
  const check = (name, operation) => {
    operation();
    results.push(name);
  };
  try {
    check("01 single contract and frozen legacy marker pass", () => {
      const fixture = createFixture(root);
      const result = audit(root, fixture.contracts, fixture.inventory);
      if (result.length !== 1 || result[0].semanticTests !== 1) {
        throw new Error("single-contract audit summary is incorrect");
      }
    });

    check("02 two non-overlapping contracts pass", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const result = audit(root, fixture.contracts, fixture.inventory);
      if (result.length !== 2) throw new Error("two-contract audit did not pass");
    });

    check("03 overlapping marker configuration rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const broad = { ...fixture.contracts[0], markerPrefix: "[2BTEST" };
      expectCode("OVERLAPPING_OWNERSHIP_MARKER_PATTERNS", () =>
        validateOwnershipContracts([broad, fixture.contracts[1]], {
          repoRoot: root
        })
      );
    });

    check("04 duplicate contractId rejects", () => {
      const fixture = createFixture(root);
      expectCode("DUPLICATE_OWNERSHIP_CONTRACT_ID", () =>
        validateOwnershipContracts([fixture.contracts[0], { ...fixture.contracts[0] }], {
          repoRoot: root
        })
      );
    });

    check("05 duplicate supporting prefix rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const hostile = {
        ...fixture.contracts[1],
        supportingAuthorityPrefix: fixture.contracts[0].supportingAuthorityPrefix
      };
      expectCode("DUPLICATE_SUPPORTING_AUTHORITY_PREFIX", () =>
        validateOwnershipContracts([fixture.contracts[0], hostile], {
          repoRoot: root
        })
      );
    });

    check("06 unknown marker addition and legacy mutation reject", () => {
      const fixture = createFixture(root);
      expectCode("UNREGISTERED_SLICE_OWNERSHIP_MARKER", () =>
        audit(root, fixture.contracts, [
          ...fixture.inventory,
          identity("legacy-a", "[2BUNKNOWN-01] new marker")
        ])
      );
      expectCode("UNREGISTERED_SLICE_OWNERSHIP_MARKER", () =>
        audit(root, fixture.contracts, [
          identity("legacy-a", "[2BLEGACY-02] changed accepted marker"),
          ...fixture.owned
        ])
      );
    });

    check("07 duplicate semantic project execution rejects", () => {
      const fixture = createFixture(root);
      expectCode("SEMANTIC_OWNERSHIP_MISMATCH", () =>
        audit(root, fixture.contracts, [
          ...fixture.inventory,
          { ...fixture.owned[0], project: "legacy-a" }
        ])
      );
    });

    check("08 wrong owner project rejects", () => {
      const fixture = createFixture(root);
      expectCode("SEMANTIC_OWNERSHIP_MISMATCH", () =>
        audit(root, fixture.contracts, [
          fixture.legacy,
          { ...fixture.owned[0], project: "legacy-a" }
        ])
      );
    });

    check("09 missing traceability file rejects", () => {
      const fixture = createFixture(root);
      const contract = {
        ...fixture.contracts[0],
        traceabilityFile: "trace/missing.md"
      };
      expectCode("OWNERSHIP_TRACEABILITY_FILE_MISSING", () =>
        audit(root, [contract], fixture.inventory)
      );
    });

    check("10 missing criterion rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        `| SUP-2BTESTA-001 | authority |\n`
      );
      expectCode("TRACEABILITY_CRITERION_MISMATCH", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("11 duplicate criterion rejects", () => {
      const fixture = createFixture(root);
      const row = `| C01 | \`${APPLICATION_FILE}\` | \`${fixture.owned[0].title}\` | R | T | L | SUP-2BTESTA-001 | PASS | note |`;
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        `${row}\n${row}\n| SUP-2BTESTA-001 | authority |\n`
      );
      expectCode("DUPLICATE_TRACEABILITY_CRITERION", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("12 missing supporting authority rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          supportingReference: "SUP-2BTESTA-002"
        })
      );
      expectCode("SUPPORTING_AUTHORITY_MISSING", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("13 unused supporting authority rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          registryRows: [
            "| SUP-2BTESTA-001 | authority |",
            "| SUP-2BTESTA-002 | unused |"
          ]
        })
      );
      expectCode("SUPPORTING_AUTHORITY_UNUSED", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("14 non-PASS MechanismMatch rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, { mechanism: "FAIL" })
      );
      expectCode("TRACEABILITY_MECHANISM_MISMATCH", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("15 non-leading authority marker rejects", () => {
      const title = "prefix [2BTESTA-C01] misplaced";
      const inventory = [identity("owner-2BTESTA", title)];
      const traceabilityFile = "trace/misplaced.md";
      writeFixture(root, traceabilityFile, traceability("2BTESTA", title));
      const contract = makeContract({
        contractId: "2BTESTA",
        ownerProject: "owner-2BTESTA",
        traceabilityFile,
        fullInventory: inventory,
        registeredContractIds: ["2BTESTA"]
      });
      expectCode("TITLE_HAS_NO_EXACT_AUTHORITY_MARKER", () =>
        audit(root, [contract], inventory)
      );
    });

    check("16 hostile and noncanonical registry shapes reject without getters", () => {
      const fixture = createFixture(root);
      const base = fixture.contracts[0];
      expectRejected(() =>
        validateOwnershipContracts([{ ...base, unknown: true }], {
          repoRoot: root
        })
      );
      let getterCalls = 0;
      const getterRecord = { ...base };
      Object.defineProperty(getterRecord, "ownerProject", {
        enumerable: true,
        get() {
          getterCalls += 1;
          return "owner-2BTESTA";
        }
      });
      expectRejected(() =>
        validateOwnershipContracts([getterRecord], { repoRoot: root })
      );
      if (getterCalls !== 0) throw new Error(`getter calls=${getterCalls}`);
      const symbolRecord = { ...base };
      symbolRecord[Symbol("hostile")] = true;
      expectRejected(() =>
        validateOwnershipContracts([symbolRecord], { repoRoot: root })
      );
      const sparse = [];
      sparse.length = 1;
      expectRejected(() =>
        validateOwnershipContracts(sparse, { repoRoot: root })
      );
      const keyedArray = [base];
      keyedArray.hostile = true;
      expectRejected(() =>
        validateOwnershipContracts(keyedArray, { repoRoot: root })
      );
      const inheritedArray = [base];
      Object.setPrototypeOf(inheritedArray, Object.create(Array.prototype));
      expectRejected(() =>
        validateOwnershipContracts(inheritedArray, { repoRoot: root })
      );
      const nonplain = Object.assign(Object.create(null), base);
      expectRejected(() =>
        validateOwnershipContracts([nonplain], { repoRoot: root })
      );
      const target = {};
      const revoked = Proxy.revocable(target, {});
      revoked.revoke();
      expectRejected(() =>
        validateOwnershipContracts(revoked.proxy, { repoRoot: root })
      );
    });

    check("17 output order is independent of registry input order", () => {
      const fixture = createFixture(root, ["2BTESTB", "2BTESTA"]);
      const forward = audit(root, fixture.contracts, fixture.inventory);
      const reverse = audit(root, [...fixture.contracts].reverse(), fixture.inventory);
      const forwardIds = forward.map((entry) => entry.contractId).join(",");
      const reverseIds = reverse.map((entry) => entry.contractId).join(",");
      if (forwardIds !== "2BTESTA,2BTESTB" || forwardIds !== reverseIds) {
        throw new Error(`unstable output order: ${forwardIds}; ${reverseIds}`);
      }
    });

    check("18 contract A cannot bind contract B semantic test", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[1].title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.legacy.title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("19 reciprocal cross-contract traceability swap rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[1].title)
      );
      writeFixture(
        root,
        fixture.contracts[1].traceabilityFile,
        traceability("2BTESTB", fixture.owned[0].title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, [...fixture.contracts].reverse(), fixture.inventory)
      );
    });

    check("20 registered foreign supporting authority rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          supportingReference: "SUP-2BTESTB-001"
        })
      );
      expectCode("INVALID_SUPPORTING_AUTHORITY_REFERENCE", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          registryRows: ["| SUP-2BTESTB-001 | foreign registry entry |"]
        })
      );
      expectCode("INVALID_SUPPORTING_AUTHORITY_REGISTRY_ENTRY", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("21 unregistered foreign mixed and unknown support never become zero", () => {
      const fixture = createFixture(root);
      const zeroSupportingContract = {
        ...fixture.contracts[0],
        frozenBaseline: {
          ...fixture.contracts[0].frozenBaseline,
          supportingAuthorityCount: 0
        }
      };
      for (const supportingReference of [
        "SUP-2BTESTB-001",
        "NONE SUP-2BTESTA-001",
        "UNKNOWN"
      ]) {
        writeFixture(
          root,
          zeroSupportingContract.traceabilityFile,
          traceability("2BTESTA", fixture.owned[0].title, {
            registryRows: [],
            supportingReference
          })
        );
        expectCode("INVALID_SUPPORTING_AUTHORITY_REFERENCE", () =>
          audit(root, [zeroSupportingContract], fixture.inventory)
        );
      }
    });

    check("22 duplicate active traceability file rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const duplicateFileContract = {
        ...fixture.contracts[1],
        traceabilityFile: fixture.contracts[0].traceabilityFile
      };
      expectCode("DUPLICATE_OWNERSHIP_TRACEABILITY_FILE", () =>
        validateOwnershipContracts(
          [fixture.contracts[0], duplicateFileContract],
          { repoRoot: root }
        )
      );
    });

    process.stdout.write(
      `${JSON.stringify(
        {
          verdict: "OWNERSHIP_CONTRACT_SELF_TEST_PASS",
          checksPassed: results.length,
          checksExpected: 22,
          checks: results
        },
        null,
        2
      )}\n`
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (process.argv.length !== 3 || process.argv[2] !== "--self-test") {
  process.stderr.write(
    "Usage: node scripts/verify-vitest-ownership-contracts.mjs --self-test\n"
  );
  process.exitCode = 1;
} else {
  try {
    runSelfTest();
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.stack ?? error.message : String(error)}\n`
    );
    process.exitCode = 1;
  }
}
