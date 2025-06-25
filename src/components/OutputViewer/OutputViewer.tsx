import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { AgentStep } from '../../types/discharge.types';

interface OutputViewerProps {
  steps: AgentStep[];
  isVisible: boolean;
}

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

  return (
    <div className="output-section">
      <h2 className="text-lg font-semibold mb-4">Agent Outputs</h2>
      
      <div className="space-y-4">
        {completedSteps.map((step) => (
          <div key={step.id} className="output-item">
            <div className="output-header">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                <h3 className="font-medium">{step.name}</h3>
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
                    Show JSON Output
                  </>
                )}
              </button>
            </div>
            
            {expandedSteps.has(step.id) && (
              <div className="output-content">
                <pre>{JSON.stringify(step.output, null, 2)}</pre>
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
