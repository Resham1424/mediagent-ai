import { AlertTriangle, ShieldAlert, Activity, FileText, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AssessmentTab() {
  const { triageData, setActiveTab, markTabComplete, addLog } = useAppStore();

  if (!triageData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <Activity className="w-12 h-12 text-muted-foreground opacity-50" />
        <h3 className="text-xl text-white font-display">No Assessment Data</h3>
        <p className="text-muted-foreground">Please complete the triage form first.</p>
        <Button onClick={() => setActiveTab('triage')} variant="outline">Go to Triage</Button>
      </div>
    );
  }

  const { symptomAnalysis, emergencyAnalysis } = triageData;
  const isEmergency = emergencyAnalysis.is_emergency;

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'HIGH': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const handleNext = () => {
    markTabComplete('assessment');
    setActiveTab('specialist');
    addLog('SPECIALIST_AGENT', 'Viewing recommendations', 'User proceeded to specialist match.');
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* Emergency Override Banner */}
      {isEmergency && (
        <div className="w-full bg-destructive/10 border border-destructive/30 rounded-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(248,113,113,0.05)_10px,rgba(248,113,113,0.05)_20px)]" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-destructive flex items-center gap-2">
                EMERGENCY DETECTED
                <Badge variant="destructive" className="ml-2">{emergencyAnalysis.emergency_level}</Badge>
              </h2>
              <p className="text-white/90 mt-1">{emergencyAnalysis.do_not_delay_message}</p>
            </div>
          </div>
          <div className="relative z-10 mt-4 pt-4 border-t border-destructive/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-destructive/80 mb-2">Immediate Actions Required:</h4>
            <ul className="space-y-1">
              {emergencyAnalysis.immediate_actions.map((action, i) => (
                <li key={i} className="text-sm text-white flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Primary Stats */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Risk Level</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-xl border font-bold text-lg tracking-wide shadow-lg ${getRiskColor(symptomAnalysis.risk_level)}`}>
              {symptomAnalysis.risk_level}
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {symptomAnalysis.risk_reasoning}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Affected Systems</h3>
            <div className="flex flex-wrap gap-2">
              {symptomAnalysis.body_systems_affected.map((sys, i) => (
                <Badge key={i} variant="glass">{sys}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-display text-white">Symptom Breakdown</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Identified Symptoms</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {symptomAnalysis.symptoms_identified.map((sym, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90">
                      {sym}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Severity Indicators</h4>
                <ul className="space-y-2">
                  {symptomAnalysis.severity_indicators.map((ind, i) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500/80 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Possible Categories (Advisory)
            </h3>
            <div className="flex flex-wrap gap-2">
              {symptomAnalysis.possible_condition_categories.map((cat, i) => (
                <Badge key={i} variant="outline" className="bg-amber-500/5 border-amber-500/20 text-amber-500/90">{cat}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              {symptomAnalysis.advisory_note}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleNext}>
          View Specialist Recommendations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

    </div>
  );
}
