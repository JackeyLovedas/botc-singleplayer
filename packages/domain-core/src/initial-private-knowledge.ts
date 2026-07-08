import type { CharacterAssignmentSet } from "./character-assignment.js";
import { cloneRoleSetupSnapshot, validateCharacterAssignments } from "./character-assignment.js";
import type { PlayerId, RoleId } from "./ids.js";
import type { PlayerRoster } from "./player-roster.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { compareStableId, sameRoleSetupSnapshot } from "./setup-types.js";
import type { SeatNumber } from "./player-roster.js";

export const SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION = "first-night-initialization-v1" as const;
export const SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION = "initial-private-knowledge-v1" as const;

export type SupportedFirstNightInitializationVersion = typeof SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION;
export type SupportedInitialKnowledgeModelVersion = typeof SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION;

export type FirstNightSession = {
  readonly initializationVersion: SupportedFirstNightInitializationVersion;
  readonly nightNumber: 1;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly roleCatalogSignature: string;
};

export type KnownPlayerReference = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
};

export type OwnCharacterKnowledge = {
  readonly kind: "OWN_CHARACTER";
  readonly recipientPlayerId: PlayerId;
  readonly role: RoleSetupSnapshot;
};

export type DemonIdentityKnowledge = {
  readonly kind: "DEMON_IDENTITY";
  readonly recipientPlayerId: PlayerId;
  readonly demon: KnownPlayerReference;
};

export type MinionIdentitiesKnowledge = {
  readonly kind: "MINION_IDENTITIES";
  readonly recipientPlayerId: PlayerId;
  readonly minions: readonly KnownPlayerReference[];
};

export type DemonBluffsKnowledge = {
  readonly kind: "DEMON_BLUFFS";
  readonly recipientPlayerId: PlayerId;
  readonly roles: readonly RoleSetupSnapshot[];
};

export type InitialKnowledgeEntry =
  | OwnCharacterKnowledge
  | DemonIdentityKnowledge
  | MinionIdentitiesKnowledge
  | DemonBluffsKnowledge;

export type InitialPrivateKnowledge = {
  readonly knowledgeModelVersion: SupportedInitialKnowledgeModelVersion;
  readonly entries: readonly InitialKnowledgeEntry[];
};

export type PlayerPrivateKnowledgeView = {
  readonly viewerPlayerId: PlayerId;
  readonly viewerSeatNumber: SeatNumber;
  readonly viewerDisplayName: string;
  readonly ownCharacter: RoleSetupSnapshot;
  readonly knownDemon?: KnownPlayerReference;
  readonly knownMinions: readonly KnownPlayerReference[];
  readonly demonBluffs: readonly RoleSetupSnapshot[];
  readonly knowledgeModelVersion: SupportedInitialKnowledgeModelVersion;
};

export type InitialPrivateKnowledgeGenerationFailureCode =
  | "InvalidRoster"
  | "InvalidAssignment"
  | "InvalidSetup"
  | "MissingDemon"
  | "InvalidDemonCount"
  | "InvalidMinionCount"
  | "InvalidDemonBluffs"
  | "InvalidKnowledgeResult";

export type InitialPrivateKnowledgeGenerationFailure = {
  readonly status: "failure";
  readonly failureCode: InitialPrivateKnowledgeGenerationFailureCode;
  readonly message: string;
  readonly conflictingPlayerIds: readonly PlayerId[];
  readonly conflictingRoleIds: readonly RoleId[];
};

export type InitialPrivateKnowledgeGenerationSuccess = {
  readonly status: "success";
  readonly knowledge: InitialPrivateKnowledge;
};

export type InitialPrivateKnowledgeGenerationResult =
  | InitialPrivateKnowledgeGenerationSuccess
  | InitialPrivateKnowledgeGenerationFailure;

export type InitialPrivateKnowledgeGeneratorInput = {
  readonly roster: PlayerRoster;
  readonly assignment: CharacterAssignmentSet;
  readonly setup: GeneratedSetup;
};

export type InitialPrivateKnowledgeValidationInput = InitialPrivateKnowledgeGeneratorInput & {
  readonly entries: readonly InitialKnowledgeEntry[];
};

export type InitialPrivateKnowledgeValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const KNOWLEDGE_KIND_ORDER: Readonly<Record<InitialKnowledgeEntry["kind"], number>> = {
  OWN_CHARACTER: 0,
  DEMON_IDENTITY: 1,
  MINION_IDENTITIES: 2,
  DEMON_BLUFFS: 3
};

const exactKnownPlayerReference = (reference: KnownPlayerReference): boolean => {
  const keys = Object.keys(reference).sort();
  return keys.length === 2 && keys[0] === "playerId" && keys[1] === "seatNumber";
};

const compareKnownPlayerReference = (left: KnownPlayerReference, right: KnownPlayerReference): number =>
  left.seatNumber - right.seatNumber;

const knownReferencesAreSorted = (references: readonly KnownPlayerReference[]): boolean =>
  references.every((reference, index) => {
    if (!exactKnownPlayerReference(reference)) {
      return false;
    }

    return index === 0 || compareKnownPlayerReference(references[index - 1] ?? reference, reference) < 0;
  });

const roleListIsAsciiSorted = (roles: readonly RoleSetupSnapshot[]): boolean =>
  roles.every((role, index) => index === 0 || compareStableId(roles[index - 1]?.roleId ?? "", role.roleId) < 0);

export const cloneKnownPlayerReference = (reference: KnownPlayerReference): KnownPlayerReference => ({
  playerId: reference.playerId,
  seatNumber: reference.seatNumber
});

export const cloneInitialKnowledgeEntry = (entry: InitialKnowledgeEntry): InitialKnowledgeEntry => {
  switch (entry.kind) {
    case "OWN_CHARACTER":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        role: cloneRoleSetupSnapshot(entry.role)
      };

    case "DEMON_IDENTITY":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        demon: cloneKnownPlayerReference(entry.demon)
      };

    case "MINION_IDENTITIES":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        minions: entry.minions.map(cloneKnownPlayerReference)
      };

    case "DEMON_BLUFFS":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        roles: entry.roles.map(cloneRoleSetupSnapshot)
      };
  }
};

export const cloneInitialPrivateKnowledge = (knowledge: InitialPrivateKnowledge): InitialPrivateKnowledge => ({
  knowledgeModelVersion: knowledge.knowledgeModelVersion,
  entries: knowledge.entries.map(cloneInitialKnowledgeEntry)
});

const fail = (reason: string): InitialPrivateKnowledgeValidationResult => ({ valid: false, reason });

const validateDemonBluffs = (setup: GeneratedSetup): InitialPrivateKnowledgeValidationResult => {
  if (setup.demonBluffs.length !== 3) {
    return fail("setup.demonBluffs must contain exactly 3 roles");
  }

  if (!roleListIsAsciiSorted(setup.demonBluffs)) {
    return fail("setup.demonBluffs must use ASCII roleId order");
  }

  const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));
  const bluffRoleIds = new Set<string>();
  for (const bluff of setup.demonBluffs) {
    if (actualRoleIds.has(bluff.roleId)) {
      return fail("demon bluffs must not be actual roles");
    }

    if (bluff.defaultAlignment !== "GOOD" || bluff.characterType === "MINION" || bluff.characterType === "DEMON") {
      return fail("demon bluffs must be good roles");
    }

    if (bluffRoleIds.has(bluff.roleId)) {
      return fail("demon bluffs must be unique");
    }
    bluffRoleIds.add(bluff.roleId);
  }

  return { valid: true };
};

const validateKnowledgeOrdering = (
  entries: readonly InitialKnowledgeEntry[],
  seatByPlayerId: ReadonlyMap<PlayerId, SeatNumber>
): InitialPrivateKnowledgeValidationResult => {
  for (const [index, entry] of entries.entries()) {
    const seat = seatByPlayerId.get(entry.recipientPlayerId);
    if (seat === undefined) {
      return fail("knowledge recipient must exist in roster");
    }

    if (index === 0) {
      continue;
    }

    const previous = entries[index - 1];
    if (previous === undefined) {
      return fail("knowledge ordering comparison failed");
    }

    const previousSeat = seatByPlayerId.get(previous.recipientPlayerId);
    if (previousSeat === undefined) {
      return fail("knowledge recipient must exist in roster");
    }

    if (
      previousSeat > seat ||
      (previousSeat === seat && KNOWLEDGE_KIND_ORDER[previous.kind] >= KNOWLEDGE_KIND_ORDER[entry.kind])
    ) {
      return fail("initial private knowledge entries must use canonical recipient and kind order");
    }
  }

  return { valid: true };
};

