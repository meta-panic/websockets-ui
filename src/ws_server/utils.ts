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


export function generateUUID() {
  return Math.random().toString(36).slice(2, 6);

  // return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
  //   (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  // );
}
