import axios from 'axios';
import type { DischargeInput } from '../types/discharge.types';

const BASE_URL = '';
const FLOW_ID = '66536226-403a-47fd-b1cb-2c7b6cba2ebb';

export class LangflowService {
  private sessionId: string;

  constructor() {
    this.sessionId = `discharge_${Date.now()}`;
  }

  async runDischargeFlow(input: DischargeInput): Promise<any> {
    try {
      const payload = {
        input_value: JSON.stringify(input),
        output_type: "chat",
        input_type: "chat",
        session_id: this.sessionId
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/run/${FLOW_ID}`,
        payload,
        options
      );

      return response.data;
    } catch (error) {
      console.error('Error running discharge flow:', error);
      throw error;
    }
  }

  // FIXED: Robust output extraction
  private extractAgentOutputs(langflowResponse: any): any[] {
    console.log('Full Langflow Response:', JSON.stringify(langflowResponse, null, 2));
    
    // Try different possible structures
    let outputs = [];
    if (langflowResponse.outputs && langflowResponse.outputs[0] && langflowResponse.outputs[0].outputs) {
      outputs = langflowResponse.outputs[0].outputs;
    } else if (langflowResponse.outputs) {
      outputs = langflowResponse.outputs;
    } else {
      console.log('No outputs found in response structure');
      return [];
    }

    console.log('Found outputs:', outputs.length);

    const steps = [
      'SummaryBuilderAgent',
      'ComprehensionQuizAgent', 
      'FollowUpPlannerAgent',
      'MultilingualAgent',
      'PatientMessengerAgent',
      'DischargePackagerAgent'
    ];

    // FIXED: Parse outputs using the correct method from search results
    const parsedOutputs: any[] = [];
    outputs.forEach((output: any, index: number) => {
      const text = output.results?.message?.text || output.outputs?.message?.message || '';
      console.log(`Raw text ${index}:`, text);
      
      try {
        // CORRECT way to remove markdown code blocks
        const lines = text.split('\n');
        let cleanLines = [...lines];
        
        // Remove first line if it starts with ```
        if (cleanLines[0] && cleanLines[0].trim().startsWith('```')) {
        cleanLines = cleanLines.slice(1);
        }
        
        // Remove last line if it's just ```
        if (cleanLines[cleanLines.length - 1] && cleanLines[cleanLines.length - 1].trim() === '```') {
          cleanLines = cleanLines.slice(0, -1);
        }
        
        const cleanText = cleanLines.join('\n').trim();
        console.log(`Clean text ${index}:`, cleanText);
        
        const parsedOutput = JSON.parse(cleanText);
        console.log(`Parsed output ${index}:`, parsedOutput);
        parsedOutputs.push(parsedOutput);
      } catch (e) {
        console.log(`Failed to parse output ${index}:`, e);
        parsedOutputs.push({ raw_text: text });
      }
    });

    // Simple direct matching - no fancy scoring for now
    const matchedOutputs: any[] = new Array(steps.length).fill(null);
    
    parsedOutputs.forEach((output, index) => {
      const keys = Object.keys(output);
      console.log(`Output ${index} keys:`, keys);
      
      // Direct matching
      if (keys.includes('summary_english')) {
        matchedOutputs[0] = output; // SummaryBuilderAgent
      } else if (keys.includes('quiz_english')) {
        matchedOutputs[1] = output; // ComprehensionQuizAgent
      } else if (keys.includes('follow_up_schedule')) {
        matchedOutputs[2] = output; // FollowUpPlannerAgent
      } else if (keys.includes('summary_translated') && keys.includes('quiz_translated')) {
        matchedOutputs[3] = output; // MultilingualAgent
      } else if (keys.includes('interaction_log')) {
        matchedOutputs[4] = output; // PatientMessengerAgent
      } else if (keys.includes('output') && output.output && (output.output.pdf_summary_path || output.output.ehr_json)) {
        matchedOutputs[5] = output; // DischargePackagerAgent
      }
    });

    console.log('Final matched outputs:', matchedOutputs);
    
    return matchedOutputs.map((output, index) => 
      output || { message: `No output found for ${steps[index]}` }
    );
  }

  async simulateStepProgress(
    input: DischargeInput,
    onStepUpdate: (stepIndex: number, status: string, output?: any) => void
  ): Promise<any> {
    const steps = [
      'SummaryBuilderAgent',
      'ComprehensionQuizAgent', 
      'FollowUpPlannerAgent',
      'MultilingualAgent',
      'PatientMessengerAgent',
      'DischargePackagerAgent'
    ];

    try {
      onStepUpdate(0, 'running');
      const finalResult = await this.runDischargeFlow(input);
      
      const agentOutputs = this.extractAgentOutputs(finalResult);

      for (let i = 0; i < steps.length; i++) {
        onStepUpdate(i, 'running');
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        onStepUpdate(i, 'completed', agentOutputs[i]);
      }

      return finalResult;
    } catch (error) {
      console.error('Flow execution failed:', error);
      throw error;
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  resetSession(): void {
    this.sessionId = `discharge_${Date.now()}`;
  }
}

export const langflowService = new LangflowService();
