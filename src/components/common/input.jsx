import React from "react"; import { cn } from "./utils";
export function Input({ className, ...props }) { return <input className={cn("border rounded px-3 py-2 w-full", className)} {...props} /> }