/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Clock, Loader2, Check, X } from 'lucide-react';
import type { AgentStep } from '../../types/discharge.types';

interface AgentProgressProps {
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

export const AgentProgress: React.FC<AgentProgressProps> = ({ steps, isVisible }) => {
  if (!isVisible) return null;

  const getStepIcon = (status: AgentStep['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-gray-400" />;
      case 'running':
        return <Loader2 size={16} className="text-blue-600 animate-spin" />;
      case 'completed':
        return <Check size={16} className="text-green-600" />;
      case 'error':
        return <X size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStepClass = (status: AgentStep['status']) => {
    return `progress-step ${status}`;
  };

  return (
    <div className="progress-section">
      <h2 className="text-lg font-semibold mb-4">Agent Pipeline Progress</h2>
      
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.id} className={getStepClass(step.status)}>
            <span className="step-icon">
              {getStepIcon(step.status)}
            </span>
            <span className="flex-1">
              {formatAgentName(step.name)}
            </span>
            {step.status === 'running' && (
              <span className="text-sm text-blue-600"></span>
            )}
            {step.status === 'error' && step.error && (
              <span className="text-sm text-red-600">{step.error}</span>
            )}
          </div>
        ))}
      </div>
      
      {steps.some(step => step.status === 'running') && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {steps.filter(s => s.status === 'completed').length} of {steps.length} agents completed
          </p>
        </div>
      )}
    </div>
  );
};
