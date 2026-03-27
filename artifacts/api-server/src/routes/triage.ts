import { Router, type IRouter } from "express";
import {
  AnalyzeSymptomsBody,
  ProcessFollowUpBody,
} from "@workspace/api-zod";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router: IRouter = Router();

async function callAgent<T>(
  systemPrompt: string,
  userContent: string
): Promise<T> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const block = message.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const text = block.text.trim();
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  return JSON.parse(jsonStr) as T;
}

const SYMPTOM_AGENT_PROMPT = `You are a clinical symptom analysis AI. Your role is to carefully analyze patient-reported symptoms and extract structured medical information. You NEVER diagnose — you identify symptom patterns and classify severity. Always include a compliance disclaimer. Respond in JSON only.

Output this exact JSON structure:
{
  "symptoms_identified": ["list", "of", "symptoms"],
  "body_systems_affected": ["list"],
  "duration_context": "string",
  "severity_indicators": ["list of red flags if any"],
  "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "risk_reasoning": "one sentence explanation",
  "emergency_flag": true,
  "emergency_reason": "string or null",
  "possible_condition_categories": ["advisory list, not diagnosis"],
  "advisory_note": "Always consult a licensed physician. This is not a diagnosis."
}`;

const EMERGENCY_AGENT_PROMPT = `You are an emergency triage AI. Given symptom analysis data, determine if this requires immediate emergency care. Be conservative — when in doubt, flag as emergency. Respond in JSON only.

Output:
{
  "is_emergency": true,
  "emergency_level": "LIFE_THREATENING|URGENT|STANDARD",
  "immediate_actions": ["list of immediate steps"],
  "do_not_delay_message": "string if emergency",
  "can_proceed_to_scheduling": true
}`;

const SPECIALIST_AGENT_PROMPT = `You are a medical specialist routing AI. Based on symptom analysis, recommend the correct type of medical specialist. Do not recommend specific real doctors. Respond in JSON only.

Output:
{
  "primary_specialist": "e.g., Cardiologist",
  "specialty_reason": "why this specialist",
  "secondary_specialist": "backup option",
  "consultation_urgency": "Within 24hrs|Within 1 week|Routine",
  "what_to_expect": "brief description of consultation",
  "prepare_for_visit": ["list of things to bring/note"]
}`;

const SCHEDULING_AGENT_PROMPT = `You are a healthcare scheduling AI. Generate pre-visit preparation instructions and appointment details for a patient. Respond in JSON.

Output:
{
  "appointment_type_recommendation": "In-Person|Telehealth",
  "estimated_duration": "30 mins|45 mins|1 hour",
  "pre_visit_instructions": ["list of instructions"],
  "questions_to_ask_doctor": ["list of 5 relevant questions"],
  "what_to_bring": ["list"],
  "fasting_required": false,
  "fasting_instructions": "string or null"
}`;

const FOLLOWUP_AGENT_PROMPT = `You are a post-consultation follow-up AI. Given original symptoms and patient check-in, provide advisory follow-up guidance. Never prescribe. Respond in JSON.

Output:
{
  "recovery_assessment": "Improving|Stable|Needs Attention",
  "follow_up_recommendations": ["list"],
  "lifestyle_adjustments": ["advisory list"],
  "warning_signs_to_watch": ["list of symptoms that need immediate care"],
  "next_steps": "string",
  "escalation_needed": false,
  "motivational_note": "short encouraging message"
}`;

router.post("/triage/analyze", async (req, res) => {
  try {
    const body = AnalyzeSymptomsBody.parse(req.body);
    const { patientName, age, gender, symptoms, duration, durationUnit } = body;

    const patientContext = `Patient: ${patientName}, Age: ${age}, Gender: ${gender}
Symptoms: ${symptoms}
Duration: ${duration} ${durationUnit}`;

    const symptomAnalysis = await callAgent<Record<string, unknown>>(
      SYMPTOM_AGENT_PROMPT,
      `Analyze these patient-reported symptoms:\n${patientContext}`
    );

    const emergencyAnalysis = await callAgent<Record<string, unknown>>(
      EMERGENCY_AGENT_PROMPT,
      `Based on this symptom analysis, assess emergency status:\n${JSON.stringify(symptomAnalysis, null, 2)}\n\nOriginal patient report:\n${patientContext}`
    );

    const specialistRecommendation = await callAgent<Record<string, unknown>>(
      SPECIALIST_AGENT_PROMPT,
      `Based on this symptom and emergency analysis, recommend appropriate specialist:\n${JSON.stringify({ symptomAnalysis, emergencyAnalysis }, null, 2)}`
    );

    const schedulingInfo = await callAgent<Record<string, unknown>>(
      SCHEDULING_AGENT_PROMPT,
      `Generate scheduling and pre-visit information for a patient seeing a ${specialistRecommendation.primary_specialist}.\nOriginal symptoms: ${symptoms}\nRisk level: ${symptomAnalysis.risk_level}`
    );

    res.json({
      symptomAnalysis,
      emergencyAnalysis,
      specialistRecommendation,
      schedulingInfo,
    });
  } catch (err) {
    req.log.error({ err }, "Triage analysis failed");
    res.status(500).json({
      error: "Triage analysis failed",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

router.post("/triage/followup", async (req, res) => {
  try {
    const body = ProcessFollowUpBody.parse(req.body);
    const { originalSymptoms, patientCheckin, daysSinceVisit } = body;

    const followUpData = await callAgent<Record<string, unknown>>(
      FOLLOWUP_AGENT_PROMPT,
      `Original symptoms: ${originalSymptoms}\n\nDays since consultation: ${daysSinceVisit ?? "unknown"}\n\nPatient check-in: ${patientCheckin}`
    );

    res.json(followUpData);
  } catch (err) {
    req.log.error({ err }, "Follow-up processing failed");
    res.status(500).json({
      error: "Follow-up processing failed",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
