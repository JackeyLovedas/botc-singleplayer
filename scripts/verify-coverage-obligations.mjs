import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const UNIQUE_OWNERSHIP_PROFILE_ID = "frozen-pr36-035f037-ownership-v2-1";
const UNIQUE_OWNERSHIP_SOURCE_KIND =
  "PROCESS_ISOLATED_UNIQUE_TEST_OWNERSHIP_BASELINE";
const UNIQUE_OWNERSHIP_SUPERSESSION_REASON =
  "UNIQUE_APPLICATION_TEST_OWNERSHIP_AND_GENUINE_BRANCH_COVERAGE_IMPROVEMENT";
const UNIQUE_OWNERSHIP_REMOVED_TUPLE =
  'packages/domain-core/src/first-night-ability-outcome-ledger.ts|type:"branch"|branch:473:476-473:531|arm:0|location:473:476-473:531';

const APPROVED_COVERAGE_PROFILES = Object.freeze([
  Object.freeze({
    id: "accepted-main-9c4d009-single-process-v1",
    sourceHead: "9c4d009f32d4d24d0e072168717f34795b3c322c",
    sourceKind: "SINGLE_PROCESS_BASELINE",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 61,
        sha256: "b8076fca1bce06a811d10d189d3bf89f6caefe5fb81de270d1e91dabc1565920"
      }),
      zeroHitStatements: Object.freeze({
        count: 3157,
        sha256: "057ceb478f9359c70c6d654d615369e0225b1d440fc2ebb8626098df46a4bcda"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "0566362f681edfe7d13ccea297fe63b53f92de0a7a7b223d4224459d96c783a6"
      }),
      zeroHitLines: Object.freeze({
        count: 3157,
        sha256: "4cbb5823a6b2261c4b014d1e959cbf57b810a47903d08ffd16d6a3c4d5d78ab1"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1759,
        sha256: "5169dda9f7bf457fe4676e23d6c1650d8de24adc3fe7d2958145d966532435bb"
      })
    })
  }),
  Object.freeze({
    id: "frozen-pr36-035f037-single-process-v1",
    sourceHead: "035f0377bce97b8416f74f658bd6e1f8adbbac1a",
    sourceKind: "SINGLE_PROCESS_BASELINE",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3176,
        sha256: "ff94c61bd3a98324ec5202244bee5f9e7589f779dce02405bc8ea1bd255b3355"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "0d16a1e243523c4dbd2f9408acffffec7c77d3043ed09187da80f22085f262dd"
      }),
      zeroHitLines: Object.freeze({
        count: 3176,
        sha256: "c20b9dc8624c3320cbd28212e4bba1a6af4b8b682408cf64995cd97a7595c1e2"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1778,
        sha256: "cb2a134aa8ee0158cc3cea596edaade621a148e67a949f71bf0a6cdf01eba93f"
      })
    })
  }),
  Object.freeze({
    id: UNIQUE_OWNERSHIP_PROFILE_ID,
    sourceHead: "035f0377bce97b8416f74f658bd6e1f8adbbac1a",
    sourceKind: UNIQUE_OWNERSHIP_SOURCE_KIND,
    supersedesForTopology: "frozen-pr36-035f037-single-process-v1",
    supersessionReason: UNIQUE_OWNERSHIP_SUPERSESSION_REASON,
    removedObligationAudit: Object.freeze({
      canonicalTuple: UNIQUE_OWNERSHIP_REMOVED_TUPLE,
      baselineHit: 0,
      candidateHit: 396,
      auditArtifactSha256:
        "43388d69dd4253ae9880912dd0432cb2ef0fe9860ed243776fbf0a38897c68b7"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3176,
        sha256: "ff94c61bd3a98324ec5202244bee5f9e7589f779dce02405bc8ea1bd255b3355"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "0d16a1e243523c4dbd2f9408acffffec7c77d3043ed09187da80f22085f262dd"
      }),
      zeroHitLines: Object.freeze({
        count: 3176,
        sha256: "c20b9dc8624c3320cbd28212e4bba1a6af4b8b682408cf64995cd97a7595c1e2"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1777,
        sha256: "86729bdd6cab5519cbeab5f3e270955237f9832199f8d8bf5ae95fd38114b8f7"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b1-00160fc-ownership-v2-1",
    sourceHead: "00160fc342487506f33d713667d404d4ace734c4",
    sourceKind: "PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3185,
        sha256: "0cfec8ab5ed6c823b7fc0aa7647b61c7354c7fc279e49d08469afa46bdd51817"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "0b8011b10d4293987c00e4f76c2d734c481b8d9878a70e59be15913d938cad5c"
      }),
      zeroHitLines: Object.freeze({
        count: 3185,
        sha256: "c05c6e1960772a445430df01689249053b8ec169f62c40d4f494068e259b1d6a"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1781,
        sha256: "e2da7c5d301b86c069a33bbca78f0454ff3e131b78cab23e646707521c9ebac0"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b1-bf9f170-repair1-ownership-v2-1",
    sourceHead: "bf9f170590d90733a3bd5de810e0096fc40f4e84",
    sourceKind: "REPAIR_ROUND_1_STABLE_NINE_PROCESS_BASELINE",
    supersedesForTopology: "phase-3-slice-2b19a3b1-00160fc-ownership-v2-1",
    supersessionReason: "REPAIR_ROUND_1_TEST_AUTHORITY_AND_OWNERSHIP_REFRESH",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3184,
        sha256: "cfc7bc76d6a025779ddd2d1ca0937f68519a3ff10e13b2d586948d5840cd0202"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "0b8011b10d4293987c00e4f76c2d734c481b8d9878a70e59be15913d938cad5c"
      }),
      zeroHitLines: Object.freeze({
        count: 3184,
        sha256: "02529a665486258e5f856799d9511752afe88a978b5dac78bf7c422affbc59bf"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1773,
        sha256: "d54322bb82c9e86ee67f4b2164a36cf60f4f7f04c123f025003d97a4884ee6b6"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b1-c384c60-repair2-ownership-v2-1",
    sourceHead: "c384c60add75211bd20139b9e289da8fd6e15bb5",
    sourceKind: "REPAIR_ROUND_2_WINDOWS_TEST_STRUCTURE_STABLE_NINE_PROCESS_BASELINE",
    supersedesForTopology: "phase-3-slice-2b19a3b1-bf9f170-repair1-ownership-v2-1",
    supersessionReason: "REPAIR_ROUND_2_WINDOWS_SAME_TITLE_PROMISE_ALL_PROFILE_REFRESH",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3184,
        sha256: "cfc7bc76d6a025779ddd2d1ca0937f68519a3ff10e13b2d586948d5840cd0202"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "0b8011b10d4293987c00e4f76c2d734c481b8d9878a70e59be15913d938cad5c"
      }),
      zeroHitLines: Object.freeze({
        count: 3184,
        sha256: "02529a665486258e5f856799d9511752afe88a978b5dac78bf7c422affbc59bf"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1773,
        sha256: "d54322bb82c9e86ee67f4b2164a36cf60f4f7f04c123f025003d97a4884ee6b6"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19b-84aebe5-ownership-v2-1",
    sourceHead: "84aebe559cc9fd6d85571ec5753d4e36bdbfcb21",
    sourceKind: "PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1799,
        sha256: "8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19b-274036a-ownership-v2-1",
    sourceHead: "274036a09b96012a1bb5ddb08eabab9e6ad84214",
    sourceKind: "REPAIR_ROUND_1_STABLE_NINE_PROCESS_BASELINE",
    supersedesForTopology: "phase-3-slice-2b19b-84aebe5-ownership-v2-1",
    supersessionReason: "REPAIR_ROUND_1_TEST_EVIDENCE_AND_OWNERSHIP_REFRESH",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1799,
        sha256: "8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19b-c7313e2-ownership-v2-1",
    sourceHead: "c7313e253331505b163d4abe26c0c04c72afac88",
    sourceKind: "REPAIR_ROUND_2_STABLE_NINE_PROCESS_BASELINE",
    supersedesForTopology: "phase-3-slice-2b19b-274036a-ownership-v2-1",
    supersessionReason: "REPAIR_ROUND_2_CI_EVIDENCE_EXECUTION_STABILIZATION",
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1799,
        sha256: "8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19b-dcfa530-split-coverage-v1",
    sourceHead: "dcfa530540a57ce7b03e97958dd7de9926f71bbd",
    sourceKind: "TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION",
    supersedesForTopology: "phase-3-slice-2b19b-c7313e2-ownership-v2-1",
    supersessionReason: "DREAMER_VORTOX_CORE_AND_GAINED_COVERAGE_PROCESS_ISOLATION",
    topology: Object.freeze({
      id: "TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION",
      ordinaryGroups: 9,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 357 }),
        Object.freeze({ id: "application", tests: 456 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions",
          tests: 73
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 20
        }),
        Object.freeze({
          id: "application-service-dreamer-vortox-core",
          project: "application-service-dreamer-vortox",
          testNamePattern: "\\[(?:2B19A3A|2B19A3B1)-",
          tests: 16,
          skippedComplement: 10
        }),
        Object.freeze({
          id: "application-service-dreamer-vortox-gained",
          project: "application-service-dreamer-vortox",
          testNamePattern: "\\[2B19B-",
          tests: 10,
          skippedComplement: 16
        }),
        Object.freeze({ id: "engines-and-projections", tests: 239 })
      ]),
      physicalTestFiles: 31,
      workspaceProjectFileExecutions: 35,
      semanticTests: 1520,
      ordinaryProjectInventorySha256:
        "684c9186767c10489cf95eb81e8cbb76106f3812f6031a4b20b6043ffa8a150f",
      semanticInventorySha256:
        "3624db27bb52305f2d8edbf02d76e1688f1ed85bc5dadbe9938da2542393f91c",
      coverageExecutionSha256:
        "f01b6bbd30d6baf64d8c39a27e5d21485d562b4f68850d357a6053ddc50b059b",
      stabilityCandidates: 3,
      stabilityEvidenceSha256:
        "887065bb6511bc0b32b57b97907c441d1b142c111e18838936d37984204523c8"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1799,
        sha256: "8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef"
      })
    })
  })
]);

