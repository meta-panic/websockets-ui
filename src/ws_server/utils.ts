export function deepParse(obj: unknown): unknown {
  if (typeof obj === "string") {
    try {
      const parsed = JSON.parse(obj);
      return deepParse(parsed);
    } catch {
      return obj;
    }
  } else if (Array.isArray(obj)) {
    return obj.map(deepParse);
  } else if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepParse(value);
    }
    return result;
  }
  return obj;
}
