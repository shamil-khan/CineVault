export const APP_TITLE = import.meta.env.VITE_APP_TITLE;

export const pluralName = (
  items: unknown[],
  word: string,
  plural: string | undefined = undefined,
): string => (items.length === 1 ? word : plural ? plural : `${word}s`);
