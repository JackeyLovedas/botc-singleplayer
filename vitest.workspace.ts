import { fileURLToPath } from "node:url";
import { defineWorkspace } from "vitest/config";

const domainCore = fileURLToPath(new URL("./packages/domain-core/src/index.ts", import.meta.url));
const application = fileURLToPath(new URL("./packages/application/src/index.ts", import.meta.url));
const testHarness = fileURLToPath(new URL("./packages/test-harness/src/index.ts", import.meta.url));

const aliases = {
  "@botc/domain-core": domainCore,
  "@botc/application": application,
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
      include: ["packages/application/src/**/*.test.ts"]
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
