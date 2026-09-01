import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  COVERAGE_PROFILE_LIFECYCLE_STATUSES,
  COVERAGE_PROFILE_RECORDS,
  COVERAGE_PROFILE_REGISTRY_SCHEMA_VERSION,
  COVERAGE_PROFILE_SELECTORS
} from "./coverage-profile-registry.mjs";

const UNIQUE_OWNERSHIP_PROFILE_ID = "frozen-pr36-035f037-ownership-v2-1";
const UNIQUE_OWNERSHIP_SOURCE_KIND =
  "PROCESS_ISOLATED_UNIQUE_TEST_OWNERSHIP_BASELINE";
const UNIQUE_OWNERSHIP_SUPERSESSION_REASON =
  "UNIQUE_APPLICATION_TEST_OWNERSHIP_AND_GENUINE_BRANCH_COVERAGE_IMPROVEMENT";
const UNIQUE_OWNERSHIP_REMOVED_TUPLE =
  'packages/domain-core/src/first-night-ability-outcome-ledger.ts|type:"branch"|branch:473:476-473:531|arm:0|location:473:476-473:531';
const REGISTRY_RECORD_KEYS = Object.freeze([
  "profileId", "schemaVersion", "lifecycleStatus", "sourceHead", "sourceCount", "testIdentityCount", "inventorySha256",
  "tupleSha256", "profileArtifactPath", "logicalGroupCount", "physicalGroupCount", "previousProfileId", "sourceDelta", "testDelta", "unexplainedLoss"
]);
const PROFILE_ARTIFACT_KEYS = Object.freeze([
  "schemaVersion", "profileId", "sourceHead", "sourceCount", "testIdentityCount", "inventorySha256", "tupleSha256",
  "logicalGroupCount", "physicalGroupCount", "profileSha256", "topology", "obligations"
]);
const PROFILE_BODY_KEYS = Object.freeze(PROFILE_ARTIFACT_KEYS.slice(1).filter((key) => key !== "profileSha256"));
const PROFILE_TOPOLOGY_KEYS = Object.freeze([
  "topologyId", "ordinaryLogicalGroupCount", "ordinaryPhysicalGroupCount", "coverageLogicalGroupCount", "coveragePhysicalGroupCount",
  "coverageGroups", "coverageGlobalManifestSha256", "coverageFinalSha256", "normalizedTupleSetsSha256", "fullTupleDeltaSha256", "baselineVersion"
]);
const PROFILE_OBLIGATION_KEYS = Object.freeze(["sourceFiles", "zeroHitStatements", "zeroHitFunctions", "zeroHitLines", "zeroHitBranchArms"]);
const FROZEN_REGISTRY_PREFIX_SHA256 = "d246cd0fa855716f32757d21f69973b8cf90b847085c185f3d66d19948db8ab8";
const FROZEN_COVERAGE_GROUPS = Object.freeze([
  ["domain-core-rebuild", 207], ["domain-core-rest", 503], ["application", 465], ["application-service-core", 90],
  ["application-service-role-actions", 52], ["application-service-information-and-later-actions-base", 73],
  ["application-service-information-and-later-actions-a3b2", 9], ["application-service-compatibility-and-failure-boundaries", 26],
  ["application-service-dreamer-vortox-core", 36, [["legacy", 14], ["2b20a", 22]]],
  ["application-service-dreamer-vortox-gained", 10], ["engines-and-projections", 241]
].map(([id, tests, segments]) => Object.freeze({ id, tests, ...(segments === undefined ? {} : { physicalSegments: Object.freeze(segments.map(([segmentId, segmentTests]) => Object.freeze({ id: segmentId, tests: segmentTests }))) }) })));
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
  }),
  Object.freeze({
    id: "foundation-command-capture-proxy-rejection-v1-ea08ddd",
    sourceHead: "ea08ddd979bc8d3e825efdf5b290bd0c3e85942f",
    sourceKind: "TEN_PROCESS_COMMAND_CAPTURE_PROXY_REJECTION_V1",
    topology: Object.freeze({
      id: "TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION",
      ordinaryGroups: 9,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 357 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions",
          tests: 73
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
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
      semanticTests: 1535,
      ordinaryProjectInventorySha256:
        "f764c30ac1baaaf56aa0c2e7ad8c712ebeac38e65d42fb574146f58eafed3a18",
      semanticInventorySha256:
        "c002db40d8d188aed38e37ba2ebad67d7a4821e9cdf0266d680436601f77167f",
      coverageExecutionSha256:
        "f98832bbc0c7b878c10b5db0dec98fd202b1ad35177a55812dc75c949c1483b3",
      stabilityCandidates: 3,
      coverageHarnessCorrection: 2,
      stabilityEvidenceSha256:
        "09e629e96f4643e933d0220cef10973e1712e1689df170057fc32f2db77992de"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3206,
        sha256: "e92487ebecdb3e1d91878ea849682a399e53bad1be3fe90afd8dbc4e28276307"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec"
      }),
      zeroHitLines: Object.freeze({
        count: 3206,
        sha256: "20b968074484d3f6e6745aa340eef2164141a60056d7b15b53c0bfbf4a187b27"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1800,
        sha256: "a85b196fe4da848fd32ac824c09ef6247f0a5a27ddea94abed9b790a0bfaad63"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b2-2c5f2f6-ownership-v1",
    sourceHead: "2c5f2f62d8c07e83148242a8c5862c9d2019e9e6",
    sourceKind: "TEN_PROCESS_2B19A3B2_OWNERSHIP_V1",
    topology: Object.freeze({
      id: "TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION",
      ordinaryGroups: 9,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 357 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions",
          tests: 82
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
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
      semanticTests: 1544,
      ordinaryProjectInventorySha256:
        "f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a",
      semanticInventorySha256:
        "a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6",
      coverageExecutionSha256:
        "1e11e13f1549363109a223026f4191664fe8c26ce66d5f2219ca46b141bfadf0",
      stabilityCandidates: 3,
      ordinaryHarnessCorrection: 1,
      stabilityEvidenceSha256:
        "ad08f0f86efdfd53dc2e8faa6328e3519a07bf504eae3b810abf1122a554444f"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1795,
        sha256: "6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b2-cfd6982-repair1-ownership-v1",
    sourceHead: "cfd6982652960096c552950cc94ac41c5f220824",
    sourceKind: "REPAIR_ROUND_1_TEST_EVIDENCE_EXECUTION_STABLE_TEN_PROCESS",
    topology: Object.freeze({
      id: "TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION",
      ordinaryGroups: 9,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 357 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions",
          tests: 82
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
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
      semanticTests: 1544,
      ordinaryProjectInventorySha256:
        "f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a",
      semanticInventorySha256:
        "a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6",
      coverageExecutionSha256:
        "1e11e13f1549363109a223026f4191664fe8c26ce66d5f2219ca46b141bfadf0",
      stabilityCandidates: 3,
      coverageHarnessCorrection: 2,
      stabilityEvidenceSha256:
        "fa4a73140d5c320788ac516eec2f331f857578b9a0b5e3b78fa9ec6f7b3b40e8"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1795,
        sha256: "6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b2-d6e3964-repair2-ownership-v1",
    sourceHead: "d6e3964fcd9a5ea2c57ceee4d9aaaf154de23b83",
    sourceKind: "REPAIR_ROUND_2_FINAL_TEST_EVIDENCE_EXECUTION_STABLE_TEN_PROCESS",
    topology: Object.freeze({
      id: "TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION",
      ordinaryGroups: 9,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 357 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions",
          tests: 82
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
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
      semanticTests: 1544,
      ordinaryProjectInventorySha256:
        "f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a",
      semanticInventorySha256:
        "a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6",
      coverageExecutionSha256:
        "1e11e13f1549363109a223026f4191664fe8c26ce66d5f2219ca46b141bfadf0",
      stabilityCandidates: 3,
      coverageHarnessCorrection: 1,
      stabilityEvidenceSha256:
        "f927d6209c42f302166e664ad359936454bee7a554869ce76bdb3af7360cba46"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1795,
        sha256: "6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2",
    sourceHead: "6a4705c0a6685c6f954a1b0db9870457122f24f4",
    sourceKind: "THREE_ARTIFACT_COMPLETE_GITHUB_HOSTED_EXECUTIONS",
    topology: Object.freeze({
      id: "ELEVEN_PROCESS_COVERAGE_WITH_INFORMATION_A3B2_AND_DREAMER_VORTOX_MARKER_PARTITIONS",
      ordinaryGroups: 9,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 357 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions-base",
          project: "application-service-information-and-later-actions",
          testNamePattern: "^(?!.*\\[2B19A3B2-).*$",
          tests: 73,
          skippedComplement: 9
        }),
        Object.freeze({
          id: "application-service-information-and-later-actions-a3b2",
          project: "application-service-information-and-later-actions",
          testNamePattern: "\\[2B19A3B2-",
          tests: 9,
          skippedComplement: 73
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
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
      semanticTests: 1544,
      ordinaryProjectInventorySha256:
        "f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a",
      semanticInventorySha256:
        "a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6",
      coverageExecutionSha256:
        "1d6726c01527d43edd6bc9e1473268b55af54756472fb64d713ff3590d61cc3f",
      stabilityCandidates: 3,
      hostedRuns: Object.freeze([
        Object.freeze({ id: 30004324413, attempt: 1, event: "pull_request" }),
        Object.freeze({ id: 30004295030, attempt: 2, event: "push" }),
        Object.freeze({ id: 30007628335, attempt: 1, event: "pull_request" })
      ]),
      stabilityEvidenceSha256:
        "008eb7bc033240bcf25311c717d033344ee9c831582b1a67071e0d873df828de"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3204,
        sha256: "d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec"
      }),
      zeroHitLines: Object.freeze({
        count: 3204,
        sha256: "fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1795,
        sha256: "6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b20ap2-cc82a95-hosted-execution-v1",
    sourceHead: "cc82a95a258ad943e1d1a28b9c44ea51fe45bfa1",
    sourceKind: "EXACT_SOURCE_SEGMENTED_COVERAGE_AUTHORITY",
    topology: Object.freeze({
      id: "TWELVE_PHYSICAL_ELEVEN_LOGICAL_COVERAGE_WITH_DREAMER_CORE_SEGMENTS",
      ordinaryGroups: 9,
      ordinaryPhysicalBlobs: 11,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 363 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions-base",
          tests: 73
        }),
        Object.freeze({
          id: "application-service-information-and-later-actions-a3b2",
          tests: 9
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
        }),
        Object.freeze({
          id: "application-service-dreamer-vortox-core",
          tests: 36,
          physicalSegments: Object.freeze([
            Object.freeze({ id: "legacy", tests: 14 }),
            Object.freeze({ id: "2b20a", tests: 22 })
          ])
        }),
        Object.freeze({
          id: "application-service-dreamer-vortox-gained",
          tests: 10
        }),
        Object.freeze({ id: "engines-and-projections", tests: 241 })
      ]),
      coveragePhysicalBlobs: 12,
      coverageLogicalGroups: 11,
      semanticTests: 1572,
      coverageGlobalManifestSha256:
        "02d152e2c223f98c09b57e696b263acd0494a35b5e0a8e71914afbe5529dfca4",
      coverageFinalSha256:
        "e97ab10ab7d763aee40f1cba0ff288aca2bcff963d21d4acf6b14780004dfe2b",
      normalizedTupleSetsSha256:
        "5e6d1e333f99f77fb5d4b8c71adc2d00146f0d1f52c72b933a36f3a807448f82",
      fullTupleDeltaSha256:
        "4f45f1b09311f8994c2fb0fff336303e2ef2e742233b96a400070a47f855338a"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3217,
        sha256: "851add3e897ea59b8b1d86fbde3c52b792d466902f3705958d97dfba174224fe"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be"
      }),
      zeroHitLines: Object.freeze({
        count: 3217,
        sha256: "c37a009f8cbca2bfa30ece8349b5864751e4274b4e4c19ca29bf0ea03acb166f"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1808,
        sha256: "12e72ae3e8a02fa18425f14f804c9f630537dff1534e9dcb0168833718622a7d"
      })
    })
  }),
  Object.freeze({
    id: "phase-3-slice-2b20a-4d576e2-final-restoration-v1",
    sourceHead: "4d576e205cb20c37ba913b923a1cd39e8d800d18",
    sourceKind: "EXACT_SOURCE_SEGMENTED_COVERAGE_AUTHORITY",
    topology: Object.freeze({
      id: "TWELVE_PHYSICAL_ELEVEN_LOGICAL_COVERAGE_WITH_DREAMER_CORE_SEGMENTS",
      ordinaryGroups: 9,
      ordinaryPhysicalBlobs: 11,
      coverageGroups: Object.freeze([
        Object.freeze({ id: "domain-core-rebuild", tests: 207 }),
        Object.freeze({ id: "domain-core-rest", tests: 363 }),
        Object.freeze({ id: "application", tests: 465 }),
        Object.freeze({ id: "application-service-core", tests: 90 }),
        Object.freeze({ id: "application-service-role-actions", tests: 52 }),
        Object.freeze({
          id: "application-service-information-and-later-actions-base",
          tests: 73
        }),
        Object.freeze({
          id: "application-service-information-and-later-actions-a3b2",
          tests: 9
        }),
        Object.freeze({
          id: "application-service-compatibility-and-failure-boundaries",
          tests: 26
        }),
        Object.freeze({
          id: "application-service-dreamer-vortox-core",
          tests: 36,
          physicalSegments: Object.freeze([
            Object.freeze({ id: "legacy", tests: 14 }),
            Object.freeze({ id: "2b20a", tests: 22 })
          ])
        }),
        Object.freeze({
          id: "application-service-dreamer-vortox-gained",
          tests: 10
        }),
        Object.freeze({ id: "engines-and-projections", tests: 241 })
      ]),
      coveragePhysicalBlobs: 12,
      coverageLogicalGroups: 11,
      semanticTests: 1572,
      coverageGlobalManifestSha256:
        "1696dd46a40fe776423bb8fe7594d90906cc0376e25fcb587cca149e7259ce57",
      coverageFinalSha256:
        "79d0577a13a81ead79c47e55cb6a5010b129fb030e60a11b403438b1dffae22a",
      normalizedTupleSetsSha256:
        "624e27cab000978c3c009fdf5fb613f29a8d7a04d4b40240780bdc0d8bf1967a",
      fullTupleDeltaSha256:
        "8e6ed9ebe2239b48dafd33e3ce1973054d8a5e6225d8f64c1513f3720090e206"
    }),
    obligations: Object.freeze({
      sourceFiles: Object.freeze({
        count: 63,
        sha256: "f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691"
      }),
      zeroHitStatements: Object.freeze({
        count: 3213,
        sha256: "b493744842f7a96e4bb82b54584d0db416c87719b6a69fcb39140fe2aeeff81a"
      }),
      zeroHitFunctions: Object.freeze({
        count: 23,
        sha256: "f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be"
      }),
      zeroHitLines: Object.freeze({
        count: 3213,
        sha256: "e611244a0d6e1f1720db6b1f83260ae17dd40af34a04b035a9c1116a318d0c86"
      }),
      zeroHitBranchArms: Object.freeze({
        count: 1807,
        sha256: "6637b557feb45600e3904a16373b00bc65d76500d3e339c594879a745e0d96a3"
      })
    })
  })
]);
const CURRENT_PROFILE_ID = "phase-3-slice-2c-closure-52c4e97-coverage-v1";
const CURRENT_PROFILE_SOURCE_HEAD = "52c4e975ea0b3e38890318ed253718f552d77427";
const SLICE3_PROFILE_ID = "phase-3-slice-3-c5c8f6f-coverage-v1";
const SLICE3_PROFILE_SOURCE_HEAD = "c5c8f6fabe863f9ec45536305d87c1d5ad2e209b";
const SLICE4_PROFILE_ID = "phase-3-slice-4-c7142a5-coverage-v1";
const SLICE4_PROFILE_SOURCE_HEAD = "0f42d5909f24d41d5dbda61d347b570dbc46a93f";
const PREVIOUS_PROFILE_ID = "phase-3-slice-2c-correction-2290425-coverage-v1";
const PREVIOUS_PROFILE_SOURCE_HEAD = "2290425eb7fe79126583a27ef1c3b7a1c9a15a8a";
const OLDER_PROFILE_ID = "phase-3-slice-2c-correction-98a27cf-coverage-v1";
const OLDER_PROFILE_SOURCE_HEAD = "98a27cf2fe6528176f0b9fffad332a8ba32d0de7";
const PREVIOUS_COVERAGE_GROUPS = Object.freeze(FROZEN_COVERAGE_GROUPS.map((group) =>
  group.id === "domain-core-rest" ? { ...group, tests: 509 } :
    group.id === "application-service-core" ? { ...group, tests: 91 } : group
));
const OLDER_COVERAGE_GROUPS = Object.freeze(FROZEN_COVERAGE_GROUPS.map((group) =>
  group.id === "domain-core-rest" ? { ...group, tests: 506 } : group
));
const CURRENT_COVERAGE_GROUPS = Object.freeze(FROZEN_COVERAGE_GROUPS.map((group) =>
  group.id === "domain-core-rest" ? { ...group, tests: 518 } :
    group.id === "application-service-core" ? { ...group, tests: 91 } : group
));
const SLICE3_COVERAGE_GROUPS = Object.freeze(FROZEN_COVERAGE_GROUPS.map((group) =>
  group.id === "domain-core-rest" ? { ...group, tests: 518 } :
    group.id === "application-service-core" ? { ...group, tests: 96 } : group
));
const SLICE4_COVERAGE_GROUPS = Object.freeze(SLICE3_COVERAGE_GROUPS.map((group) =>
  group.id === "engines-and-projections" ? { ...group, tests: 254 } : group
));
const HISTORICAL_CLOSURE_COVERAGE_GROUPS = Object.freeze(FROZEN_COVERAGE_GROUPS.map((group) =>
  group.id === "domain-core-rest" ? { ...group, tests: 509 } :
    group.id === "application-service-core" ? { ...group, tests: 91 } : group
));
const HISTORICAL_FINAL_CLOSURE_COVERAGE_GROUPS = Object.freeze(FROZEN_COVERAGE_GROUPS.map((group) =>
  group.id === "domain-core-rest" ? { ...group, tests: 515 } :
    group.id === "application-service-core" ? { ...group, tests: 91 } : group
));

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

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function assertExactPlain(value, keys, label, errorClass = "COVERAGE_PROFILE_REGISTRY_INVALID") {
  assertCondition(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype && Object.keys(value).length === keys.length &&
    Object.keys(value).every((key, index) => key === keys[index]), `${errorClass}: ${label}`);
}

function assertFrozenData(value, label) {
  if (value === null || typeof value !== "object") return;
  assertCondition(Object.isFrozen(value) && [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value)) &&
    Reflect.ownKeys(value).every((key) => typeof key !== "symbol"), `COVERAGE_PROFILE_REGISTRY_INVALID: ${label} is not frozen plain data`);
  for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value)))
    assertCondition(Object.hasOwn(descriptor, "value"), `COVERAGE_PROFILE_REGISTRY_INVALID: ${label}.${key} is not data`),
    assertFrozenData(descriptor.value, `${label}.${key}`);
}

