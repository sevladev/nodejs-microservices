export const ERRORS = {
  UNAUTHORIZED: {
    code: 401,
    json: {
      r: false,
      error: "Invalid token, auth again.",
    },
  },
  FORBIDDEN: {
    code: 403,
    json: {
      r: false,
      error: "Forbidden.",
    },
  },
  EXPIRED_TOKEN: {
    code: 401,
    json: {
      r: false,
      error: "Expired token, auth again.",
    },
  },
};

export type ENVIROMENTS = "test" | "dev" | "prod";

export type ProjectionType<T> = {
  [K in keyof T]?: 0 | 1;
};

export const ROLES_TYPES = {
  USER: "resu",
  ROOT: "toor",
};
