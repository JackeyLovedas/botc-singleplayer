import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const VALIDATOR_PATH =
  "packages/domain-core/src/domain-event-structural-validator.ts";
const CANONICAL_PATH =
  "packages/domain-core/src/canonical-domain-event.ts";

const binding = (
  leafId,
  publicContextId,
  payloadReadBudget,
  exactSourceBinding,
  source,
  declaration,
  nodeKind,
  requiredText,
  expectedBranchCount = 1
) =>
  Object.freeze({
    leafId,
    publicContextId,
    payloadReadBudget,
    exactSourceBinding,
    source,
    declaration,
    nodeKind,
    requiredText: Object.freeze(requiredText),
    expectedBranchCount
  });

export const STATIC_DIAGNOSTIC_BINDINGS = Object.freeze([
  binding("L01_F01_AUTHORITY_UNHEALTHY", "F01", "ZERO", "admitC1Authority", "validator", "admitC1Authority", "IfStatement", ['result.status !== "HEALTHY"', "return unhealthyAdmission()"]),
  binding("L04_F04_CAPTURE_INTERNAL", "F04", "ZERO", "translateCaptureFailure.internal", "validator", "translateCaptureFailure", "CaseClause", ['case "INTERNAL_SERIALIZATION_FAILURE"', "return failure(F04)"]),
  binding("L06_F06_CAPTURE_BACKING_MISSING", "F06", "ZERO", "validateCapturedInternal.backingMissing", "validator", "validateCapturedInternal", "ConditionalExpression", ['authenticated.diagnostic.code === "INVALID_CAPTURE_TOKEN"', "failure(F05)", "failure(F06)"]),
  binding("L18_F18_ROOT_SELECTION_ZERO", "F18", "DISCRIMINATOR_ONLY", "selectBranch.zeroInvariant", "validator", "selectBranch", "IfStatement", ["match === undefined", "return failure(F18", "discriminatorPath(current.discriminatorOrdinal)"]),
  binding("L19_F19_ROOT_SELECTION_MULTIPLE", "F19", "DISCRIMINATOR_ONLY", "selectBranch.multipleInvariant", "validator", "selectBranch", "IfStatement", ["matches.length > 1", "return failure(F19", "discriminatorPath(current.discriminatorOrdinal)"]),
  binding("L20_F20_AST_NODE_LOOKUP_MISSING", "F20", "PRIOR_AST", "traverseNode.nodeLookup", "validator", "traverseNode", "IfStatement", ["schema === undefined", "return failure(F20, path)"]),
  binding("L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING", "F20", "BEFORE_NODE", "traverseNode.nodeOrdinal", "validator", "traverseNode", "IfStatement", ["astNodeOrdinal === undefined", "return failure(F20_NODE_ORDINAL, path)"]),
  binding("L22_F20_EVENT_BRANCH_ORDINAL_INVALID", "F20", "BEFORE_AST", "validateCapturedInternal.eventBranchOrdinal", "validator", "validateCapturedInternal", "IfStatement", ["selectedRoot.branchOrdinal > 59", "return toPublicFailure(failure(F20_EVENT_BRANCH), observation)"]),
  binding("L23_F20_TAGGED_VARIANT_ORDINAL_INVALID", "F20", "TAG_ONLY", "traverseNode.taggedVariantOrdinal", "validator", "traverseNode", "IfStatement", ["branch.branchOrdinal !== index + 1", "return failure(F20_TAGGED_VARIANT, path)"]),
  binding("L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT", "F20", "TAG_ONLY", "traverseNode.taggedFieldCoordinate", "validator", "traverseNode", "IfStatement", ["coordinate === null", "return failure(F20_TAGGED_FIELD, path)"], 7),
  binding("L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH", "F20", "TAG_ONLY", "traverseNode.taggedMultiple", "validator", "traverseNode", "IfStatement", ["matchCount > 1", "return failure(F20_TAGGED_MULTIPLE, path)"]),
  binding("L40_F28_CLOSED_UNION_MULTIPLE_MATCH", "F28", "ALL_CLOSED_BRANCHES", "traverseNode.closedMultiple", "validator", "traverseNode", "IfStatement", ["matches.length > 1", "return failure(F28, path)"]),
  binding("L43_F30_REFINEMENT_METADATA_INVALID", "F30", "NO_SEMANTIC_READ", "executeRefinement.metadata", "validator", "executeRefinement", "IfStatement", ["metadata.refinementVersion !==", 'metadata.baseNodeKind !== "STRING"', 'typeof value !== "string"', "return failure(F30, path)"]),
  binding("L44_F31_BACKING_CONSTRUCTION_FAILED", "F31", "TRAVERSAL_COMPLETE", "validateCapturedInternal.backingConstruction", "validator", "validateCapturedInternal", "CatchClause", ["return toPublicFailure(failure(F31), observation)"]),
  binding("L45_F32_TOKEN_ISSUE_FAILED", "F32", "BACKING_COMPLETE", "issueStructurallyValidatedDomainEvent", "canonical", "issueStructurallyValidatedDomainEvent", "CatchClause", ['createDomainEventStructuralDiagnostic("L45_F32_TOKEN_ISSUE_FAILED")']),
  binding("L47_F34_INTERNAL_CONTAINMENT", "F34", "CATCH_BOUND", "publicOuterCatch", "validator", "PUBLIC_OUTER_CATCHES", "CatchClause", ["failure(F34)"], 4)
]);