function validCount(value, nullable = false) { return (nullable && value === null) || (Number.isSafeInteger(value) && value >= 0); }

function validSha(value, nullable = false) { return (nullable && value === null) || (typeof value === "string" && /^[0-9a-f]{64}$/u.test(value)); }

function validateDelta(value, label) {
  if (value === null) return;
  assertExactPlain(value, ["added", "removed"], label);
  assertCondition(validCount(value.added) && validCount(value.removed) && Object.isFrozen(value), `COVERAGE_PROFILE_REGISTRY_INVALID: ${label}`);
}
function registryPrefixSha256(records) {
  const prefix = records.slice(0, 17).map((record, index) => index === 16 ? { ...record, lifecycleStatus: "LEGACY_SELECTED" } : { ...record });
  return createHash("sha256").update(`${JSON.stringify(prefix, null, 2)}\n`, "utf8").digest("hex");
}
function validateFrozenRegistryPrefix(records) {
  assertCondition(registryPrefixSha256(records) === FROZEN_REGISTRY_PREFIX_SHA256, "COVERAGE_PROFILE_REGISTRY_INVALID: immutable 17-record prefix");
}
function validateRegistry() {
  assertCondition(COVERAGE_PROFILE_REGISTRY_SCHEMA_VERSION === "botc-coverage-profile-registry-v3" &&
    COVERAGE_PROFILE_LIFECYCLE_STATUSES.join(",") === "HISTORICAL,LEGACY_SELECTED,ACTIVE" &&
    COVERAGE_PROFILE_RECORDS.length >= 17, "COVERAGE_PROFILE_REGISTRY_INVALID: module header");
  assertFrozenData(COVERAGE_PROFILE_LIFECYCLE_STATUSES, "lifecycle statuses");
  assertFrozenData(COVERAGE_PROFILE_RECORDS, "records");
  assertFrozenData(COVERAGE_PROFILE_SELECTORS, "selectors");
  assertExactPlain(COVERAGE_PROFILE_SELECTORS, ["CI_COVERAGE_PROFILE"], "selectors");
  const ids = new Set();
  for (const [index, record] of COVERAGE_PROFILE_RECORDS.entries()) {
    assertExactPlain(record, REGISTRY_RECORD_KEYS, `record ${index}`);
    assertCondition(/^[a-z0-9][a-z0-9.-]*$/u.test(record.profileId) && !ids.has(record.profileId) &&
      record.schemaVersion === COVERAGE_PROFILE_REGISTRY_SCHEMA_VERSION && COVERAGE_PROFILE_LIFECYCLE_STATUSES.includes(record.lifecycleStatus) &&
      /^[0-9a-f]{40}$/u.test(record.sourceHead) && validCount(record.sourceCount) && validCount(record.testIdentityCount, true) &&
      validSha(record.inventorySha256, true) && validSha(record.tupleSha256, true) && validCount(record.logicalGroupCount, true) &&
      validCount(record.physicalGroupCount, true) && validCount(record.unexplainedLoss, true) && !path.isAbsolute(record.profileArtifactPath) &&
      !record.profileArtifactPath.includes("\\") && record.profileArtifactPath.split("/").every((part) => !["", ".", ".."].includes(part)) &&
      (record.previousProfileId === null || ids.has(record.previousProfileId)), `COVERAGE_PROFILE_REGISTRY_INVALID: record ${index}`);
    validateDelta(record.sourceDelta, `record ${index} sourceDelta`);
    validateDelta(record.testDelta, `record ${index} testDelta`);
    ids.add(record.profileId);
  }
  validateFrozenRegistryPrefix(COVERAGE_PROFILE_RECORDS);
  const selected = COVERAGE_PROFILE_RECORDS.filter((record) => record.lifecycleStatus !== "HISTORICAL");
  const latest = COVERAGE_PROFILE_RECORDS.at(-1);
  const legacyState = COVERAGE_PROFILE_RECORDS.length === 17;
  assertCondition(selected.length === 1 && COVERAGE_PROFILE_SELECTORS.CI_COVERAGE_PROFILE === selected[0].profileId &&
    (legacyState ? selected[0] === latest && selected[0].lifecycleStatus === "LEGACY_SELECTED" &&
      COVERAGE_PROFILE_RECORDS.slice(0, 16).every((record) => record.lifecycleStatus === "HISTORICAL") &&
      COVERAGE_PROFILE_RECORDS.every((record) => record.profileArtifactPath === "scripts/verify-coverage-obligations.mjs") :
      selected[0] === latest && selected[0].lifecycleStatus === "ACTIVE" && COVERAGE_PROFILE_RECORDS.slice(0, 17).every((record) =>
        record.lifecycleStatus === "HISTORICAL" && record.profileArtifactPath === "scripts/verify-coverage-obligations.mjs") &&
      selected[0].sourceCount >= 0 && selected[0].testIdentityCount !== null &&
      selected[0].inventorySha256 !== null && selected[0].tupleSha256 !== null &&
      selected[0].logicalGroupCount !== null && selected[0].physicalGroupCount !== null && selected[0].previousProfileId !== null &&
      selected[0].sourceDelta !== null && selected[0].testDelta !== null && selected[0].unexplainedLoss === 0 &&
      COVERAGE_PROFILE_RECORDS.slice(17, -1).every((record) => record.lifecycleStatus === "HISTORICAL") &&
      COVERAGE_PROFILE_RECORDS.slice(17).every((record, index, records) => index === 0 || record.previousProfileId === records[index - 1].profileId)),
  "COVERAGE_PROFILE_SELECTOR_INVALID");
  return { records: COVERAGE_PROFILE_RECORDS, selectedProfileId: selected[0].profileId };
}

