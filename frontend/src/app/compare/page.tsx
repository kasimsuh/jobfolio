"use client";

import React, { useMemo } from "react";
import { GitCompare, ArrowRight, FileText } from "lucide-react";
import { Card, Select, Button } from "@/components/ui";
import { DiffViewer } from "../../components/resumes/DiffViewer";
import { useAppStore } from "@/hooks";
import { computeDiff, parseMarkdown } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CompareView() {
  const {
    resumeVersions,
    compareVersionIds,
    setCompareVersions,
    getResumeById,
  } = useAppStore();

  const version1 = compareVersionIds.v1
    ? getResumeById(compareVersionIds.v1)
    : null;
  const version2 = compareVersionIds.v2
    ? getResumeById(compareVersionIds.v2)
    : null;

  const diff = useMemo(() => {
    if (!version1 || !version2) return null;
    return computeDiff(version1.content, version2.content);
  }, [version1, version2]);

  const stats = useMemo(() => {
    if (!diff) return null;
    const added = diff.filter((l) => l.type === "added").length;
    const removed = diff.filter((l) => l.type === "removed").length;
    const unchanged = diff.filter((l) => l.type === "unchanged").length;
    return { added, removed, unchanged };
  }, [diff]);

  const versionOptions = [
    { value: "", label: "Select a version..." },
    ...resumeVersions.map((v) => ({
      value: v.id,
      label: `${v.name} (${v.id})`,
    })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-3">
          <GitCompare className="w-6 h-6 text-primary-500" />
          Compare Resume Versions
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          See exactly what changed between two versions of your resume
        </p>
      </div>

      {/* Version Selectors */}
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Base Version (Original)
            </label>
            <Select
              value={compareVersionIds.v1 || ""}
              onChange={(e) =>
                setCompareVersions({
                  ...compareVersionIds,
                  v1: e.target.value || null,
                })
              }
              options={versionOptions}
            />
          </div>

          <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-50">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Compare Version (New)
            </label>
            <Select
              value={compareVersionIds.v2 || ""}
              onChange={(e) =>
                setCompareVersions({
                  ...compareVersionIds,
                  v2: e.target.value || null,
                })
              }
              options={versionOptions}
            />
          </div>
        </div>
      </Card>

      {/* Comparison Result */}
      {version1 && version2 ? (
        <>
          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-sm">
                  <span className="text-emerald-400 font-medium">
                    {stats.added}
                  </span>{" "}
                  <span className="text-slate-400">additions</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm">
                  <span className="text-red-400 font-medium">
                    {stats.removed}
                  </span>{" "}
                  <span className="text-slate-400">deletions</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-200" />
                <span className="text-sm">
                  <span className="text-slate-500 font-medium">
                    {stats.unchanged}
                  </span>{" "}
                  <span className="text-slate-400">unchanged</span>
                </span>
              </div>
            </div>
          )}

          {/* Diff View */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                Diff: {version1.name} → {version2.name}
              </h3>
            </div>

            <div className="max-h-[600px] overflow-y-auto bg-slate-100 rounded-lg p-4 scrollbar-thin">
              {diff && <DiffViewer diff={diff} />}
            </div>
          </Card>

          {/* Side by Side Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                {version1.name}
                <span className="text-xs text-slate-400">({version1.id})</span>
              </h3>
              <div
                className="max-h-[400px] overflow-y-auto prose  prose-sm max-w-none p-4 bg-slate-100 rounded-lg scrollbar-thin"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(version1.content),
                }}
              />
            </Card>

            <Card>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                {version2.name}
                <span className="text-xs text-slate-400">({version2.id})</span>
              </h3>
              <div
                className="max-h-[400px] overflow-y-auto prose  prose-sm max-w-none p-4 bg-slate-100 rounded-lg scrollbar-thin"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(version2.content),
                }}
              />
            </Card>
          </div>
        </>
      ) : (
        <Card className="text-center py-12">
          <GitCompare className="w-12 h-12 text-slate-800/20 mx-auto mb-4" />
          <p className="text-slate-400">
            Select two resume versions above to see the differences
          </p>
        </Card>
      )}
    </div>
  );
}
