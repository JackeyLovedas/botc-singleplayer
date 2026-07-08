import { describe, expect, it } from "vitest";
import { DeterministicRandom } from "@botc/domain-core";

describe("DeterministicRandom", () => {
  it("uses fixed standard sfc32 nextUint32 vectors", () => {
    const random = new DeterministicRandom("vector-seed");

    expect(Array.from({ length: 10 }, () => random.nextUint32())).toStrictEqual([
      4192517003,
      1065224812,
      2124141431,
      4225418798,
      39656548,
      229722173,
      1759554890,
      569041450,
      1103139648,
      3514609012
    ]);
  });

  it("uses fixed rejection-sampled nextInt vectors", () => {
    const random = new DeterministicRandom("vector-seed");

    expect(Array.from({ length: 10 }, () => random.nextInt(17))).toStrictEqual([4, 1, 16, 16, 2, 0, 14, 8, 9, 10]);
  });
});
