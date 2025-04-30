export function getChangedFields<T extends Record<string, unknown>>(
  initial: T,
  current: T
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue;

    const initialValue = initial?.[key];
    const currentValue = current[key];

    // Skip fields with empty string values
    if (currentValue === "") continue;

    if (
      typeof currentValue === "object" &&
      currentValue !== null &&
      !Array.isArray(currentValue)
    ) {
      const nestedChanges = getChangedFields(initialValue || {}, currentValue);
      if (Object.keys(nestedChanges).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        changed[key] = nestedChanges as any;
      }
    } else if (currentValue !== initialValue) {
      changed[key] = currentValue;
    }
  }

  return changed;
}
