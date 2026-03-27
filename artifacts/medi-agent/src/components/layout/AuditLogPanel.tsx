import { useEffect, useRef } from "react";
import { Download, ListCollapse, FileJson } from "lucide-react";
import { useAppStore, type AgentType } from "@/store/use-app-store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const AGENT_CONFIG: Record<AgentType, { color: string, bg: string, label: string }> = {
  SYMPTOM_AGENT: { color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20", label: "Triage" },
  EMERGENCY_AGENT: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", label: "Safety" },
  SPECIALIST_AGENT: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Matching" },
  SCHEDULING_AGENT: { color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", label: "Booking" },
  FOLLOWUP_AGENT: { color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", label: "Check-in" }
};

export function AuditLogPanel() {
  const { auditLogs } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `mediagent-audit-${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <aside className="w-[320px] h-full flex flex-col glass-panel border-y-0 border-r-0 border-l-white/10 rounded-none z-10 relative bg-card">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListCollapse className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-white">Live Audit Log</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70">
          {auditLogs.length} Events
        </span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
      >
        {auditLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-3">
            <FileJson className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No events logged yet.</p>
          </div>
        ) : (
          auditLogs.map((log) => {
            const config = AGENT_CONFIG[log.agent];
            return (
              <div 
                key={log.id} 
                className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1.5 transition-all animate-in slide-in-from-right-4 fade-in duration-300",
                  config.bg
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color)}>
                    {config.label} Agent
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-sm text-white font-medium leading-snug">
                  {log.action}
                </p>
                {log.details && (
                  <p className="text-xs text-muted-foreground font-mono mt-1 pt-2 border-t border-white/5">
                    {log.details}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-background/50">
        <Button 
          variant="outline" 
          className="w-full h-9 text-xs" 
          onClick={exportLogs}
          disabled={auditLogs.length === 0}
        >
          <Download className="w-3.5 h-3.5 mr-2" />
          Export JSON Log
        </Button>
      </div>
    </aside>
  );
}
