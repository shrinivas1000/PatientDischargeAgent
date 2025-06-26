import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface PdfGeneratorProps {
  dischargeOutput: any;
  summaryOutput: any;
  patientName?: string;
}

export const PdfGenerator: React.FC<PdfGeneratorProps> = ({ dischargeOutput, summaryOutput, patientName = 'Patient' }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Discharge Summary', 20, 20);
    
    // Patient name
    doc.setFontSize(12);
    doc.text(`Patient: ${patientName}`, 20, 35);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);

    // Add summary_english if available
    if (summaryOutput && summaryOutput.summary_english) {
      doc.setFontSize(14);
      doc.text('Summary:', 20, 60);
      doc.setFontSize(11);
      const summaryLines = doc.splitTextToSize(summaryOutput.summary_english, 170);
      doc.text(summaryLines, 20, 70);
    }

    // Add a gap after summary
    let yPosition = 70;
    if (summaryOutput && summaryOutput.summary_english) {
      yPosition += doc.splitTextToSize(summaryOutput.summary_english, 170).length * 10;
    }

    // Add JSON content of dischargeOutput
    if (dischargeOutput) {
      doc.setFontSize(14);
      doc.text('Discharge Packager Output JSON:', 20, yPosition + 10);
      doc.setFontSize(10);
      const jsonString = JSON.stringify(dischargeOutput, null, 2);
      const lines = doc.splitTextToSize(jsonString, 170);
      doc.text(lines, 20, yPosition + 20);
    }
    
    // Save PDF
    doc.save(`${patientName.replace(/\s+/g, '_')}_discharge_summary.pdf`);
  };

  if (!dischargeOutput && !summaryOutput) return null;

  return (
    <div className="text-center mt-4">
      <button
        className="btn btn-primary flex items-center gap-2 mx-auto"
        onClick={generatePDF}
      >
        <Download size={16} />
        Download EHR
      </button>
    </div>
  );
};
