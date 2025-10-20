export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
};
export function hasAnyRole(roles, required = []) {
  return required.some((r) => roles?.includes(r));
}
