import { 
  ClipboardType, 
  Stethoscope, 
  UserRoundSearch, 
  CalendarClock, 
  ActivitySquare,
  CheckCircle2,
  Circle
} from "lucide-react";
import { useAppStore, type TabId } from "@/store/use-app-store";
import { cn } from "@/lib/utils";

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'triage', label: '1. Symptom Triage', icon: ClipboardType },
  { id: 'assessment', label: '2. Risk Assessment', icon: Stethoscope },
  { id: 'specialist', label: '3. Specialist Match', icon: UserRoundSearch },
  { id: 'scheduling', label: '4. Scheduling', icon: CalendarClock },
  { id: 'followup', label: '5. Follow-up', icon: ActivitySquare },
];

export function Sidebar() {
  const { activeTab, setActiveTab, completedTabs, patientInfo, triageData } = useAppStore();

  return (
    <aside className="w-[280px] h-full flex flex-col glass-panel border-y-0 border-l-0 border-r-white/10 rounded-none z-10 relative">
      
      {/* Patient Info Card */}
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Patient Profile</h3>
        {patientInfo ? (
          <div className="glass-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start relative z-10">
              <span className="font-semibold text-white truncate pr-2">{patientInfo.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80 shrink-0">
                {patientInfo.age}y
              </span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-sm text-muted-foreground">{patientInfo.gender}</span>
              {triageData && (
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Triaged
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-4 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-center h-24">
            <UserRoundSearch className="w-6 h-6 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground">Awaiting triage data...</span>
          </div>
        )}
      </div>

      {/* Navigation Stepper */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Workflow Steps</h3>
        <div className="flex flex-col relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-px bg-white/10" />

          {TABS.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isCompleted = completedTabs.includes(tab.id);
            const isSelectable = isCompleted || isActive || (index > 0 && completedTabs.includes(TABS[index - 1].id));
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => isSelectable && setActiveTab(tab.id)}
                disabled={!isSelectable}
                className={cn(
                  "relative flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-300 group",
                  isActive ? "bg-white/10 shadow-lg" : "hover:bg-white/5",
                  !isSelectable && "opacity-40 cursor-not-allowed hover:bg-transparent"
                )}
              >
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shrink-0",
                  isActive ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(13,148,136,0.5)]" : 
                  isCompleted ? "bg-primary/20 text-primary border border-primary/30" : 
                  "bg-card border border-white/10 text-muted-foreground"
                )}>
                  {isCompleted && !isActive ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  
                  {isActive && (
                    <div className="absolute -inset-1 rounded-full border border-primary/30 animate-ping" />
                  )}
                </div>
                
                <div className="flex flex-col z-10">
                  <span className={cn(
                    "font-medium transition-colors",
                    isActive ? "text-white" : isCompleted ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {tab.label}
                  </span>
                  {isActive && <span className="text-xs text-primary">In progress</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Status */}
      <div className="p-6 border-t border-white/5">
         <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-white/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">Core system online</span>
         </div>
      </div>
    </aside>
  );
}
