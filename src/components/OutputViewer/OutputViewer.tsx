import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp} from 'lucide-react';
import type { AgentStep } from '../../types/discharge.types';
import { QuizConversation } from '../QuizConversation/QuizConversation';

interface OutputViewerProps {
  steps: AgentStep[];
  isVisible: boolean;
}

// Helper function to format agent names
const formatAgentName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/Agent$/, ' Agent') // Replace "Agent" suffix with " Agent"
    .trim(); // Remove any leading/trailing spaces
};

// Helper function to format agent output as clean text
const formatAgentOutput = (stepName: string, output: any): string => {
  if (!output || typeof output !== 'object') {
    return 'No output available';
  }

  switch (stepName) {
    case 'SummaryBuilderAgent':
      return output.summary_english || 'No summary available';
    
    case 'ComprehensionQuizAgent':
      if (output.quiz_english && Array.isArray(output.quiz_english)) {
        const questions = output.quiz_english.map((q: any, index: number) => 
          `Q${index + 1}: ${q.question}`
        ).join('\n\n');
        return `Comprehension Quiz:\n\n${questions}`;
      }
      return 'No quiz available';
    
    case 'FollowUpPlannerAgent':
      if (output.follow_up_schedule && Array.isArray(output.follow_up_schedule)) {
        const schedule = output.follow_up_schedule.map((item: string) => 
          `• ${item}`
        ).join('\n');
        return `Follow-up Schedule:\n\n${schedule}`;
      }
      return 'No follow-up schedule available';
    
    case 'MultilingualAgent':
      let multilingual = '';
      if (output.summary_translated) {
        multilingual += `Translated Summary:\n${output.summary_translated}\n\n`;
      }
      if (output.quiz_translated && Array.isArray(output.quiz_translated)) {
        const translatedQuestions = output.quiz_translated.map((q: any, index: number) => 
          `Pregunta ${index + 1}: ${q.question}`
        ).join('\n\n');
        multilingual += `Translated Quiz:\n\n${translatedQuestions}`;
      }
      return multilingual || 'No translations available';
    
    case 'DischargePackagerAgent':
      if (output.output) {
        let discharge = 'Discharge Package Created:\n\n';
        if (output.output.pdf_summary_path) {
          discharge += `PDF Summary: ${output.output.pdf_summary_path}\n\n`;
        }
        if (output.output.ehr_json) {
          const ehr = output.output.ehr_json;
          
          discharge += `EHR Summary:\n`;
          discharge += `   Patient ID: ${ehr.patient_id || 'N/A'}\n`;
          discharge += `   Patient Name: Maria Jones\n`;
          discharge += `   Diagnosis: ${ehr.diagnosis || 'N/A'}\n`;
          discharge += `   Medications: ${ehr.medications ? (Array.isArray(ehr.medications) ? ehr.medications.join(', ') : ehr.medications) : 'None'}\n`;
          discharge += `   Quiz Score: ${ehr.quiz_score || 'N/A'}\n`;
          discharge += `   Patient Understanding: ${ehr.patient_understood ? 'Yes' : 'No'}`;
        }
        return discharge;
      }
      return 'Discharge package created successfully';
    
    default:
      return JSON.stringify(output, null, 2);
  }
};

// Helper function to download EHR data


export const OutputViewer: React.FC<OutputViewerProps> = ({ steps, isVisible }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  if (!isVisible) return null;

  const toggleExpanded = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const completedSteps = steps.filter(step => step.status === 'completed' && step.output);

  if (completedSteps.length === 0) {
    return (
      <div className="output-section">
        <h2 className="text-lg font-semibold mb-4">Agent Outputs</h2>
        <p className="text-gray-500 text-center py-8">
          No outputs available yet. Start the flow to see agent results.
        </p>
      </div>
    );
  }

  // Find discharge packager step for EHR download

  return (
    <div className="output-section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Agent Outputs</h2>
      </div>
      
      <div className="space-y-4">
        {completedSteps.map((step) => (
          <div key={step.id} className="output-item">
            <div className="output-header">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                <h3 className="font-medium">{formatAgentName(step.name)}</h3>
              </div>
              <button
                className="btn btn-secondary flex items-center gap-2"
                onClick={() => toggleExpanded(step.id)}
              >
                {expandedSteps.has(step.id) ? (
                  <>
                    <ChevronUp size={16} />
                    Hide Output
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    {step.name === 'PatientMessengerAgent' ? 'Show Conversation' : 'Show Output'}
                  </>
                )}
              </button>
            </div>
            
            {expandedSteps.has(step.id) && (
              <div className="output-content">
                {step.name === 'PatientMessengerAgent' ? (
                  <QuizConversation 
                    interactionLog={step.output?.interaction_log || []}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {formatAgentOutput(step.name, step.output)}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {completedSteps.length > 0 && (
        <div className="mt-4 text-center">
          <button
            className="btn btn-secondary flex items-center gap-2 mx-auto"
            onClick={() => {
              const allExpanded = completedSteps.every(step => expandedSteps.has(step.id));
              if (allExpanded) {
                setExpandedSteps(new Set());
              } else {
                setExpandedSteps(new Set(completedSteps.map(step => step.id)));
              }
            }}
          >
            {completedSteps.every(step => expandedSteps.has(step.id)) ? (
              <>
                <ChevronUp size={16} />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Expand All
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
