import { ShieldAlert, Check } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { Button } from "@/components/ui/Button";

export function DisclaimerModal() {
  const { acceptedDisclaimer, setAcceptedDisclaimer } = useAppStore();

  if (acceptedDisclaimer) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="bg-amber-500/10 p-6 border-b border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-display text-white mb-2">Important Medical Disclaimer</h2>
          <p className="text-amber-500 font-medium text-sm">Please read carefully before proceeding</p>
        </div>
        
        <div className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-white">MediAgent AI is an experimental healthcare operations system.</strong> It is designed to demonstrate AI orchestration in a clinical workflow context.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>This system provides <strong>informational guidance only</strong>.</span>
            </li>
            <li className="flex gap-2">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment.</span>
            </li>
            <li className="flex gap-2">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
          <Button 
            onClick={() => setAcceptedDisclaimer(true)}
            className="w-full sm:w-auto"
            size="lg"
          >
            <Check className="w-5 h-5 mr-2" />
            I Understand and Agree
          </Button>
        </div>
      </div>
    </div>
  );
}
