"use client";

import React from "react";
import { DiffLine } from "@/types";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
  diff: DiffLine[];
}

export function DiffViewer({ diff }: DiffViewerProps) {
  return (
    <div className="font-mono text-sm space-y-0.5">
      {diff.map((line, index) => (
        <div
          key={index}
          className={cn(
            "px-4 py-1 rounded",
            line.type === "added" &&
              "bg-emerald-50 border-l-2 border-emerald-500 text-emerald-700",
            line.type === "removed" &&
              "bg-red-50 border-l-2 border-red-500 text-red-700 line-through opacity-70",
            line.type === "unchanged" && "text-slate-500"
          )}
        >
          <span className="mr-3 text-slate-400 select-none">
            {line.type === "added" && "+"}
            {line.type === "removed" && "-"}
            {line.type === "unchanged" && " "}
          </span>
          {line.content || " "}
        </div>
      ))}
    </div>
  );
}
