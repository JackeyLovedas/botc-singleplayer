import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { auditEvent, infrastructureEvent } from "@botc/test-harness";

const readPackageJson = async (path: string): Promise<{ readonly dependencies?: Record<string, string>; readonly devDependencies?: Record<string, string> }> => {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as { readonly dependencies?: Record<string, string>; readonly devDependencies?: Record<string, string> };
};

const dependencyNames = (packageJson: { readonly dependencies?: Record<string, string>; readonly devDependencies?: Record<string, string> }): string[] => [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {})
];

describe("architecture boundaries", () => {
  it("keeps domain-core free of Electron, SQLite, React, and AI SDK dependencies", async () => {
    const names = dependencyNames(await readPackageJson("packages/domain-core/package.json"));

    expect(names).not.toContain("electron");
    expect(names).not.toContain("react");
    expect(names).not.toContain("sqlite3");
    expect(names).not.toContain("better-sqlite3");
    expect(names).not.toContain("openai");
    expect(names).not.toContain("@anthropic-ai/sdk");
  });

  it("keeps application independent from concrete AI and SQLite adapters", async () => {
    const names = dependencyNames(await readPackageJson("packages/application/package.json"));

    expect(names).toStrictEqual(["@botc/domain-core"]);
    expect(names).not.toContain("@botc/ai-gateway");
    expect(names).not.toContain("@botc/persistence-sqlite");
    expect(names).not.toContain("sqlite3");
    expect(names).not.toContain("better-sqlite3");
  });

  it("keeps setup package dependencies pointing inward only", async () => {
    const rulesNames = dependencyNames(await readPackageJson("packages/rules-snv/package.json"));
    const setupNames = dependencyNames(await readPackageJson("packages/setup-engine/package.json"));
    const informationNames = dependencyNames(await readPackageJson("packages/information-engine/package.json"));
    const projectionNames = dependencyNames(await readPackageJson("packages/projections/package.json"));
    const testHarnessNames = dependencyNames(await readPackageJson("packages/test-harness/package.json"));

    expect(rulesNames).toStrictEqual(["@botc/domain-core"]);
    expect(setupNames).toStrictEqual(["@botc/domain-core"]);
    expect(informationNames).toStrictEqual(["@botc/domain-core"]);
    expect(projectionNames).toStrictEqual(["@botc/domain-core"]);
    expect(testHarnessNames).toEqual(expect.arrayContaining([
      "@botc/application",
      "@botc/domain-core",
      "@botc/information-engine",
      "@botc/rules-snv",
      "@botc/setup-engine"
    ]));
  });

  it("keeps audit and infrastructure events outside canonical rebuild data", () => {
    expect(auditEvent().category).toBe("audit");
    expect(infrastructureEvent().category).toBe("infrastructure");
  });
});