const syntaxKindName = (node) => ts.SyntaxKind[node.kind];

const parse = (source, fileName) => {
  const parsed = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  if (parsed.parseDiagnostics.length > 0) {
    throw new Error(`STATIC_AUDIT_PARSE_FAILED:${fileName}`);
  }
  return parsed;
};

const declarationName = (node) => {
  if (ts.isFunctionDeclaration(node) && node.name !== undefined) {
    return node.name.text;
  }
  if (ts.isVariableStatement(node)) {
    const declarations = node.declarationList.declarations;
    if (declarations.length === 1 && ts.isIdentifier(declarations[0].name)) {
      return declarations[0].name.text;
    }
  }
  return null;
};

const findDeclaration = (sourceFile, name) => {
  const matches = sourceFile.statements.filter(
    (statement) => declarationName(statement) === name
  );
  if (matches.length !== 1) {
    throw new Error(`STATIC_AUDIT_DECLARATION_COUNT:${name}:${matches.length}`);
  }
  return matches[0];
};

const descendants = (root, predicate) => {
  const found = [];
  const visit = (node) => {
    if (predicate(node)) found.push(node);
    ts.forEachChild(node, visit);
  };
  visit(root);
  return found;
};

const normalized = (node, sourceFile) =>
  node.getText(sourceFile).replace(/\s+/gu, " ").trim();

const branchMatches = (node, sourceFile, candidate) => {
  if (syntaxKindName(node) !== candidate.nodeKind) return false;
  const text = normalized(node, sourceFile);
  return candidate.requiredText.every((required) =>
    text.includes(required.replace(/\s+/gu, " ").trim())
  );
};

const stringLiteral = (argument) =>
  ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)
    ? argument.text
    : null;

const identifierText = (argument) =>
  ts.isIdentifier(argument) ? argument.text : null;

const readLeafPolicies = (canonicalFile) => {
  const policies = new Map();
  for (const call of descendants(canonicalFile, ts.isCallExpression)) {
    if (!ts.isIdentifier(call.expression) || call.expression.text !== "leafPolicy") {
      continue;
    }
    const [leaf, context, , , budget, evidence, coordinate, source] =
      call.arguments;
    const leafId = leaf === undefined ? null : stringLiteral(leaf);
    if (leafId === null) continue;
    if (policies.has(leafId)) {
      throw new Error(`STATIC_AUDIT_DUPLICATE_POLICY:${leafId}`);
    }
    policies.set(leafId, {
      publicContextId: context === undefined ? null : stringLiteral(context),
      payloadReadBudget: budget === undefined ? null : stringLiteral(budget),
      evidenceKind: evidence === undefined ? null : identifierText(evidence),
      taggedCoordinatePolicy:
        coordinate === undefined ? null : identifierText(coordinate),
      exactSourceBinding: source === undefined ? null : stringLiteral(source)
    });
  }
  return policies;
};

const publicOuterCatchNames = Object.freeze([
  "validateDomainEventStructure",
  "validateCapturedDomainEventStructure",
  "validateDomainEventStructureWithObservationForTest",
  "validateCapturedDomainEventStructureWithObservationForTest"
]);

const verifyOrdering = (validatorFile, resolved) => {
  const traverse = findDeclaration(validatorFile, "traverseNode");
  const traverseOrder = [
    "L20_F20_AST_NODE_LOOKUP_MISSING",
    "L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING",
    "L23_F20_TAGGED_VARIANT_ORDINAL_INVALID",
    "L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT",
    "L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH"
  ].map((leafId) => {
    const positions = resolved.get(leafId);
    if (positions === undefined || positions.length === 0) {
      throw new Error(`STATIC_AUDIT_ORDER_MISSING:${leafId}`);
    }
    return Math.min(...positions);
  });
  if (traverseOrder.some((position) => position < traverse.pos)) {
    throw new Error("STATIC_AUDIT_ORDER_OUTSIDE_TRAVERSE");
  }
  for (let index = 1; index < traverseOrder.length; index += 1) {
    if (traverseOrder[index - 1] >= traverseOrder[index]) {
      throw new Error("STATIC_AUDIT_F20_ORDER_INVALID");
    }
  }

  const internal = findDeclaration(validatorFile, "validateCapturedInternal");
  const l22 = resolved.get("L22_F20_EVENT_BRANCH_ORDINAL_INVALID")?.[0];
  const traversalCalls = descendants(
    internal,
    (node) =>
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "traverseNode"
  );
  if (
    l22 === undefined ||
    traversalCalls.length !== 1 ||
    l22 >= traversalCalls[0].pos
  ) {
    throw new Error("STATIC_AUDIT_EVENT_BRANCH_ORDER_INVALID");
  }
};

