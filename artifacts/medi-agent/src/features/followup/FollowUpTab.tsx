import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ActivitySquare, Send, BellRing, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/use-app-store";
import { useProcessFollowUp } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  patientCheckin: z.string().min(5, "Please provide a brief update"),
  daysSinceVisit: z.coerce.number().min(1).default(1)
});

type FormValues = z.infer<typeof formSchema>;

export function FollowUpTab() {
  const { triageData, followUpData, setFollowUpData, addLog, isAnalyzing, setIsAnalyzing, patientInfo } = useAppStore();
  const { toast } = useToast();
  const { mutateAsync: processFollowUp } = useProcessFollowUp();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormValues) => {
    if (!triageData) return;
    
    setIsAnalyzing(true);
    addLog('FOLLOWUP_AGENT', 'Analyzing recovery progress', 'Processing patient check-in data.');
    
    try {
      const result = await processFollowUp({
        data: {
          originalSymptoms: triageData.symptomAnalysis.symptoms_identified.join(', '),
          patientCheckin: data.patientCheckin,
          daysSinceVisit: data.daysSinceVisit
        }
      });
      
      addLog('FOLLOWUP_AGENT', 'Check-in processed', `Recovery assessment: ${result.recovery_assessment}`);
      
      if (result.escalation_needed) {
         addLog('EMERGENCY_AGENT', 'Escalation triggered', 'Follow-up indicates worsening symptoms.');
      }

      setFollowUpData(result);
    } catch (error: any) {
      toast({
        title: "Check-in Failed",
        description: "Could not process your follow-up data.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!triageData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <ActivitySquare className="w-12 h-12 text-muted-foreground opacity-50" />
        <h3 className="text-xl text-white font-display">No Active Triage</h3>
        <p className="text-muted-foreground">This section activates after a visit is scheduled.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Recovery Tracker</h2>
          <p className="text-muted-foreground">Monitor your progress post-visit.</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3">
           <BellRing className="w-4 h-4 text-primary animate-bounce" />
           <div className="text-sm">
             <span className="text-muted-foreground block text-xs">Next Meds</span>
             <span className="text-white font-medium">8:00 PM</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Check-in Form */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Daily Check-in</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Days since appointment</label>
                <input 
                  type="number"
                  {...register("daysSinceVisit")}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">How are you feeling today?</label>
                <textarea 
                  {...register("patientCheckin")}
                  className="w-full h-32 bg-input border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="e.g., The pain has mostly subsided, but I still feel a bit tired..."
                  disabled={isAnalyzing}
                />
                 {errors.patientCheckin && <p className="text-xs text-destructive">{errors.patientCheckin.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Submit Check-in</>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* AI Results */}
        <div className="space-y-6">
          {!followUpData ? (
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center opacity-50 border-dashed border-white/10">
              <TrendingUp className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground max-w-[200px]">Submit your daily check-in to receive AI-powered recovery analysis.</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border-t-4 border-t-green-500 animate-in slide-in-from-right-4 duration-500">
              
              {followUpData.escalation_needed && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4" /> ESCALATION REQUIRED
                  </div>
                  <p className="text-sm opacity-90">Your symptoms appear to be worsening. Please contact your doctor immediately.</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="font-bold text-white">Assessment</h3>
                <Badge variant={followUpData.recovery_assessment === 'Improving' ? 'success' : followUpData.recovery_assessment === 'Stable' ? 'outline' : 'warning'}>
                  {followUpData.recovery_assessment}
                </Badge>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {followUpData.follow_up_recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Watch Out For</h4>
                  <div className="flex flex-wrap gap-2">
                    {followUpData.warning_signs_to_watch.map((sign, i) => (
                      <Badge key={i} variant="outline" className="border-red-500/20 text-red-400 bg-red-500/5">{sign}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-primary italic">"{followUpData.motivational_note}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
