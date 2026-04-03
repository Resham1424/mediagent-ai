import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ArrowRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/use-app-store";
import { useAnalyzeSymptoms } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patientName: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(1).max(120),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  symptoms: z.string().min(10, "Please describe symptoms in more detail"),
  duration: z.string().min(1, "Duration is required"),
  durationUnit: z.enum(["hours", "days", "weeks"])
});

type FormValues = z.infer<typeof formSchema>;

export function TriageTab() {
  const { 
    setPatientInfo, 
    setTriageData, 
    setActiveTab, 
    markTabComplete,
    addLog,
    isAnalyzing,
    setIsAnalyzing
  } = useAppStore();
  const { toast } = useToast();
  
  const { mutateAsync: analyzeSymptoms } = useAnalyzeSymptoms();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      durationUnit: "days",
      gender: "Prefer not to say"
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    setPatientInfo({ name: data.patientName, age: data.age, gender: data.gender });
    
    addLog('SYMPTOM_AGENT', 'Initiating triage analysis', `Received symptom input for ${data.age}yo patient.`);
    
    try {
      // Simulate slight delay for UX
      await new Promise(r => setTimeout(r, 1000));
      addLog('EMERGENCY_AGENT', 'Running safety checks', 'Evaluating for critical risk factors.');
      
      const result = await analyzeSymptoms({ data });
      
      addLog('SPECIALIST_AGENT', 'Matching specialists', `Found ${result.specialistRecommendation.primary_specialist} recommendation.`);
      addLog('SYMPTOM_AGENT', 'Analysis complete', `Risk level: ${result.symptomAnalysis.risk_level}`);

      setTriageData(result);
      markTabComplete('triage');
      setActiveTab('assessment');
      
    } catch (error: any) {
      addLog('SYMPTOM_AGENT', 'Analysis failed', error.message || 'Unknown error');
      toast({
        title: "Analysis Failed",
        description: "There was an error communicating with the AI agents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-display text-white mb-2">Initial Symptom Triage</h2>
        <p className="text-muted-foreground">Describe your condition for our AI orchestration pipeline to analyze.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium text-white/80">Patient Name</label>
              <input 
                {...register("patientName")}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="John Doe"
                disabled={isAnalyzing}
              />
              {errors.patientName && <p className="text-xs text-destructive">{errors.patientName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Age</label>
              <input 
                type="number"
                {...register("age")}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="35"
                disabled={isAnalyzing}
              />
              {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Gender</label>
              <select 
                {...register("gender")}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                disabled={isAnalyzing}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex justify-between">
              <span>Primary Symptoms</span>
              <span className="text-xs text-muted-foreground">Be as descriptive as possible</span>
            </label>
            <textarea 
              {...register("symptoms")}
              className="w-full h-32 bg-input border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="e.g., I've been experiencing a sharp pain in my lower right abdomen that started yesterday. It hurts more when I cough or move suddenly. I also feel slightly nauseous."
              disabled={isAnalyzing}
            />
             {errors.symptoms && <p className="text-xs text-destructive">{errors.symptoms.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Duration</label>
              <input 
                {...register("duration")}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="e.g., 2"
                disabled={isAnalyzing}
              />
               {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Unit</label>
              <select 
                {...register("durationUnit")}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                disabled={isAnalyzing}
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-2 py-1 bg-white/5 rounded border border-white/10 font-mono text-[10px]">Ctrl + Enter</kbd>
              to submit
            </div>
            
            <Button 
              type="submit" 
              size="lg" 
              disabled={isAnalyzing}
              className="w-full sm:w-auto relative overflow-hidden group"
            >
              {isAnalyzing ? (
                <>
                  <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                  <Activity className="w-5 h-5 mr-2 animate-spin-slow" />
                  Processing Triage Pipeline...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5 mr-2" />
                  Begin AI Triage
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>

        </form>
      </div>

      {/* AI Processing Animation Overlay */}
      {isAnalyzing && (
        <div className="mt-8 p-6 glass-card rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex items-center gap-2 mb-4">
             {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={cn(
                    "agent-pipeline-dot",
                    i === 0 ? "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" :
                    i === 1 ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse delay-100" :
                    i === 2 ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse delay-200" :
                    i === 3 ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse delay-300" :
                    "bg-white/20"
                  )} />
                  {i < 4 && <div className="agent-pipeline-line bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />  
                  </div>}
                </div>
             ))}
          </div>
          <p className="text-sm text-primary font-mono animate-pulse">Running multi-agent consensus...</p>
        </div>
      )}
    </div>
  );
}
