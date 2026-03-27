import { useAppStore } from "@/store/use-app-store";
import { UserRoundSearch, Star, MapPin, IndianRupee, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Mock Database
const MOCK_DOCTORS = [
  { id: 'd1', name: "Dr. Ananya Krishnan", specialty: "Cardiologist", experience: "14 years", rating: 4.9, available: "Today 4:00 PM", hospital: "Apollo Hospitals, Hyderabad", fee: "₹800" },
  { id: 'd2', name: "Dr. Rajan Mehta", specialty: "Neurologist", experience: "11 years", rating: 4.7, available: "Tomorrow 10:00 AM", hospital: "KIMS Hospital, Hyderabad", fee: "₹700" },
  { id: 'd3', name: "Dr. Priya Sharma", specialty: "General Physician", experience: "8 years", rating: 4.8, available: "Today 6:00 PM", hospital: "Yashoda Hospitals, Hyderabad", fee: "₹500" },
  { id: 'd4', name: "Dr. Vikram Nair", specialty: "Pulmonologist", experience: "16 years", rating: 4.9, available: "Today 5:30 PM", hospital: "Care Hospitals, Hyderabad", fee: "₹900" },
  { id: 'd5', name: "Dr. Meera Iyer", specialty: "Gastroenterologist", experience: "12 years", rating: 4.6, available: "Tomorrow 2:00 PM", hospital: "Continental Hospitals, Hyderabad", fee: "₹750" }
];

export function SpecialistTab() {
  const { triageData, setActiveTab, markTabComplete, addLog } = useAppStore();

  if (!triageData) return null;

  const { specialistRecommendation, emergencyAnalysis } = triageData;
  const isEmergency = emergencyAnalysis.is_emergency;

  // Simple string matching to filter doctors based on recommended specialty
  // In a real app this would be a backend search query
  const targetSpecialty = specialistRecommendation.primary_specialist.toLowerCase();
  
  // Sort: Put exact specialty matches first, then others, limit to 3
  const matchedDoctors = [...MOCK_DOCTORS].sort((a, b) => {
    const aMatch = a.specialty.toLowerCase().includes(targetSpecialty);
    const bMatch = b.specialty.toLowerCase().includes(targetSpecialty);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return b.rating - a.rating;
  }).slice(0, 3);

  const handleBook = (doctorName: string) => {
    addLog('SCHEDULING_AGENT', 'Started booking flow', `Selected ${doctorName} for appointment.`);
    markTabComplete('specialist');
    setActiveTab('scheduling');
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-10">
      
      {isEmergency ? (
         <div className="glass-card bg-destructive/10 border-destructive/30 rounded-2xl p-8 text-center space-y-4">
           <AlertTriangle className="w-16 h-16 text-destructive mx-auto animate-pulse" />
           <h2 className="text-2xl font-display text-destructive">Emergency Room Required</h2>
           <p className="text-white/80 max-w-lg mx-auto">
             Based on the triage assessment, you should not wait for a scheduled appointment. Please proceed to the nearest emergency room immediately.
           </p>
           <div className="pt-4">
              <Button size="lg" variant="destructive" onClick={() => window.open('https://maps.google.com/?q=emergency+room+near+me', '_blank')}>
                Find Nearest ER
              </Button>
           </div>
         </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="glass-card rounded-2xl p-6 flex-1 border-l-4 border-l-primary">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Primary Recommendation</h3>
              <h2 className="text-2xl font-display text-white mb-2">{specialistRecommendation.primary_specialist}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {specialistRecommendation.specialty_reason}
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Consultation Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-sm text-white/80">Urgency</span>
                  <Badge variant="warning">{specialistRecommendation.consultation_urgency}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Alternative</span>
                  <span className="text-sm text-white font-medium">{specialistRecommendation.secondary_specialist}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <UserRoundSearch className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-display text-white">Available Specialists</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matchedDoctors.map(doc => (
                <div key={doc.id} className="glass-card rounded-2xl p-5 flex flex-col h-full relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  
                  <div className="relative z-10 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant={doc.specialty.toLowerCase().includes(targetSpecialty) ? "default" : "secondary"}>
                        {doc.specialty}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold">{doc.rating}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-1">{doc.name}</h4>
                    <p className="text-xs text-primary mb-4">{doc.experience} experience</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="leading-tight">{doc.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Next available: <strong className="text-white/80">{doc.available}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                        <span>Consultation: <strong className="text-white/80">{doc.fee}</strong></span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full relative z-10" 
                    onClick={() => handleBook(doc.name)}
                  >
                    Book Appointment
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Pre-visit prep */}
      {!isEmergency && (
        <div className="glass-card rounded-2xl p-6 mt-8">
          <h3 className="text-sm font-bold text-white mb-4">Preparation for your visit</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specialistRecommendation.prepare_for_visit.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
