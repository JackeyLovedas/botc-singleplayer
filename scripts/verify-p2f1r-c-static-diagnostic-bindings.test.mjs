import path from "node:path";
import process from "node:process";

import {
  readStaticDiagnosticSources,
  verifyStaticDiagnosticBindings
} from "./verify-p2f1r-c-static-diagnostic-bindings.mjs";

const rawSources = readStaticDiagnosticSources(path.resolve(process.cwd()));
const sources = Object.freeze({
  validatorSource: rawSources.validatorSource.replace(/\r\n/gu, "\n"),
  canonicalSource: rawSources.canonicalSource.replace(/\r\n/gu, "\n")
});
const baseline = verifyStaticDiagnosticBindings(sources);
if (baseline.mapped !== 16 || baseline.branchOccurrences !== 25) {
  throw new Error("STATIC_SELF_TEST_BASELINE_INVALID");
}

const expectRejected = (name, mutate) => {
  let rejected = false;
  try {
    verifyStaticDiagnosticBindings(mutate(sources));
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error(`STATIC_SELF_TEST_MUTANT_SURVIVED:${name}`);
};

expectRejected("matching-text-outside-declaration", ({ validatorSource, canonicalSource }) => ({
  validatorSource: `${validatorSource.replace(
    "export const admitC1Authority =",
    "export const admitC1AuthorityMoved ="
  )}\nconst unrelatedAdmissionText = () => { if (result.status !== "HEALTHY") return unhealthyAdmission(); };\n`,
  canonicalSource
}));

expectRejected("missing-branch", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    "return failure(F20_NODE_ORDINAL, path);",
    "return failure(F20, path);"
  ),
  canonicalSource
}));

expectRejected("duplicate-branch", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    "if (schema === undefined) {\n    return failure(F20, path);\n  }",
    "if (schema === undefined) { return failure(F20, path); }\n  if (schema === undefined) { return failure(F20, path); }"
  ),
  canonicalSource
}));

expectRejected("wrong-leaf", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    'case "INTERNAL_SERIALIZATION_FAILURE":\n      return failure(F04);',
    'case "INTERNAL_SERIALIZATION_FAILURE":\n      return failure(F03);'
  ),
  canonicalSource
}));

expectRejected("wrong-context", ({ validatorSource, canonicalSource }) => ({
  validatorSource,
  canonicalSource: canonicalSource.replace(
    'leafPolicy("L01_F01_AUTHORITY_UNHEALTHY", "F01"',
    'leafPolicy("L01_F01_AUTHORITY_UNHEALTHY", "F02"'
  )
}));

expectRejected("wrong-return", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    "return failure(F19, discriminatorPath(current.discriminatorOrdinal));",
    "void failure(F19, discriminatorPath(current.discriminatorOrdinal));"
  ),
  canonicalSource
}));

expectRejected("branch-fallthrough", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    "return failure(F18, discriminatorPath(current.discriminatorOrdinal));",
    "failure(F18, discriminatorPath(current.discriminatorOrdinal));"
  ),
  canonicalSource
}));

expectRejected("extra-f34-catch", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    "try {\n    return validateUnknownInternal(input, observation);",
    "try { try { return validateUnknownInternal(input, observation); } catch { return toPublicFailure(failure(F34), observation); }"
  ),
  canonicalSource
}));

expectRejected("removed-f34-catch", ({ validatorSource, canonicalSource }) => ({
  validatorSource: validatorSource.replace(
    "return toPublicFailure(failure(F34), observation);",
    "return toPublicFailure(failure(F31), observation);"
  ),
  canonicalSource
}));

expectRejected("policy-callable", ({ validatorSource, canonicalSource }) => ({
  validatorSource,
  canonicalSource: canonicalSource.replace(
    'leafPolicy("L01_F01_AUTHORITY_UNHEALTHY", "F01", "authority unhealthy", "EMPTY", "ZERO", S, N',
    'leafPolicy("L01_F01_AUTHORITY_UNHEALTHY", "F01", "authority unhealthy", "EMPTY", "ZERO", C, N'
  )
}));

expectRejected("wrong-read-budget", ({ validatorSource, canonicalSource }) => ({
  validatorSource,
  canonicalSource: canonicalSource.replace(
    'leafPolicy("L23_F20_TAGGED_VARIANT_ORDINAL_INVALID", "F20", "tagged variant ordinal invalid", "TAGGED_PATH", "TAG_ONLY"',
    'leafPolicy("L23_F20_TAGGED_VARIANT_ORDINAL_INVALID", "F20", "tagged variant ordinal invalid", "TAGGED_PATH", "SELECTED_AST"'
  )
}));

expectRejected("reordered-f20-guards", ({ validatorSource, canonicalSource }) => {
  const first = `  if (schema === undefined) {\n    return failure(F20, path);\n  }\n  const astNodeOrdinal = context.authority.nodeOrdinalsByNodeId[nodeId];\n  if (astNodeOrdinal === undefined) {\n    return failure(F20_NODE_ORDINAL, path);\n  }`;
  const reversed = `  const astNodeOrdinal = context.authority.nodeOrdinalsByNodeId[nodeId];\n  if (astNodeOrdinal === undefined) {\n    return failure(F20_NODE_ORDINAL, path);\n  }\n  if (schema === undefined) {\n    return failure(F20, path);\n  }`;
  return {
    validatorSource: validatorSource.replace(first, reversed),
    canonicalSource
  };
});

process.stdout.write(
  `${JSON.stringify({ selfTest: "PASS", mutantsRejected: 12, mapped: 16 })}\n`
);
