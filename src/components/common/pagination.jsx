import React from "react";
import { cn } from "./utils";

export function Pagination({ children, className }) {
  return <nav className={cn("flex justify-center mt-4", className)}>{children}</nav>;
}

export function PaginationContent({ children, className }) {
  return <ul className={cn("flex gap-2 items-center", className)}>{children}</ul>;
}

export function PaginationItem({ children }) {
  return <li>{children}</li>;
}

export function PaginationLink({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded border text-sm",
        isActive ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
      )}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn("px-3 py-1 rounded border bg-white hover:bg-gray-100", className)}
    >
      «
    </button>
  );
}

export function PaginationNext({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn("px-3 py-1 rounded border bg-white hover:bg-gray-100", className)}
    >
      »
    </button>
  );
}