export const verifyStaticDiagnosticBindings = ({
  validatorSource,
  canonicalSource
}) => {
  const validatorFile = parse(validatorSource, VALIDATOR_PATH);
  const canonicalFile = parse(canonicalSource, CANONICAL_PATH);
  const policies = readLeafPolicies(canonicalFile);
  const resolved = new Map();
  const resultRows = [];

  for (const candidate of STATIC_DIAGNOSTIC_BINDINGS) {
    const policy = policies.get(candidate.leafId);
    if (policy === undefined) {
      throw new Error(`STATIC_AUDIT_POLICY_MISSING:${candidate.leafId}`);
    }
    const expectedPolicy = {
      publicContextId: candidate.publicContextId,
      payloadReadBudget: candidate.payloadReadBudget,
      evidenceKind: "S",
      taggedCoordinatePolicy: "N",
      exactSourceBinding: candidate.exactSourceBinding
    };
    if (JSON.stringify(policy) !== JSON.stringify(expectedPolicy)) {
      throw new Error(`STATIC_AUDIT_POLICY_INVALID:${candidate.leafId}`);
    }

    const sourceFile = candidate.source === "canonical" ? canonicalFile : validatorFile;
    let branches = [];
    if (candidate.declaration === "PUBLIC_OUTER_CATCHES") {
      for (const name of publicOuterCatchNames) {
        const declaration = findDeclaration(validatorFile, name);
        const matches = descendants(declaration, (node) =>
          branchMatches(node, validatorFile, candidate)
        );
        if (matches.length !== 1) {
          throw new Error(`STATIC_AUDIT_PUBLIC_CATCH_COUNT:${name}:${matches.length}`);
        }
        branches.push(...matches);
      }
    } else {
      const declaration = findDeclaration(sourceFile, candidate.declaration);
      branches = descendants(declaration, (node) =>
        branchMatches(node, sourceFile, candidate)
      );
    }
    if (branches.length !== candidate.expectedBranchCount) {
      throw new Error(
        `STATIC_AUDIT_BRANCH_COUNT:${candidate.leafId}:${branches.length}`
      );
    }
    const positions = branches.map((node) => node.pos);
    resolved.set(candidate.leafId, positions);
    resultRows.push(
      Object.freeze({
        leafId: candidate.leafId,
        declaration: candidate.declaration,
        branchCount: branches.length,
        publicContextId: candidate.publicContextId,
        payloadReadBudget: candidate.payloadReadBudget,
        exactSourceBinding: candidate.exactSourceBinding
      })
    );
  }

  const translate = findDeclaration(validatorFile, "translateCaptureFailure");
  if (descendants(translate, ts.isDefaultClause).length !== 0) {
    throw new Error("STATIC_AUDIT_DEFAULT_FALLTHROUGH");
  }
  verifyOrdering(validatorFile, resolved);

  if (new Set(resultRows.map((row) => row.leafId)).size !== 16) {
    throw new Error("STATIC_AUDIT_LEAF_CENSUS_INVALID");
  }
  return Object.freeze({
    mapped: 16,
    missing: 0,
    duplicate: 0,
    orphan: 0,
    invalidSymbol: 0,
    invalidPolicy: 0,
    invalidReturn: 0,
    branchOccurrences: resultRows.reduce(
      (total, row) => total + row.branchCount,
      0
    ),
    rows: Object.freeze(resultRows)
  });
};

export const readStaticDiagnosticSources = (repoRoot) => ({
  validatorSource: readFileSync(path.join(repoRoot, VALIDATOR_PATH), "utf8"),
  canonicalSource: readFileSync(path.join(repoRoot, CANONICAL_PATH), "utf8")
});

const isMain =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  try {
    const repoRoot = path.resolve(process.argv[2] ?? process.cwd());
    const result = verifyStaticDiagnosticBindings(
      readStaticDiagnosticSources(repoRoot)
    );
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : "STATIC_AUDIT_UNKNOWN_FAILURE"}\n`
    );
    process.exitCode = 1;
  }
}