function parseArguments(argv) {
  if (argv.length === 2 && argv[0] === "--validate-candidate") {
    return { baseline: null, candidate: argv[1], profileId: null };
  }
  if (
    argv.length === 4 &&
    argv[0] === "--validate-candidate" &&
    argv[2] === "--profile"
  ) {
    return { baseline: null, candidate: argv[1], profileId: argv[3] };
  }
  if (argv.length === 2 && !argv[0].startsWith("--") && !argv[1].startsWith("--")) {
    return { baseline: argv[0], candidate: argv[1], profileId: null };
  }
  throw new Error(
    "Usage: node scripts/verify-coverage-obligations.mjs <baseline-coverage-final.json> <candidate-coverage-final.json>\n" +
      "   or: node scripts/verify-coverage-obligations.mjs --validate-candidate <coverage-final.json> [--profile <approved-profile-id>]"
  );
}

function validateApprovedProfiles() {
  const ids = new Set();
  for (const profile of APPROVED_COVERAGE_PROFILES) {
    if (
      profile === null ||
      typeof profile !== "object" ||
      typeof profile.id !== "string" ||
      profile.id.length === 0 ||
      typeof profile.sourceHead !== "string" ||
      !/^[0-9a-f]{40}$/u.test(profile.sourceHead) ||
      typeof profile.sourceKind !== "string" ||
      profile.sourceKind.length === 0
    ) {
      throw new Error("Approved coverage profile has invalid identity metadata");
    }
    if (ids.has(profile.id)) {
      throw new Error(`Approved coverage profile ID is duplicated: ${profile.id}`);
    }
    ids.add(profile.id);
    if (profile.id === UNIQUE_OWNERSHIP_PROFILE_ID) {
      if (
        profile.sourceKind !== UNIQUE_OWNERSHIP_SOURCE_KIND ||
        typeof profile.supersedesForTopology !== "string" ||
        profile.supersedesForTopology.length === 0 ||
        profile.supersessionReason !== UNIQUE_OWNERSHIP_SUPERSESSION_REASON ||
        profile.removedObligationAudit === null ||
        typeof profile.removedObligationAudit !== "object" ||
        profile.removedObligationAudit.canonicalTuple !==
          UNIQUE_OWNERSHIP_REMOVED_TUPLE ||
        profile.removedObligationAudit.baselineHit !== 0 ||
        !Number.isInteger(profile.removedObligationAudit.candidateHit) ||
        profile.removedObligationAudit.candidateHit <= 0 ||
        typeof profile.removedObligationAudit.auditArtifactSha256 !== "string" ||
        !/^[0-9a-f]{64}$/u.test(profile.removedObligationAudit.auditArtifactSha256)
      ) {
        throw new Error(`Process-isolated coverage profile has invalid audit metadata: ${profile.id}`);
      }
    }
  }
  for (const profile of APPROVED_COVERAGE_PROFILES) {
    if (
      profile.supersedesForTopology !== undefined &&
      (!ids.has(profile.supersedesForTopology) || profile.supersedesForTopology === profile.id)
    ) {
      throw new Error(`Coverage profile has invalid topology supersession metadata: ${profile.id}`);
    }
  }
  const uniqueOwnershipProfile = APPROVED_COVERAGE_PROFILES.find(
    (profile) => profile.id === UNIQUE_OWNERSHIP_PROFILE_ID
  );
  if (uniqueOwnershipProfile === undefined) {
    throw new Error(`Required coverage profile is missing: ${UNIQUE_OWNERSHIP_PROFILE_ID}`);
  }
  const supersededProfile = APPROVED_COVERAGE_PROFILES.find(
    (profile) => profile.id === uniqueOwnershipProfile.supersedesForTopology
  );
  if (
    supersededProfile === undefined ||
    uniqueOwnershipProfile.sourceHead !== supersededProfile.sourceHead
  ) {
    throw new Error("Unique-ownership profile must supersede the same source HEAD");
  }
  for (const name of [
    "sourceFiles",
    "zeroHitStatements",
    "zeroHitFunctions",
    "zeroHitLines"
  ]) {
    const current = uniqueOwnershipProfile.obligations[name];
    const previous = supersededProfile.obligations[name];
    if (
      current.count !== previous.count ||
      current.sha256 !== previous.sha256
    ) {
      throw new Error(`Unique-ownership profile changed a non-branch obligation group: ${name}`);
    }
  }
  if (
    uniqueOwnershipProfile.obligations.zeroHitBranchArms.count !==
    supersededProfile.obligations.zeroHitBranchArms.count - 1
  ) {
    throw new Error("Unique-ownership profile must remove exactly one zero-hit branch arm");
  }
}