function assertRegistryLifecycleState(records, selector) {
  const selected = records.filter((record) => record.lifecycleStatus !== "HISTORICAL");
  const latest = records.at(-1);
  assertCondition(selected.length === 1 && selected[0] === latest && selector === latest.profileId,
    "COVERAGE_PROFILE_SELECTOR_INVALID");
  if (records.length === 17) {
    assertCondition(latest.lifecycleStatus === "LEGACY_SELECTED" && records.slice(0, 16).every((record) => record.lifecycleStatus === "HISTORICAL"),
      "COVERAGE_PROFILE_SELECTOR_INVALID");
    return;
  }
  assertCondition(latest.lifecycleStatus === "ACTIVE" && records.slice(0, 17).every((record) => record.lifecycleStatus === "HISTORICAL"),
    "COVERAGE_PROFILE_SELECTOR_INVALID");
  assertCondition(records.slice(17, -1).every((record) => record.lifecycleStatus === "HISTORICAL") &&
    records.slice(17).every((record, index, appended) => index === 0 || record.previousProfileId === appended[index - 1].profileId),
    "COVERAGE_PROFILE_SELECTOR_INVALID");
}

function validateLegacyArtifacts(records) {
  const legacyRecords = records.filter((record) =>
    record.profileArtifactPath === "scripts/verify-coverage-obligations.mjs"
  );
  assertCondition(legacyRecords.length === 17 && APPROVED_COVERAGE_PROFILES.length === 17,
    "COVERAGE_PROFILE_ARTIFACT_MISSING: legacy artifact count");
  const ids = new Set();
  for (const [index, profile] of APPROVED_COVERAGE_PROFILES.entries()) {
    const record = legacyRecords[index];
    assertCondition(profile !== null && typeof profile === "object" && !ids.has(profile.id) && profile.id === record.profileId &&
      profile.sourceHead === record.sourceHead && profile.obligations?.sourceFiles?.count === record.sourceCount &&
      (record.testIdentityCount === null || profile.topology?.semanticTests === undefined || profile.topology.semanticTests === record.testIdentityCount) &&
      (record.tupleSha256 === null || profile.topology?.normalizedTupleSetsSha256 === record.tupleSha256) &&
      (record.logicalGroupCount === null || profile.topology?.coverageLogicalGroups === undefined ||
        profile.topology.coverageLogicalGroups === record.logicalGroupCount) &&
      (record.physicalGroupCount === null || profile.topology?.coveragePhysicalBlobs === record.physicalGroupCount),
    `COVERAGE_PROFILE_ARTIFACT_ID_MISMATCH: legacy artifact ${index}`);
    ids.add(profile.id);
  }
  for (const profile of APPROVED_COVERAGE_PROFILES) {
    assertCondition(profile.supersedesForTopology === undefined ||
      (ids.has(profile.supersedesForTopology) && profile.supersedesForTopology !== profile.id),
    `Coverage profile has invalid topology supersession metadata: ${profile.id}`);
  }
  const uniqueOwnershipProfile = APPROVED_COVERAGE_PROFILES.find(
    (profile) => profile.id === UNIQUE_OWNERSHIP_PROFILE_ID
  );
  if (uniqueOwnershipProfile === undefined) {
    throw new Error(`Required coverage profile is missing: ${UNIQUE_OWNERSHIP_PROFILE_ID}`);
  }
  assertCondition(uniqueOwnershipProfile.sourceKind === UNIQUE_OWNERSHIP_SOURCE_KIND &&
    uniqueOwnershipProfile.supersessionReason === UNIQUE_OWNERSHIP_SUPERSESSION_REASON &&
    uniqueOwnershipProfile.removedObligationAudit?.canonicalTuple === UNIQUE_OWNERSHIP_REMOVED_TUPLE &&
    uniqueOwnershipProfile.removedObligationAudit?.baselineHit === 0 &&
    Number.isInteger(uniqueOwnershipProfile.removedObligationAudit?.candidateHit) &&
    uniqueOwnershipProfile.removedObligationAudit.candidateHit > 0 &&
    /^[0-9a-f]{64}$/u.test(uniqueOwnershipProfile.removedObligationAudit?.auditArtifactSha256 ?? ""),
  `Process-isolated coverage profile has invalid audit metadata: ${uniqueOwnershipProfile.id}`);
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

function deepFreezeData(value) {
  Object.values(value).filter((child) => child !== null && typeof child === "object").forEach(deepFreezeData);
  return Object.freeze(value);
}
function validateFrozenCoverageTopology(topology, testIdentityCount, logicalGroupCount, physicalGroupCount, expectedGroups = FROZEN_COVERAGE_GROUPS) {
  assertExactPlain(topology, PROFILE_TOPOLOGY_KEYS, "profile topology", "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID");
  assertCondition(topology.topologyId === "TWELVE_PHYSICAL_ELEVEN_LOGICAL_COVERAGE_WITH_DREAMER_CORE_SEGMENTS" && topology.ordinaryLogicalGroupCount === 9 &&
    topology.ordinaryPhysicalGroupCount === 11 && topology.coverageLogicalGroupCount === logicalGroupCount && topology.coveragePhysicalGroupCount === physicalGroupCount && topology.baselineVersion === "CANDIDATE_1712_D1_V1" &&
    JSON.stringify(topology.coverageGroups) === JSON.stringify(expectedGroups) && topology.coverageGroups.reduce((total, group) => total + group.tests, 0) === testIdentityCount &&
    topology.coverageGroups[8].physicalSegments.reduce((total, segment) => total + segment.tests, 0) === topology.coverageGroups[8].tests && validSha(topology.coverageGlobalManifestSha256) &&
    validSha(topology.coverageFinalSha256) && validSha(topology.normalizedTupleSetsSha256) && validSha(topology.fullTupleDeltaSha256), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID: topology");
}
function profileBodySha256(artifact) {
  const body = Object.fromEntries(PROFILE_BODY_KEYS.map((key) => [key, artifact[key]]));
  return createHash("sha256").update(`${JSON.stringify(body, null, 2)}\n`, "utf8").digest("hex");
}
function validateProfileArtifactBytes(record, bytes) {
  let artifact;
  try { artifact = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID: malformed JSON"); }
  assertExactPlain(artifact, PROFILE_ARTIFACT_KEYS, "profile artifact", "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID");
  assertExactPlain(artifact.obligations, PROFILE_OBLIGATION_KEYS, "profile obligations", "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID");
  const expectedGroups = record.profileId === SLICE4_PROFILE_ID && record.sourceHead === SLICE4_PROFILE_SOURCE_HEAD
    ? SLICE4_COVERAGE_GROUPS
    : record.profileId === SLICE3_PROFILE_ID && record.sourceHead === SLICE3_PROFILE_SOURCE_HEAD
      ? SLICE3_COVERAGE_GROUPS
    : record.profileId === CURRENT_PROFILE_ID && record.sourceHead === CURRENT_PROFILE_SOURCE_HEAD
      ? CURRENT_COVERAGE_GROUPS
    : record.profileId === "phase-3-slice-2c-closure-0b4640e-coverage-v1"
      ? HISTORICAL_FINAL_CLOSURE_COVERAGE_GROUPS
    : record.profileId === "phase-3-slice-2c-closure-ea0b3f2-coverage-v1"
      ? HISTORICAL_CLOSURE_COVERAGE_GROUPS
    : record.profileId === PREVIOUS_PROFILE_ID && record.sourceHead === PREVIOUS_PROFILE_SOURCE_HEAD
      ? PREVIOUS_COVERAGE_GROUPS
      : record.profileId === OLDER_PROFILE_ID && record.sourceHead === OLDER_PROFILE_SOURCE_HEAD
        ? OLDER_COVERAGE_GROUPS
        : FROZEN_COVERAGE_GROUPS;
  validateFrozenCoverageTopology(artifact.topology, artifact.testIdentityCount, artifact.logicalGroupCount, artifact.physicalGroupCount, expectedGroups);
  for (const key of PROFILE_OBLIGATION_KEYS) {
    assertExactPlain(artifact.obligations[key], ["count", "sha256"], `profile obligation ${key}`, "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID");
    assertCondition(validCount(artifact.obligations[key].count) && validSha(artifact.obligations[key].sha256), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID: obligation");
  }
  assertCondition(artifact.schemaVersion === "botc-coverage-profile-artifact-v2" && validCount(artifact.sourceCount) && validCount(artifact.testIdentityCount) &&
    validSha(artifact.inventorySha256) && validSha(artifact.tupleSha256) && validCount(artifact.logicalGroupCount) && validCount(artifact.physicalGroupCount) && validSha(artifact.profileSha256), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID: profile fields");
  assertCondition(artifact.profileId === record.profileId, "COVERAGE_PROFILE_ARTIFACT_ID_MISMATCH");
  assertCondition(artifact.sourceHead === record.sourceHead, "COVERAGE_PROFILE_ARTIFACT_SOURCE_MISMATCH");
  assertCondition(bytes.equals(Buffer.from(`${JSON.stringify(artifact, null, 2)}\n`, "utf8")) && artifact.sourceCount === record.sourceCount && artifact.testIdentityCount === record.testIdentityCount &&
    artifact.inventorySha256 === record.inventorySha256 && artifact.tupleSha256 === record.tupleSha256 && artifact.logicalGroupCount === record.logicalGroupCount &&
    artifact.physicalGroupCount === record.physicalGroupCount && artifact.profileSha256 === profileBodySha256(artifact) && artifact.obligations.sourceFiles.count === record.sourceCount &&
    artifact.topology.normalizedTupleSetsSha256 === artifact.tupleSha256, "COVERAGE_PROFILE_ARTIFACT_HASH_MISMATCH");
  return deepFreezeData({ id: artifact.profileId, sourceHead: artifact.sourceHead, sourceKind: "STANDALONE_PROFILE_ARTIFACT_V2", topology: artifact.topology, obligations: artifact.obligations });
}
function validateArtifactPathComponent(metadata, isFinal) {
  assertCondition(!metadata.isSymbolicLink() && (isFinal ? metadata.isFile() : metadata.isDirectory()), "COVERAGE_PROFILE_ARTIFACT_MISSING: unsafe path component");
}
function validateProfileArtifact(record) {
  assertCondition(/^docs\/implementation\/coverage-profiles\/[a-z0-9][a-z0-9.-]*\.json$/u.test(record.profileArtifactPath),
    "COVERAGE_PROFILE_ARTIFACT_MISSING: invalid artifact path");
  const root = realpathSync(process.cwd());
  let target = root;
  try {
    for (const [index, part] of record.profileArtifactPath.split("/").entries()) {
      target = path.join(target, part);
      const metadata = lstatSync(target); validateArtifactPathComponent(metadata, index === record.profileArtifactPath.split("/").length - 1);
      const relative = path.relative(root, realpathSync(target));
      assertCondition(relative !== ".." && !relative.startsWith(`..${path.sep}`), "COVERAGE_PROFILE_ARTIFACT_MISSING: unsafe path component");
    }
    return validateProfileArtifactBytes(record, readFileSync(target));
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("COVERAGE_PROFILE_")) throw error;
    throw new Error("COVERAGE_PROFILE_ARTIFACT_MISSING");
  }
}
function expectClosedError(callback, expected) {
  let actual = null; try { callback(); } catch (error) { actual = error instanceof Error ? error.message.split(":")[0] : null; }
  assertCondition(actual === expected, `COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID: contract audit expected ${expected}`);
}
function cloneData(value) { return JSON.parse(JSON.stringify(value)); }
function auditFrozenResult(value) {
  assertCondition(Object.isFrozen(value) && !Reflect.set(value, "contractAuditMutation", true), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID: mutable validated result");
  Object.values(value).filter((child) => child !== null && typeof child === "object").forEach(auditFrozenResult);
}
function auditClosedProfileContracts() {
  const sha = "0".repeat(64), sourceHead = "0".repeat(40);
  const record = { profileId: "phase-3-slice-2b20b-p2f1r-d1-5r-audit-routing-coverage-v1", sourceHead, sourceCount: 69, testIdentityCount: 1712, inventorySha256: sha, tupleSha256: sha, logicalGroupCount: 11, physicalGroupCount: 12 };
  const topology = { topologyId: "TWELVE_PHYSICAL_ELEVEN_LOGICAL_COVERAGE_WITH_DREAMER_CORE_SEGMENTS", ordinaryLogicalGroupCount: 9, ordinaryPhysicalGroupCount: 11, coverageLogicalGroupCount: 11, coveragePhysicalGroupCount: 12, coverageGroups: cloneData(FROZEN_COVERAGE_GROUPS), coverageGlobalManifestSha256: sha, coverageFinalSha256: sha, normalizedTupleSetsSha256: sha, fullTupleDeltaSha256: sha, baselineVersion: "CANDIDATE_1712_D1_V1" };
  const obligations = Object.fromEntries(PROFILE_OBLIGATION_KEYS.map((key) => [key, { count: key === "sourceFiles" ? 69 : 0, sha256: sha }]));
  const artifact = { schemaVersion: "botc-coverage-profile-artifact-v2", profileId: record.profileId, sourceHead, sourceCount: 69, testIdentityCount: 1712, inventorySha256: sha, tupleSha256: sha, logicalGroupCount: 11, physicalGroupCount: 12, profileSha256: sha, topology, obligations };
  const bytes = (value) => (value.profileSha256 = profileBodySha256(value), Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8"));
  auditFrozenResult(validateProfileArtifactBytes(record, bytes(artifact)));
  const topologyMutations = [
    (value) => { value.topology.coverageGroups[0].id += "-hostile"; }, (value) => { [value.topology.coverageGroups[0], value.topology.coverageGroups[1]] = [value.topology.coverageGroups[1], value.topology.coverageGroups[0]]; },
    (value) => { value.topology.coverageGroups[0].tests += 1; }, (value) => { value.testIdentityCount -= 1; }, (value) => { value.topology.coverageGroups[8].physicalSegments[0].id = "hostile"; },
    (value) => { value.topology.coverageGroups[8].physicalSegments.reverse(); }, (value) => { value.topology.coverageGroups[8].physicalSegments[0].tests += 1; }, (value) => { value.topology.coverageGroups[8].tests -= 1; }
  ];
  for (const mutate of topologyMutations) { const hostile = cloneData(artifact); mutate(hostile); expectClosedError(() => validateProfileArtifactBytes(record, bytes(hostile)), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID"); }
  expectClosedError(() => validateProfileArtifactBytes(record, Buffer.from("{")), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID");
  for (const mutate of [(value) => { delete value.topology; }, (value) => { value.extra = true; }, (value) => { const first = value.schemaVersion; delete value.schemaVersion; value.schemaVersion = first; }]) { const hostile = cloneData(artifact); mutate(hostile); expectClosedError(() => validateProfileArtifactBytes(record, bytes(hostile)), "COVERAGE_PROFILE_ARTIFACT_SCHEMA_INVALID"); }
  const linked = { isSymbolicLink: () => true, isFile: () => true, isDirectory: () => true };
  for (const isFinal of [true, false, false]) expectClosedError(() => validateArtifactPathComponent(linked, isFinal), "COVERAGE_PROFILE_ARTIFACT_MISSING");
  const exactS = cloneData(COVERAGE_PROFILE_RECORDS.slice(0, 17)); validateFrozenRegistryPrefix(exactS);
  const exactP = cloneData(exactS); exactP[16].lifecycleStatus = "HISTORICAL"; validateFrozenRegistryPrefix(exactP);
  const registryMutations = [
    (rows) => { rows[0].testIdentityCount = 0; }, (rows) => { rows[2].previousProfileId = null; }, (rows) => { rows[0].sourceDelta = { added: 0, removed: 0 }; }, (rows) => { rows[16].logicalGroupCount = 10; },
    (rows) => { rows[16].inventorySha256 = sha; }, (rows) => { rows[0].unexplainedLoss = 0; }, (rows) => { rows[0].lifecycleStatus = "LEGACY_SELECTED"; }, (rows) => { rows[0].profileArtifactPath = "hostile.json"; }
  ];
  for (const mutate of registryMutations) { const hostile = cloneData(exactS); mutate(hostile); expectClosedError(() => validateFrozenRegistryPrefix(hostile), "COVERAGE_PROFILE_REGISTRY_INVALID"); }

  const historical17 = cloneData(COVERAGE_PROFILE_RECORDS.slice(0, 17));
  historical17[16].lifecycleStatus = "LEGACY_SELECTED";
  assertRegistryLifecycleState(historical17, historical17[16].profileId);
  const existing18 = cloneData(COVERAGE_PROFILE_RECORDS.slice(0, 18));
  existing18[17].lifecycleStatus = "ACTIVE";
  assertRegistryLifecycleState(existing18, existing18[17].profileId);
  const synthetic20 = cloneData(COVERAGE_PROFILE_RECORDS);
  synthetic20.at(-1).lifecycleStatus = "HISTORICAL";
  synthetic20.push({ ...synthetic20.at(-1), profileId: "synthetic-forward-profile-v1", lifecycleStatus: "ACTIVE", previousProfileId: synthetic20.at(-1).profileId });
  assertRegistryLifecycleState(synthetic20, synthetic20.at(-1).profileId);
  const twoActive = cloneData(existing18);
  twoActive[16].lifecycleStatus = "ACTIVE";
  expectClosedError(() => assertRegistryLifecycleState(twoActive, twoActive[17].profileId), "COVERAGE_PROFILE_SELECTOR_INVALID");
  const nonFinalActive = cloneData(existing18);
  nonFinalActive[17].lifecycleStatus = "HISTORICAL";
  expectClosedError(() => assertRegistryLifecycleState(nonFinalActive, nonFinalActive[17].profileId), "COVERAGE_PROFILE_SELECTOR_INVALID");
  expectClosedError(() => assertRegistryLifecycleState(existing18, "wrong-selector"), "COVERAGE_PROFILE_SELECTOR_INVALID");
  const invalidDelta = cloneData(existing18);
  invalidDelta[17].sourceDelta = { added: -1, removed: 0 };
  expectClosedError(() => validateDelta(invalidDelta[17].sourceDelta, "sourceDelta"), "COVERAGE_PROFILE_REGISTRY_INVALID");
}
function resolveProfiles(registry) {
  validateLegacyArtifacts(registry.records);
  let legacyIndex = 0;
  const artifactPaths = new Set();
  return registry.records.map((record) => {
    if (record.profileArtifactPath === "scripts/verify-coverage-obligations.mjs") {
      return APPROVED_COVERAGE_PROFILES[legacyIndex++];
    }
    assertCondition(!artifactPaths.has(record.profileArtifactPath), "COVERAGE_PROFILE_ARTIFACT_DUPLICATE");
    artifactPaths.add(record.profileArtifactPath);
    return validateProfileArtifact(record);
  });
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
  const packagesSegment = "/packages/";
  const packagesIndex = normalized.lastIndexOf(packagesSegment);
  if (packagesIndex >= 0) {
    return normalized.slice(packagesIndex + 1);
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
  auditClosedProfileContracts();
  const registry = validateRegistry();
  const approvedProfiles = resolveProfiles(registry);
  const options = parseArguments(process.argv.slice(2));
  const candidate = summarizeCoverageMap(readCoverageMap(options.candidate));
  const requiredPackages = validateWorkspaceSourcePackages(candidate);

  if (options.baseline === null) {
    assertCondition(options.profileId === registry.selectedProfileId,
      "COVERAGE_PROFILE_SELECTOR_INVALID: exact selected profile is required");
    const candidateGroups = obligationGroups(candidate);
    const profiles = approvedProfiles.map((profile) =>
      compareToApprovedProfile(candidateGroups, profile)
    );
    const requestedProfile = profiles.find((profile) => profile.profileId === options.profileId);
    assertCondition(requestedProfile !== undefined, `Unknown approved coverage profile: ${options.profileId}`);
    const verdict = requestedProfile.matches
      ? "COVERAGE_APPROVED_PROFILE_MATCH"
      : "COVERAGE_REQUESTED_PROFILE_MISMATCH";
    process.stdout.write(
      `${JSON.stringify(
        {
          verdict,
          requestedProfileId: options.profileId,
          matchedProfileId: requestedProfile.matches ? requestedProfile.profileId : null,
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
