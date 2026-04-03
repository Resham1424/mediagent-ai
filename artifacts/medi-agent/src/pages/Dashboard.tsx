import { useAppStore } from "@/store/use-app-store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuditLogPanel } from "@/components/layout/AuditLogPanel";
import { DisclaimerModal } from "@/components/modals/DisclaimerModal";

import { TriageTab } from "@/features/triage/TriageTab";
import { AssessmentTab } from "@/features/assessment/AssessmentTab";
import { SpecialistTab } from "@/features/specialist/SpecialistTab";
import { SchedulingTab } from "@/features/scheduling/SchedulingTab";
import { FollowUpTab } from "@/features/followup/FollowUpTab";

export function Dashboard() {
  const { activeTab } = useAppStore();

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      <DisclaimerModal />
      <Header />
      
      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto relative scroll-smooth p-6 md:p-10">
          {/* Subtle background glow effect behind main content */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          {activeTab === 'triage' && <TriageTab />}
          {activeTab === 'assessment' && <AssessmentTab />}
          {activeTab === 'specialist' && <SpecialistTab />}
          {activeTab === 'scheduling' && <SchedulingTab />}
          {activeTab === 'followup' && <FollowUpTab />}
        </div>

        <AuditLogPanel />
      </main>
    </div>
  );
}
