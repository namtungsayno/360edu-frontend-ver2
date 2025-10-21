import React from "react";
import { cn } from "./utils";

export function Table({ className, ...props }) {
  return <table className={cn("w-full border-collapse text-sm", className)} {...props} />;
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("bg-gray-100 text-left", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("border-b hover:bg-gray-50", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={cn("px-4 py-2 font-medium text-gray-700", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={cn("px-4 py-2", className)} {...props} />;
}
