import { Activity, ShieldAlert } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export function Header() {
  const { sessionId } = useAppStore();

  return (
    <div className="flex flex-col z-50">
      {/* Top Main Header */}
      <header className="h-16 px-6 glass-panel border-b-0 border-x-0 border-t-0 border-b-white/10 flex items-center justify-between shrink-0 rounded-none relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display text-white tracking-wide">MediAgent AI</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                Beta
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center">
          <h2 className="text-sm font-medium text-white/80">Healthcare Operations System</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span className="status-dot text-primary bg-primary inline-block"></span>
            All systems operational
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs text-muted-foreground font-mono">Session ID</span>
            <span className="text-sm text-white font-mono">{sessionId}</span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Advisory Only</span>
          </div>
        </div>
      </header>
      
      {/* Fixed Disclaimer Bar */}
      <div className="h-8 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-center shrink-0">
        <p className="text-xs text-amber-500/90 flex items-center gap-2 font-medium">
          <ShieldAlert className="w-3 h-3" />
          This AI system provides informational guidance only and does not replace professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}