function readCoverageMap(file) {
  const absolute = path.resolve(file);
  if (!existsSync(absolute)) {
    throw new Error(`Coverage map does not exist: ${absolute}`);
  }
  const parsed = JSON.parse(readFileSync(absolute, "utf8"));
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Coverage map is not an object: ${absolute}`);
  }
  if (Object.keys(parsed).length === 0) {
    throw new Error(`Coverage map is empty: ${absolute}`);
  }
  return parsed;
}

function canonicalSourceFile(file) {
  const normalized = file.replaceAll("\\", "/");
  const packageMarker = "/packages/";
  const markerIndex = normalized.lastIndexOf(packageMarker);
  if (markerIndex >= 0) {
    return normalized.slice(markerIndex + 1);
  }
  const relative = path.relative(process.cwd(), path.resolve(file)).split(path.sep).join("/");
  if (relative === ".." || relative.startsWith("../")) {
    throw new Error(`Coverage source file is outside the repository and packages tree: ${file}`);
  }
  return relative;
}

function assertCoverageEntryShape(file, entry) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    entry.statementMap === null ||
    typeof entry.statementMap !== "object" ||
    entry.fnMap === null ||
    typeof entry.fnMap !== "object" ||
    entry.branchMap === null ||
    typeof entry.branchMap !== "object" ||
    entry.s === null ||
    typeof entry.s !== "object" ||
    entry.f === null ||
    typeof entry.f !== "object" ||
    entry.b === null ||
    typeof entry.b !== "object"
  ) {
    throw new Error(`Coverage entry has an invalid shape: ${file}`);
  }
}

function canonicalPosition(position) {
  if (
    position === null ||
    typeof position !== "object" ||
    !Number.isInteger(position.line) ||
    !Number.isInteger(position.column)
  ) {
    throw new Error("Coverage location contains an invalid position");
  }
  return `${position.line}:${position.column}`;
}

function canonicalLocation(location) {
  if (location === null || typeof location !== "object") {
    throw new Error("Coverage map contains an invalid location");
  }
  return `${canonicalPosition(location.start)}-${canonicalPosition(location.end)}`;
}

function numericHit(value, context) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Coverage map contains an invalid hit count: ${context}`);
  }
  return value;
}

