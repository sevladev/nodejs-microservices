export const UTILS = {
  STRING: {
    NORMALIZE_SLUG: (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .toUpperCase();
    },
    PASCAL_CASE: (str: string) => {
      return str
        .split(' ')
        .map(
          (item) =>
            `${item.charAt(0).toUpperCase()}${item.slice(1).toLowerCase()}`,
        )
        .join(' ');
    },
  },
};
