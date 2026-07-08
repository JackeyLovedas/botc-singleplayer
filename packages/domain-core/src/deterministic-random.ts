const xmur3 = (input: string): (() => number) => {
  let hash = 1779033703 ^ input.length;
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
};

export class DeterministicRandom {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  public constructor(seed: string) {
    const seedGenerator = xmur3(seed);
    this.a = seedGenerator();
    this.b = seedGenerator();
    this.c = seedGenerator();
    this.d = seedGenerator();
  }

  public nextUint32(): number {
    this.a >>>= 0;
    this.b >>>= 0;
    this.c >>>= 0;
    this.d >>>= 0;

    let result = (this.a + this.b) >>> 0;
    this.a = (this.b ^ (this.b >>> 9)) >>> 0;
    this.b = (this.c + (this.c << 3)) >>> 0;
    this.c = ((this.c << 21) | (this.c >>> 11)) >>> 0;
    this.d = (this.d + 1) >>> 0;
    result = (result + this.d) >>> 0;
    this.c = (this.c + result) >>> 0;

    return result;
  }

  public nextInt(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("maxExclusive must be a positive integer");
    }

    const range = 0x100000000;
    const limit = range - (range % maxExclusive);
    let value = this.nextUint32();
    while (value >= limit) {
      value = this.nextUint32();
    }

    return value % maxExclusive;
  }
}