function summarizeCoverageMap(map) {
  const sourceFiles = new Set();
  const statements = new Set();
  const functions = new Set();
  const lines = new Set();
  const branchArms = new Set();

  for (const [rawFile, entry] of Object.entries(map)) {
    const file = canonicalSourceFile(rawFile);
    if (sourceFiles.has(file)) {
      throw new Error(`Coverage map contains duplicate canonical source file: ${file}`);
    }
    sourceFiles.add(file);
    assertCoverageEntryShape(file, entry);

    const lineHits = new Map();
    for (const [statementId, location] of Object.entries(entry.statementMap)) {
      if (!Object.hasOwn(entry.s, statementId)) {
        throw new Error(`Statement ${statementId} is missing its hit count in ${file}`);
      }
      const hits = numericHit(entry.s[statementId], `${file} statement ${statementId}`);
      const locationIdentity = canonicalLocation(location);
      if (hits === 0) {
        statements.add(`${file}|${locationIdentity}`);
      }
      const line = location.start.line;
      lineHits.set(line, Math.max(lineHits.get(line) ?? 0, hits));
    }
    for (const [line, hits] of lineHits) {
      if (hits === 0) {
        lines.add(`${file}|${line}`);
      }
    }

    for (const [functionId, definition] of Object.entries(entry.fnMap)) {
      if (!Object.hasOwn(entry.f, functionId)) {
        throw new Error(`Function ${functionId} is missing its hit count in ${file}`);
      }
      const hits = numericHit(entry.f[functionId], `${file} function ${functionId}`);
      if (
        definition === null ||
        typeof definition !== "object" ||
        typeof definition.name !== "string"
      ) {
        throw new Error(`Function ${functionId} has an invalid definition in ${file}`);
      }
      if (hits === 0) {
        functions.add(
          `${file}|${JSON.stringify(definition.name)}|decl:${canonicalLocation(definition.decl)}|loc:${canonicalLocation(definition.loc)}`
        );
      }
    }

    for (const [branchId, definition] of Object.entries(entry.branchMap)) {
      const counts = entry.b[branchId];
      if (
        definition === null ||
        typeof definition !== "object" ||
        typeof definition.type !== "string" ||
        !Array.isArray(counts) ||
        !Array.isArray(definition.locations)
      ) {
        throw new Error(`Branch ${branchId} has an invalid definition or count array in ${file}`);
      }
      if (counts.length !== definition.locations.length) {
        throw new Error(`Branch ${branchId} count/location length mismatch in ${file}`);
      }
      const branchLocation = canonicalLocation(definition.loc);
      for (let armIndex = 0; armIndex < counts.length; armIndex += 1) {
        const hits = numericHit(counts[armIndex], `${file} branch ${branchId} arm ${armIndex}`);
        if (hits === 0) {
          const identity = `${file}|type:${JSON.stringify(definition.type)}|branch:${branchLocation}|arm:${armIndex}|location:${canonicalLocation(definition.locations[armIndex])}`;
          if (branchArms.has(identity)) {
            throw new Error(
              `Coverage map contains duplicate canonical uncovered branch-arm identity in ${file}: ${identity}`
            );
          }
          branchArms.add(identity);
        }
      }
    }
  }

  return { sourceFiles, statements, functions, lines, branchArms };
}

function listProductionTypeScriptFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listProductionTypeScriptFiles(absolute));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".d.ts")
    ) {
      files.push(absolute);
    }
  }
  return files;
}

function validateWorkspaceSourcePackages(summary) {
  const packagesRoot = path.resolve("packages");
  if (!existsSync(packagesRoot) || !statSync(packagesRoot).isDirectory()) {
    throw new Error(`Workspace packages directory does not exist: ${packagesRoot}`);
  }
  const coveredPackages = new Set(
    [...summary.sourceFiles]
      .filter((file) => file.startsWith("packages/"))
      .map((file) => file.split("/").slice(0, 2).join("/"))
  );
  const requiredPackages = [];
  for (const packageEntry of readdirSync(packagesRoot, { withFileTypes: true })) {
    if (!packageEntry.isDirectory()) {
      continue;
    }
    const sourceDirectory = path.join(packagesRoot, packageEntry.name, "src");
    if (
      existsSync(sourceDirectory) &&
      statSync(sourceDirectory).isDirectory() &&
      listProductionTypeScriptFiles(sourceDirectory).length > 0
    ) {
      requiredPackages.push(`packages/${packageEntry.name}`);
    }
  }
  const missingPackages = requiredPackages.filter((packageName) => !coveredPackages.has(packageName));
  if (missingPackages.length > 0) {
    throw new Error(`Coverage map is missing source packages: ${missingPackages.join(", ")}`);
  }
  return requiredPackages.sort();
}

