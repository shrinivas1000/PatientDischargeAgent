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
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        color: '#2d1810',
        background: 'none',
        backgroundClip: 'unset',
        WebkitBackgroundClip: 'unset',
        WebkitTextFillColor: 'unset',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
      }}>
        <FileText size={24} style={{ color: '#2d1810' }} />
        Patient Discharge Information
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Patient Basic Info - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#92400e', 
              marginBottom: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              letterSpacing: '0.5px'
            }}>
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
                border: '1px solid rgba(180, 83, 9, 0.2)', 
                borderRadius: '12px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.4)',
                color: '#4a3728',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.15), 0 4px 16px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(180, 83, 9, 0.2)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                e.target.style.transform = 'translateY(0)';
              }}
              placeholder="Maria Jones"
              required
            />
          </div>
          
          <div>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#92400e', 
              marginBottom: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              letterSpacing: '0.5px'
            }}>
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
                border: '1px solid rgba(180, 83, 9, 0.2)', 
                borderRadius: '12px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.4)',
                color: '#4a3728',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.15), 0 4px 16px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(180, 83, 9, 0.2)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                e.target.style.transform = 'translateY(0)';
              }}
              placeholder="Pneumonia"
              required
            />
          </div>
        </div>

        {/* Language and Phone - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#92400e', 
              marginBottom: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              letterSpacing: '0.5px'
            }}>
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
                border: '1px solid rgba(180, 83, 9, 0.2)', 
                borderRadius: '12px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.4)',
                color: '#4a3728',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.15), 0 4px 16px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(180, 83, 9, 0.2)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <option value="sp">Spanish</option>
              <option value="fr">French</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          
          <div>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#92400e', 
              marginBottom: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              letterSpacing: '0.5px'
            }}>
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
                border: '1px solid rgba(180, 83, 9, 0.2)', 
                borderRadius: '12px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.4)',
                color: '#4a3728',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.15), 0 4px 16px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(180, 83, 9, 0.2)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                e.target.style.transform = 'translateY(0)';
              }}
              placeholder="+1-555-123-4567"
              required
            />
          </div>
        </div>

        {/* Medications - Full width */}
        <div>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#92400e', 
            marginBottom: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            letterSpacing: '0.5px'
          }}>
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
              border: '1px solid rgba(180, 83, 9, 0.2)', 
              borderRadius: '12px',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.4)',
              color: '#4a3728',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.15), 0 4px 16px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)';
              e.target.style.background = 'rgba(255, 255, 255, 0.6)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(180, 83, 9, 0.2)';
              e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
              e.target.style.background = 'rgba(255, 255, 255, 0.4)';
              e.target.style.transform = 'translateY(0)';
            }}
            placeholder="Azithromycin 500mg, Paracetamol 650mg"
            required
          />
          <p style={{ fontSize: '12px', color: 'rgba(116, 87, 64, 0.7)', marginTop: '5px' }}>Separate multiple medications with commas</p>
        </div>

        {/* Instructions - Full width */}
        <div>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#92400e', 
            marginBottom: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            letterSpacing: '0.5px'
          }}>
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
              border: '1px solid rgba(180, 83, 9, 0.2)', 
              borderRadius: '12px',
              outline: 'none',
              minHeight: '90px',
              resize: 'vertical',
              background: 'rgba(255, 255, 255, 0.4)',
              color: '#4a3728',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.15), 0 4px 16px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.02)';
              e.target.style.background = 'rgba(255, 255, 255, 0.6)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(180, 83, 9, 0.2)';
              e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.02)';
              e.target.style.background = 'rgba(255, 255, 255, 0.4)';
              e.target.style.transform = 'translateY(0)';
            }}
            placeholder="Take rest. Drink fluids. Complete full course of antibiotics."
            required
          />
        </div>

        <div style={{ textAlign: 'center', paddingTop: '16px' }}>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              background: isLoading ? 'rgba(45, 24, 16, 0.3)' : '#2d1810',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backdropFilter: 'blur(8px)',
              boxShadow: isLoading ? 'none' : '0 4px 16px rgba(45, 24, 16, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(45, 24, 16, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.background = '#3d2420';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(45, 24, 16, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = '#2d1810';
              }
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
          >
            {isLoading ? (
              <>
                <div className="animate-spin" style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid white', 
                  borderTop: '2px solid transparent', 
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.4))'
                }}></div>
                Processing Discharge...
              </>
            ) : (
              <>
                <Play size={20} />
                Start Discharge Process
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
