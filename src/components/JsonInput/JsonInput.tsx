import React, { useState } from 'react';
import type { DischargeInput } from '../../types/discharge.types';
import { DEFAULT_INPUT } from '../../types/discharge.types';

interface JsonInputProps {
  onSubmit: (input: DischargeInput) => void;
  isLoading: boolean;
}

export const JsonInput: React.FC<JsonInputProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState<string>(
    JSON.stringify(DEFAULT_INPUT, null, 2)
  );
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const validateJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Basic validation for required structure
      if (!parsed.id || !parsed.role || !parsed.content?.metadata) {
        setError('Invalid JSON structure. Missing required fields.');
        return false;
      }
      
      const metadata = parsed.content.metadata;
      if (!metadata.patient_name || !metadata.diagnosis) {
        setError('Missing required patient information.');
        return false;
      }
      
      setError('');
      return true;
    } catch (e) {
      setError('Invalid JSON syntax.');
      return false;
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const valid = validateJson(value);
    setIsValid(valid);
  };

  const handleSubmit = () => {
    if (isValid && !isLoading) {
      try {
        const parsedInput = JSON.parse(inputValue) as DischargeInput;
        onSubmit(parsedInput);
      } catch (e) {
        setError('Failed to parse JSON input.');
        setIsValid(false);
      }
    }
  };

  const handleReset = () => {
    setInputValue(JSON.stringify(DEFAULT_INPUT, null, 2));
    setIsValid(true);
    setError('');
  };

  return (
    <div className="input-section">
      <div className="mb-4">
        <label htmlFor="json-input" className="block text-sm font-medium mb-2">
          Patient Discharge Input (JSON)
        </label>
        <textarea
          id="json-input"
          className={`input-textarea ${!isValid ? 'border-red-500' : ''}`}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter patient discharge JSON..."
          disabled={isLoading}
        />
        {!isValid && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <>
              Processing...
            </>
          ) : (
            'Start Flow'
          )}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};