function hashSet(set) {
  return createHash("sha256").update([...set].sort().join("\n"), "utf8").digest("hex");
}

function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function comparisonFor(name, baseline, candidate) {
  const added = setDifference(candidate, baseline);
  const removed = setDifference(baseline, candidate);
  return {
    name,
    baseline: baseline.size,
    candidate: candidate.size,
    added: added.length,
    removed: removed.length,
    addedSample: added.slice(0, 20),
    removedSample: removed.slice(0, 20),
    baselineSha256: hashSet(baseline),
    candidateSha256: hashSet(candidate)
  };
}

function summarizeForOutput(summary, requiredPackages) {
  return {
    sourceFiles: summary.sourceFiles.size,
    zeroHitStatements: summary.statements.size,
    zeroHitFunctions: summary.functions.size,
    zeroHitLines: summary.lines.size,
    zeroHitBranchArms: summary.branchArms.size,
    requiredSourcePackages: requiredPackages,
    sourceFilesSha256: hashSet(summary.sourceFiles),
    zeroHitStatementsSha256: hashSet(summary.statements),
    zeroHitFunctionsSha256: hashSet(summary.functions),
    zeroHitLinesSha256: hashSet(summary.lines),
    zeroHitBranchArmsSha256: hashSet(summary.branchArms)
  };
}

function obligationGroups(summary) {
  return {
    sourceFiles: {
      count: summary.sourceFiles.size,
      sha256: hashSet(summary.sourceFiles)
    },
    zeroHitStatements: {
      count: summary.statements.size,
      sha256: hashSet(summary.statements)
    },
    zeroHitFunctions: {
      count: summary.functions.size,
      sha256: hashSet(summary.functions)
    },
    zeroHitLines: {
      count: summary.lines.size,
      sha256: hashSet(summary.lines)
    },
    zeroHitBranchArms: {
      count: summary.branchArms.size,
      sha256: hashSet(summary.branchArms)
    }
  };
}

