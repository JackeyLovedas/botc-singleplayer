type CanonicalData = null | boolean | string | number | readonly CanonicalData[] | { readonly [key: string]: CanonicalData };

const codeUnitCompare = (left: string, right: string): number => left < right ? -1 : left > right ? 1 : 0;

const inspectCanonicalData = (value: unknown, ancestors: Set<object>): value is CanonicalData => {
  if (value === null || typeof value === "boolean" || typeof value === "string") return true;
  if (typeof value === "number") return Number.isSafeInteger(value) && !Object.is(value, -0);
  if (typeof value !== "object") return false;
  if (ancestors.has(value)) return false;

  ancestors.add(value);
  try {
    const array = Array.isArray(value);
    const objectValue: object = value;
    const prototype = Object.getPrototypeOf(objectValue) as unknown;
    if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) return false;
    const keys = Reflect.ownKeys(objectValue);
    if (keys.some((key) => typeof key === "symbol")) return false;
    const descriptors = Object.getOwnPropertyDescriptors(objectValue);

    if (array) {
      const lengthDescriptor = descriptors.length;
      if (lengthDescriptor === undefined || !("value" in lengthDescriptor) ||
          typeof lengthDescriptor.value !== "number" || !Number.isSafeInteger(lengthDescriptor.value) ||
          lengthDescriptor.value < 0 || lengthDescriptor.enumerable !== false || lengthDescriptor.configurable !== false ||
          typeof lengthDescriptor.writable !== "boolean" || keys.length !== lengthDescriptor.value + 1) return false;
      for (let index = 0; index < lengthDescriptor.value; index += 1) {
        const descriptor = descriptors[String(index)];
        if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true ||
            !inspectCanonicalData(descriptor.value, ancestors)) return false;
      }
      return true;
    }

    for (const key of keys) {
      if (typeof key !== "string") return false;
      const descriptor = descriptors[key];
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true ||
          !inspectCanonicalData(descriptor.value, ancestors)) return false;
    }
    return true;
  } finally {
    ancestors.delete(value);
  }
};

const cloneCanonicalData = (value: unknown): CanonicalData | undefined => {
  try {
    if (!inspectCanonicalData(value, new Set())) return undefined;
    // structuredClone rejects Proxy values, including transparent and nested proxies.
    return structuredClone(value);
  } catch {
    return undefined;
  }
};

const encode = (value: CanonicalData): string => {
  if (value === null) return "z";
  if (typeof value === "boolean") return value ? "b1" : "b0";
  if (typeof value === "number") return `n${value};`;
  if (typeof value === "string") return `s${value.length}:${value}`;
  if (Array.isArray(value)) return `a${value.length}[${value.map(encode).join("")}]`;
  const record = value as { readonly [key: string]: CanonicalData };
  const keys = Object.keys(record).sort(codeUnitCompare);
  return `o${keys.length}{${keys.map((key) => `${encode(key)}${encode(record[key]!)}`).join("")}}`;
};

export const isCanonicalDataValue = (value: unknown): boolean => cloneCanonicalData(value) !== undefined;

export const isDenseCanonicalArray = (value: unknown): value is readonly unknown[] => {
  const clone = cloneCanonicalData(value);
  return clone !== undefined && Array.isArray(clone);
};

export const sameCanonicalDataValue = (left: unknown, right: unknown): boolean => {
  const leftClone = cloneCanonicalData(left);
  if (leftClone === undefined) return false;
  const rightClone = cloneCanonicalData(right);
  return rightClone !== undefined && encode(leftClone) === encode(rightClone);
};
