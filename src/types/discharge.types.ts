export interface DischargeInput {
  id: string;
  role: string;
  content: {
    metadata: {
      patient_id: string;
      patient_name: string;
      diagnosis: string;
      medications: string[];
      instructions: string;
      follow_ups: {
        doctor_visit: string;
        lab_tests: string[];
      };
      preferred_language: string;
      phone: string;
    };
  };
}

export interface AgentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: any;
  error?: string;
}

export interface FlowState {
  isRunning: boolean;
  currentStep: number;
  steps: AgentStep[];
  finalOutput?: any;
}

export const AGENT_STEPS: AgentStep[] = [
  { id: 'summary', name: 'SummaryBuilderAgent', status: 'pending' },
  { id: 'quiz', name: 'ComprehensionQuizAgent', status: 'pending' },
  { id: 'followup', name: 'FollowUpPlannerAgent', status: 'pending' },
  { id: 'translate', name: 'MultilingualAgent', status: 'pending' },
  { id: 'messenger', name: 'PatientMessengerAgent', status: 'pending' },
  { id: 'packager', name: 'DischargePackagerAgent', status: 'pending' }
];

export const DEFAULT_INPUT: DischargeInput = {
  id: "msg-001",
  role: "user",
  content: {
    metadata: {
      patient_id: "RM12345",
      patient_name: "Rita Mehra",
      diagnosis: "Pneumonia",
      medications: [
        "Azithromycin 500mg",
        "Paracetamol 650mg"
      ],
      instructions: "Take rest. Drink fluids. Complete full course of antibiotics.",
      follow_ups: {
        doctor_visit: "Dr. Roy in 7 days",
        lab_tests: [
          "Chest X-Ray (repeat)",
          "CBC"
        ]
      },
      preferred_language: "Hindi",
      phone: "+91-9876543210"
    }
  }
};
