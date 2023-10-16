export const hasMessage = (obj) =>
  typeof obj === "object" &&
  obj !== null &&
  "message" in obj &&
  typeof obj.message === "string";

export const getErrMessage = (err) =>
  hasMessage(err) ? err.message : "Unknown error occurred";
