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

export const ERRORS = {
  UNAUTHORIZED: {
    code: 401,
    json: {
      r: false,
      error: 'Invalid token, auth again.',
    },
  },
  FORBIDDEN: {
    code: 403,
    json: {
      r: false,
      error: 'Forbidden.',
    },
  },
  EXPIRED_TOKEN: {
    code: 401,
    json: {
      r: false,
      error: 'Expired token, auth again.',
    },
  },
};

export const safeJsonParse = (jsonString: string): any | undefined => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return undefined;
  }
};

export const ROLES_TYPES = {
  USER: 'resu',
  ROOT: 'toor',
};
