import React, { useState } from 'react';
import { Play, User, FileText, Calendar, Phone, Pill } from 'lucide-react';
import type { DischargeInput } from '../../types/discharge.types';

interface JsonInputProps {
  onSubmit: (input: DischargeInput) => void;
  isLoading: boolean;
}

interface FormData {
  patientName: string;
  diagnosis: string;
  preferredLanguage: string;
  phone: string;
  medications: string;
  instructions: string;
}

export const JsonInput: React.FC<JsonInputProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    patientName: 'Maria Jones',
    diagnosis: 'Pneumonia',
    preferredLanguage: 'sp',
    phone: '+1-555-123-4567',
    medications: 'Azithromycin 500mg, Paracetamol 650mg',
    instructions: 'Take rest. Drink fluids. Complete full course of antibiotics.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dischargeInput: DischargeInput = {
      id: generateId(),
      role: 'user',
      content: {
        metadata: {
          patient_id: generateId(),
          patient_name: formData.patientName,
          diagnosis: formData.diagnosis,
          medications: formData.medications.split(',').map(med => med.trim()).filter(med => med),
          instructions: formData.instructions,
          follow_ups: {
            doctor_visit: 'Dr. Roy in 7 days',
            lab_tests: ['Chest X-ray', 'CBC'],
          },
          preferred_language: formData.preferredLanguage,
          phone: formData.phone,
        }
      }
    };

    onSubmit(dischargeInput);
  };

  return (
    <div className="input-section">
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={24} />
        Patient Discharge Information
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Patient Basic Info - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              Patient Name
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                border: '2px solid #d1d5db', 
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white'
              }}
              placeholder="Maria Jones"
              required
            />
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} />
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                border: '2px solid #d1d5db', 
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white'
              }}
              placeholder="Pneumonia"
              required
            />
          </div>
        </div>

        {/* Language and Phone - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6"/>
                <path d="m4 14 6-6 2-3"/>
                <path d="M2 5h12"/>
                <path d="M7 2h1"/>
                <path d="m22 22-5-10-5 10"/>
                <path d="M14 18h6"/>
              </svg>
              Preferred Language
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                border: '2px solid #d1d5db', 
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="sp">Spanish</option>
              <option value="fr">French</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                border: '2px solid #d1d5db', 
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white'
              }}
              placeholder="+1-555-123-4567"
              required
            />
          </div>
        </div>

        {/* Medications - Full width */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Pill size={16} />
            Medications
          </label>
          <input
            type="text"
            name="medications"
            value={formData.medications}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px', 
              border: '2px solid #d1d5db', 
              borderRadius: '6px',
              outline: 'none',
              backgroundColor: 'white'
            }}
            placeholder="Azithromycin 500mg, Paracetamol 650mg"
            required
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Separate multiple medications with commas</p>
        </div>

        {/* Instructions - Full width */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} />
            Doctor Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px', 
              border: '2px solid #d1d5db', 
              borderRadius: '6px',
              outline: 'none',
              minHeight: '100px',
              resize: 'vertical',
              backgroundColor: 'white'
            }}
            placeholder="Take rest. Drink fluids. Complete full course of antibiotics."
            required
          />
        </div>

        <div style={{ textAlign: 'center', paddingTop: '16px' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: isLoading ? '#9ca3af' : '#071936',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Processing Discharge...
              </>
            ) : (
              <>
                <Play size={16} />
                Start Discharge Process
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
