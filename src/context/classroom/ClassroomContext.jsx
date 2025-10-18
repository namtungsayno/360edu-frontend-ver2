// src/context/classroom/ClassroomContext.jsx
import React, { createContext, useContext } from "react";
import useClassrooms from "../../hooks/classroom/useClassrooms";

const ClassroomCtx = createContext(null);

export function ClassroomProvider({ children }) {
  const classrooms = useClassrooms({ page: 0, size: 10, q: "" });
  return (
    <ClassroomCtx.Provider value={classrooms}>{children}</ClassroomCtx.Provider>
  );
}

export function useClassroomContext() {
  const ctx = useContext(ClassroomCtx);
  if (!ctx)
    throw new Error(
      "useClassroomContext must be used within ClassroomProvider"
    );
  return ctx;
}