export const validateInitialPrivateKnowledgeEntries = (
  input: InitialPrivateKnowledgeValidationInput
): InitialPrivateKnowledgeValidationResult => {
  const rosterValidation = validatePlayerRoster(input.roster);
  if (!rosterValidation.valid) {
    return fail(rosterValidation.reason);
  }

  const assignmentValidation = validateCharacterAssignments({
    assignments: input.assignment,
    roster: input.roster,
    actualRoles: input.setup.actualRoles,
    roleCatalogRoles: input.setup.roleCatalogSnapshot.roles
  });
  if (!assignmentValidation.valid) {
    return fail(assignmentValidation.reason);
  }

  const bluffValidation = validateDemonBluffs(input.setup);
  if (!bluffValidation.valid) {
    return bluffValidation;
  }

  const seatByPlayerId = new Map<PlayerId, SeatNumber>(input.roster.map((entry) => [entry.playerId, entry.seatNumber]));
  const assignmentByPlayerId = new Map(input.assignment.map((assignment) => [assignment.playerId, assignment]));
  const catalogByRoleId = new Map(input.setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));
  const demonAssignments = input.assignment.filter((assignment) => assignment.role.characterType === "DEMON");
  const minionAssignments = input.assignment.filter((assignment) => assignment.role.characterType === "MINION")
    .sort((left, right) => left.seatNumber - right.seatNumber);
  const actualRoleIds = new Set(input.setup.actualRoles.map((role) => role.roleId));

  if (demonAssignments.length === 0) {
    return fail("initial private knowledge requires a demon assignment");
  }

  if (demonAssignments.length !== 1) {
    return fail("initial private knowledge requires exactly one demon assignment");
  }

  if (minionAssignments.length !== 2) {
    return fail("initial private knowledge requires exactly two minion assignments");
  }

  const demon = demonAssignments[0];
  if (demon === undefined) {
    return fail("initial private knowledge requires a demon assignment");
  }

  const orderingValidation = validateKnowledgeOrdering(input.entries, seatByPlayerId);
  if (!orderingValidation.valid) {
    return orderingValidation;
  }

  const ownByRecipient = new Map<PlayerId, OwnCharacterKnowledge>();
  const demonIdentityByRecipient = new Map<PlayerId, DemonIdentityKnowledge>();
  const minionIdentitiesByRecipient = new Map<PlayerId, MinionIdentitiesKnowledge>();
  const demonBluffsByRecipient = new Map<PlayerId, DemonBluffsKnowledge>();

  for (const entry of input.entries) {
    switch (entry.kind) {
      case "OWN_CHARACTER":
        if (ownByRecipient.has(entry.recipientPlayerId)) {
          return fail("each player must receive exactly one OWN_CHARACTER entry");
        }
        ownByRecipient.set(entry.recipientPlayerId, entry);
        break;

      case "DEMON_IDENTITY":
        if (demonIdentityByRecipient.has(entry.recipientPlayerId)) {
          return fail("each minion must receive exactly one DEMON_IDENTITY entry");
        }
        demonIdentityByRecipient.set(entry.recipientPlayerId, entry);
        break;

      case "MINION_IDENTITIES":
        if (minionIdentitiesByRecipient.has(entry.recipientPlayerId)) {
          return fail("each evil player must receive exactly one MINION_IDENTITIES entry");
        }
        minionIdentitiesByRecipient.set(entry.recipientPlayerId, entry);
        break;

      case "DEMON_BLUFFS":
        if (demonBluffsByRecipient.has(entry.recipientPlayerId)) {
          return fail("demon must receive exactly one DEMON_BLUFFS entry");
        }
        demonBluffsByRecipient.set(entry.recipientPlayerId, entry);
        break;
    }
  }

  if (ownByRecipient.size !== input.roster.length) {
    return fail("every player must receive exactly one OWN_CHARACTER entry");
  }

  for (const rosterEntry of input.roster) {
    const own = ownByRecipient.get(rosterEntry.playerId);
    const assignment = assignmentByPlayerId.get(rosterEntry.playerId);
    if (own === undefined || assignment === undefined) {
      return fail("OWN_CHARACTER entries must cover every roster player");
    }

    const catalogRole = catalogByRoleId.get(own.role.roleId);
    if (
      !sameRoleSetupSnapshot(own.role, assignment.role) ||
      catalogRole === undefined ||
      !sameRoleSetupSnapshot(own.role, catalogRole)
    ) {
      return fail("OWN_CHARACTER role must match assignment and setup catalog");
    }
  }

  const minionPlayerIds = new Set(minionAssignments.map((assignment) => assignment.playerId));
  const evilPlayerIds = new Set([...minionPlayerIds, demon.playerId]);
  const demonReference = {
    playerId: demon.playerId,
    seatNumber: demon.seatNumber
  } satisfies KnownPlayerReference;

  if (demonIdentityByRecipient.size !== minionAssignments.length) {
    return fail("each minion must receive exactly one DEMON_IDENTITY entry");
  }

  for (const minion of minionAssignments) {
    const entry = demonIdentityByRecipient.get(minion.playerId);
    if (entry === undefined) {
      return fail("each minion must receive DEMON_IDENTITY");
    }

    if (
      !exactKnownPlayerReference(entry.demon) ||
      entry.demon.playerId !== demonReference.playerId ||
      entry.demon.seatNumber !== demonReference.seatNumber ||
      entry.demon.playerId === entry.recipientPlayerId
    ) {
      return fail("DEMON_IDENTITY must point to the unique demon without leaking role fields");
    }
  }

  for (const recipient of demonIdentityByRecipient.keys()) {
    if (!minionPlayerIds.has(recipient)) {
      return fail("only minions may receive DEMON_IDENTITY");
    }
  }

  if (minionIdentitiesByRecipient.size !== evilPlayerIds.size) {
    return fail("demon and minions must receive MINION_IDENTITIES entries");
  }

  for (const [recipient, entry] of minionIdentitiesByRecipient.entries()) {
    if (!evilPlayerIds.has(recipient)) {
      return fail("only demon or minions may receive MINION_IDENTITIES");
    }

    if (!knownReferencesAreSorted(entry.minions)) {
      return fail("MINION_IDENTITIES references must be canonical and role-free");
    }

    const expected = recipient === demon.playerId
      ? minionAssignments
      : minionAssignments.filter((assignment) => assignment.playerId !== recipient);

    if (entry.minions.length !== expected.length) {
      return fail("MINION_IDENTITIES entry has the wrong number of visible minions");
    }

    for (const [index, reference] of entry.minions.entries()) {
      const expectedMinion = expected[index];
      if (
        expectedMinion === undefined ||
        reference.playerId !== expectedMinion.playerId ||
        reference.seatNumber !== expectedMinion.seatNumber ||
        reference.playerId === recipient ||
        reference.playerId === demon.playerId ||
        !minionPlayerIds.has(reference.playerId)
      ) {
        return fail("MINION_IDENTITIES must reference only the permitted other minions");
      }
    }
  }

  if (demonBluffsByRecipient.size !== 1 || !demonBluffsByRecipient.has(demon.playerId)) {
    return fail("only the demon must receive exactly one DEMON_BLUFFS entry");
  }

  const demonBluffs = demonBluffsByRecipient.get(demon.playerId);
  if (demonBluffs === undefined) {
    return fail("demon must receive DEMON_BLUFFS");
  }

  if (demonBluffs.roles.length !== input.setup.demonBluffs.length || !roleListIsAsciiSorted(demonBluffs.roles)) {
    return fail("DEMON_BLUFFS roles must use canonical setup demon bluff order");
  }

  for (const [index, role] of demonBluffs.roles.entries()) {
    const expected = input.setup.demonBluffs[index];
    if (
      expected === undefined ||
      !sameRoleSetupSnapshot(role, expected) ||
      actualRoleIds.has(role.roleId)
    ) {
      return fail("DEMON_BLUFFS roles must deeply equal setup.demonBluffs and exclude actual roles");
    }
  }

  return { valid: true };
};
