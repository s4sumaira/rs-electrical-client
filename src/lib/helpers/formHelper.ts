export function parseFormData<T>(formData: FormData): Partial<T> {
  const rawEntries = Object.fromEntries(formData);

  const parsedEntries = Object.fromEntries(
    Object.entries(rawEntries).map(([key, value]) => {

      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        try {
          return [key, JSON.parse(value)]; // Convert stringified arrays
        } catch {
          return [key, value]; // Return as is if JSON.parse fails
        }
      
      }
      return [key, value]; // Return non-array fields as is
    })
  );

  return parsedEntries as Partial<T>;
}