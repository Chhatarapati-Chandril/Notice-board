import { AUDIENCES } from "../constants.js";

export function getAllowedAudiencesForRole(role) {
  switch (role) {
    case "ADMIN":
      return [
        AUDIENCES.PUBLIC,
        AUDIENCES.STUDENTS,
        AUDIENCES.PROFESSORS,
        AUDIENCES.BOTH,
      ];
    case "STUDENT":
      return [
        AUDIENCES.PUBLIC,
        AUDIENCES.STUDENTS,
        AUDIENCES.BOTH,
      ];
    case "PROFESSOR":
      return [
        AUDIENCES.PUBLIC,
        AUDIENCES.PROFESSORS,
        AUDIENCES.BOTH,
      ];
    default:
      return [AUDIENCES.PUBLIC];
  }
}
