import type { Role, SessionType } from "./types.js";

const valueRoleMap: Record<string, Role> = {
  candidate: "candidate",
  interviewer: "interviewer",
};

const valueSessionTypeMap: Record<string, SessionType> = {
  new: "new",
  existing: "existing",
};

export const getRoleFromValue = (value: string): Role => {
  if (Object.hasOwn(valueRoleMap, value)) {
    return value as Role;
  }

  return "candidate";
};

export const getSessionTypeFromValue = (value: string): SessionType => {
  if (Object.hasOwn(valueSessionTypeMap, value)) {
    return value as SessionType;
  }

  return "new";
};
