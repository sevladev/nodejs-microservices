export const ERRORS = {
  UNAUTHORIZED: {
    code: 401,
    json: {
      r: false,
      errors: ["Invalid token, auth again."],
    },
  },
  FORBIDDEN: {
    code: 403,
    json: {
      r: false,
      errors: ["Forbidden."],
    },
  },
  EXPIRED_TOKEN: {
    code: 401,
    json: {
      r: false,
      errors: ["Expired Token, auth again."],
    },
  },
};
