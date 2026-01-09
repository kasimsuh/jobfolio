"use client";
import React from "react";
import { ApplicationCard } from "./ApplicationCard";
import { useAppStore } from "@/hooks";
import { STATUS_CONFIG, STATUS_ICONS, STATUS_ORDER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function KanbanBoard() {
  const getApplicationsByStatus = useAppStore(
    (state) => state.getApplicationsByStatus
  );
  const setSelectedApplication = useAppStore(
    (state) => state.setSelectedApplication
  );

  const groupedApps = getApplicationsByStatus();

  return (
    <div className="-mx-6 px-6 overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STATUS_ORDER.map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = STATUS_ICONS[status];
          const apps = groupedApps[status];

          return (
            <div key={status} className="w-64 flex-shrink-0">
              {/* Column Header */}
              <div
                className={cn(
                  "flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border",
                  config.bgColor,
                  config.borderColor
                )}
              >
                <Icon className={cn("w-4 h-4", config.textColor)} />
                <span className="text-sm font-medium">{config.label}</span>
                <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                  {apps.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                {apps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onClick={() => setSelectedApplication(app.id)}
                  />
                ))}

                {apps.length === 0 && (
                  <div className="text-center py-8 text-slate-300 text-sm border border-dashed border-slate-200 rounded-xl">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
