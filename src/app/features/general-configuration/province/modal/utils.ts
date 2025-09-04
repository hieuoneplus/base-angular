export function trimFormValues(formValue: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in formValue) {
    const value = formValue[key];
    result[key] = typeof value === 'string' ? value.trim() : value;
  }
  return result;
}
