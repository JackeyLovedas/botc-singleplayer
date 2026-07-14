import { fileURLToPath } from "node:url";
import { defineWorkspace } from "vitest/config";

const domainCore = fileURLToPath(new URL("./packages/domain-core/src/index.ts", import.meta.url));
const application = fileURLToPath(new URL("./packages/application/src/index.ts", import.meta.url));
const assignmentEngine = fileURLToPath(new URL("./packages/assignment-engine/src/index.ts", import.meta.url));
const informationEngine = fileURLToPath(new URL("./packages/information-engine/src/index.ts", import.meta.url));
const projections = fileURLToPath(new URL("./packages/projections/src/index.ts", import.meta.url));
const rulesSnv = fileURLToPath(new URL("./packages/rules-snv/src/index.ts", import.meta.url));
const setupEngine = fileURLToPath(new URL("./packages/setup-engine/src/index.ts", import.meta.url));
const taskEngine = fileURLToPath(new URL("./packages/task-engine/src/index.ts", import.meta.url));
const testHarness = fileURLToPath(new URL("./packages/test-harness/src/index.ts", import.meta.url));
const applicationServiceTest = "packages/application/src/game-application-service.test.ts";

const aliases = {
  "@botc/domain-core": domainCore,
  "@botc/application": application,
  "@botc/assignment-engine": assignmentEngine,
  "@botc/information-engine": informationEngine,
  "@botc/projections": projections,
  "@botc/rules-snv": rulesSnv,
  "@botc/setup-engine": setupEngine,
  "@botc/task-engine": taskEngine,
  "@botc/test-harness": testHarness
};

export default defineWorkspace([
  {
    test: {
      name: "domain-core",
      include: ["packages/domain-core/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "application",
      include: ["packages/application/src/**/*.test.ts"],
      exclude: [applicationServiceTest]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "application-service-core",
      include: [applicationServiceTest],
      env: {
        BOTC_APPLICATION_SERVICE_TEST_SHARD: "core"
      }
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "application-service-role-actions",
      include: [applicationServiceTest],
      env: {
        BOTC_APPLICATION_SERVICE_TEST_SHARD: "role-actions"
      }
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "application-service-dreamer-v2",
      include: [applicationServiceTest],
      env: {
        BOTC_APPLICATION_SERVICE_TEST_SHARD: "dreamer-v2"
      }
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "application-service-later-role-actions",
      include: [applicationServiceTest],
      env: {
        BOTC_APPLICATION_SERVICE_TEST_SHARD: "later-role-actions"
      }
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "assignment-engine",
      include: ["packages/assignment-engine/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "information-engine",
      include: ["packages/information-engine/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "projections",
      include: ["packages/projections/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "rules-snv",
      include: ["packages/rules-snv/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "setup-engine",
      include: ["packages/setup-engine/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "task-engine",
      include: ["packages/task-engine/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  },
  {
    test: {
      name: "test-harness",
      include: ["packages/test-harness/src/**/*.test.ts"]
    },
    resolve: {
      alias: aliases
    }
  }
]);
