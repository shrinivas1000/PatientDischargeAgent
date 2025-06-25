import React, { useState } from 'react';
import { JsonInput } from './components/JsonInput/JsonInput';
import { AgentProgress } from './components/AgentProgress/AgentProgress';
import { OutputViewer } from './components/OutputViewer/OutputViewer';
import { PdfGenerator } from './components/PdfGenerator/PdfGenerator';
import { langflowService } from './services/langflowService';
import type { DischargeInput, AgentStep, FlowState } from './types/discharge.types';
import { AGENT_STEPS } from './types/discharge.types';
import { QuizConversation } from './components/QuizConversation/QuizConversation';
import './globals.css';

function App() {
  const [flowState, setFlowState] = useState<FlowState>({
    isRunning: false,
    currentStep: 0,
    steps: [...AGENT_STEPS],
    finalOutput: null
  });

  const handleStepUpdate = (stepIndex: number, status: string, output?: any) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: stepIndex,
      steps: prev.steps.map((step, index) => 
        index === stepIndex 
          ? { ...step, status: status as AgentStep['status'], output }
          : step
      )
    }));
  };

  const handleStartFlow = async (input: DischargeInput) => {
    try {
      // Reset state
      setFlowState({
        isRunning: true,
        currentStep: 0,
        steps: AGENT_STEPS.map(step => ({ ...step, status: 'pending' })),
        finalOutput: null
      });

      // Start the flow with step simulation
      const result = await langflowService.simulateStepProgress(
        input,
        handleStepUpdate
      );

      // Flow completed
      setFlowState(prev => ({
        ...prev,
        isRunning: false,
        finalOutput: result
      }));

    } catch (error) {
      console.error('Flow failed:', error);
      
      // Mark current step as error
      setFlowState(prev => ({
        ...prev,
        isRunning: false,
        steps: prev.steps.map((step, index) => 
          index === prev.currentStep 
            ? { ...step, status: 'error', error: 'Failed to execute' }
            : step
        )
      }));
    }
  };

  const handleReset = () => {
    langflowService.resetSession();
    setFlowState({
      isRunning: false,
      currentStep: 0,
      steps: [...AGENT_STEPS],
      finalOutput: null
    });
  };

  // Get PatientMessengerAgent output for quiz conversation
  const patientMessengerStep = flowState.steps.find(step => step.name === 'PatientMessengerAgent');
  const interactionLog = patientMessengerStep?.output?.interaction_log || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="header">
        <div className="container">
          <h1>Patient Discharge Agent</h1>
        </div>
      </div>

      <div className="container">
        <JsonInput 
          onSubmit={handleStartFlow}
          isLoading={flowState.isRunning}
        />

        <AgentProgress 
          steps={flowState.steps}
          isVisible={flowState.isRunning || flowState.steps.some(s => s.status !== 'pending')}
        />

        <OutputViewer 
          steps={flowState.steps}
          isVisible={flowState.steps.some(s => s.status === 'completed')}
        />

        {/* Quiz Conversation History */}
        {interactionLog.length > 0 && (
          <QuizConversation interactionLog={interactionLog} />
        )}

        {/* PDF Generator and Reset Flow - Same Line with Space Between */}
        {!flowState.isRunning && flowState.steps.some(s => s.status !== 'pending') && (
          <div className="w-full flex items-center justify-between mb-6 px-4">
            {(() => {
              const dischargePackagerStep = flowState.steps.find(step => step.name === 'DischargePackagerAgent');
              const summaryBuilderStep = flowState.steps.find(step => step.name === 'SummaryBuilderAgent');
              const dischargeOutput = dischargePackagerStep?.output;
              const summaryOutput = summaryBuilderStep?.output;
              
              // Extract patient name dynamically from summary
              let patientName = 'Patient';
              if (summaryOutput?.summary_english) {
                const match = summaryOutput.summary_english.match(/Patient ([A-Za-z\. ]+?) has been/);
                if (match) {
                  patientName = match[1].trim();
                }
              }
              
              return (dischargeOutput || summaryOutput) ? (
                <PdfGenerator 
                  dischargeOutput={dischargeOutput}
                  summaryOutput={summaryOutput}
                  patientName={patientName}
                />
              ) : <div></div>;
            })()}

            <button 
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset Flow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