function compareToApprovedProfile(candidateGroups, profile) {
  const groups = Object.fromEntries(
    Object.entries(profile.obligations).map(([name, expected]) => {
      const candidate = candidateGroups[name];
      if (candidate === undefined) {
        throw new Error(`Approved profile contains an unknown obligation group: ${name}`);
      }
      return [
        name,
        {
          expectedCount: expected.count,
          candidateCount: candidate.count,
          countMatches: expected.count === candidate.count,
          expectedSha256: expected.sha256,
          candidateSha256: candidate.sha256,
          sha256Matches: expected.sha256 === candidate.sha256,
          matches:
            expected.count === candidate.count && expected.sha256 === candidate.sha256
        }
      ];
    })
  );
  return {
    profileId: profile.id,
    sourceHead: profile.sourceHead,
    sourceKind: profile.sourceKind,
    supersedesForTopology: profile.supersedesForTopology ?? null,
    supersessionReason: profile.supersessionReason ?? null,
    removedObligationAudit: profile.removedObligationAudit ?? null,
    matches: Object.values(groups).every((group) => group.matches),
    groups
  };
}

function main() {
  validateApprovedProfiles();
  const options = parseArguments(process.argv.slice(2));
  const candidate = summarizeCoverageMap(readCoverageMap(options.candidate));
  const requiredPackages = validateWorkspaceSourcePackages(candidate);

  if (options.baseline === null) {
    const candidateGroups = obligationGroups(candidate);
    const profiles = APPROVED_COVERAGE_PROFILES.map((profile) =>
      compareToApprovedProfile(candidateGroups, profile)
    );
    const matches = profiles.filter((profile) => profile.matches);
    const requestedProfile =
      options.profileId === null
        ? null
        : profiles.find((profile) => profile.profileId === options.profileId);
    if (options.profileId !== null && requestedProfile === undefined) {
      throw new Error(`Unknown approved coverage profile: ${options.profileId}`);
    }
    const verdict =
      requestedProfile !== null
        ? requestedProfile.matches
          ? "COVERAGE_APPROVED_PROFILE_MATCH"
          : "COVERAGE_REQUESTED_PROFILE_MISMATCH"
        : matches.length === 1
          ? "COVERAGE_APPROVED_PROFILE_MATCH"
          : matches.length === 0
            ? "COVERAGE_APPROVED_PROFILE_MISMATCH"
            : "COVERAGE_APPROVED_PROFILE_AMBIGUOUS";
    process.stdout.write(
      `${JSON.stringify(
        {
          verdict,
          requestedProfileId: options.profileId,
          matchedProfileId:
            requestedProfile !== null && requestedProfile.matches
              ? requestedProfile.profileId
              : matches.length === 1
                ? matches[0].profileId
                : null,
          candidate: summarizeForOutput(candidate, requiredPackages),
          profiles
        },
        null,
        2
      )}\n`
    );
    if (verdict !== "COVERAGE_APPROVED_PROFILE_MATCH") {
      process.exitCode = 1;
    }
    return;
  }

  const baseline = summarizeCoverageMap(readCoverageMap(options.baseline));
  const comparisons = [
    comparisonFor("sourceFiles", baseline.sourceFiles, candidate.sourceFiles),
    comparisonFor("zeroHitStatements", baseline.statements, candidate.statements),
    comparisonFor("zeroHitFunctions", baseline.functions, candidate.functions),
    comparisonFor("zeroHitLines", baseline.lines, candidate.lines),
    comparisonFor("zeroHitBranchArms", baseline.branchArms, candidate.branchArms)
  ];
  const hasDifference = comparisons.some(
    (comparison) => comparison.added !== 0 || comparison.removed !== 0
  );
  const result = {
    verdict: hasDifference
      ? "COVERAGE_SEMANTIC_OBLIGATIONS_DIFFER"
      : "COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL",
    baseline: summarizeForOutput(baseline, validateWorkspaceSourcePackages(baseline)),
    candidate: summarizeForOutput(candidate, requiredPackages),
    comparisons
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (hasDifference) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
