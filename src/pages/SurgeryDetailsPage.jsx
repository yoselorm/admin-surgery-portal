import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  Activity,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';


const SurgeryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const records = useSelector((state) => state.surgeries.list);

  const surgeryRecord = records.find((item) => String(item.id) === String(id));


  // Render fields based on surgery type
  const renderSurgerySpecificDetails = () => {
    const { type, formData } = surgeryRecord;

    if (type === 'Laser Surgery') {
      return <LaserSurgeryDetails formData={formData} />;
    } else if (type === 'Cardiac Surgery') {
      return <CardiacSurgeryDetails formData={formData} />;
    } else if (type === 'Orthopedic Surgery') {
      return <OrthopedicSurgeryDetails formData={formData} />;
    } else {
      return <GenericSurgeryDetails formData={formData} />;
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = 20;

    // Helper function to add text with auto-wrap
    const addText = (text, x, y, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.5) + 5;
    };

    // Helper to check page break
    const checkPageBreak = (requiredSpace = 30) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Add section header
    const addSectionHeader = (title) => {
      checkPageBreak(20);
      doc.setFillColor(6, 182, 212);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin + 5, yPosition + 7);
      doc.setTextColor(0, 0, 0);
      yPosition += 15;
    };

    // Title Header
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('SURGERY RECORD', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(surgeryRecord.procedure, pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Record ID: ${surgeryRecord.id}`, pageWidth / 2, 33, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    // Basic Information
    addSectionHeader('PATIENT & SURGERY INFORMATION');
    yPosition = addText(`Patient Name: ${surgeryRecord.patientName}`, margin, yPosition, 10, true);
    yPosition = addText(`Age: ${surgeryRecord.patientAge} years  |  Gender: ${surgeryRecord.gender}`, margin, yPosition);
    yPosition = addText(`Surgery Type: ${surgeryRecord.type}`, margin, yPosition, 10, true);
    yPosition = addText(`Procedure: ${surgeryRecord.procedure}`, margin, yPosition);
    yPosition = addText(`Surgeon: ${surgeryRecord.doctor}`, margin, yPosition, 10, true);
    yPosition = addText(`Date: ${surgeryRecord.date}  |  Time: ${surgeryRecord.time}`, margin, yPosition);
    yPosition = addText(`Duration: ${surgeryRecord.duration}  |  Status: ${surgeryRecord.status}`, margin, yPosition);
    yPosition += 5;

    // Laser Settings (if Laser Surgery)
    if (surgeryRecord.type === 'Laser Surgery') {
      addSectionHeader('LASER SETTINGS');
      yPosition = addText(`Wavelength: ${surgeryRecord.formData.laserWavelength}`, margin, yPosition);
      yPosition = addText(`Power: ${surgeryRecord.formData.laserPower}`, margin, yPosition);
      yPosition = addText(`Pulse Mode: ${surgeryRecord.formData.laserPulseMode}`, margin, yPosition);
      yPosition = addText(`Total Applied Energy: ${surgeryRecord.formData.totalAppliedEnergy} J`, margin, yPosition, 10, true);
      yPosition = addText(`Pre-op Medication: ${surgeryRecord.formData.medication}`, margin, yPosition);
      yPosition += 5;

      // Diagnostics
      addSectionHeader('DIFFERENTIAL DIAGNOSTICS');
      Object.entries(surgeryRecord.formData.diagnostics).forEach(([key, value]) => {
        if (value.observed || value.treated) {
          const diagName = key.replace(/([A-Z])/g, ' $1').trim();
          const status = `${value.observed ? 'Observed' : 'Not Observed'} | ${value.treated ? 'Treated' : 'Not Treated'}`;
          yPosition = addText(`${diagName}: ${status}`, margin, yPosition);
        }
      });
      yPosition += 5;

      // Anaesthesia
      addSectionHeader('ANAESTHESIA DETAILS');
      yPosition = addText(`General: ${surgeryRecord.formData.generalAnaesthesia}`, margin, yPosition);
      yPosition = addText(`Regional: ${surgeryRecord.formData.regionalAnaesthesia}`, margin, yPosition);
      yPosition = addText(`Local: ${surgeryRecord.formData.localAnaesthesia}`, margin, yPosition);
      yPosition += 5;

      // Intra Operative Data
      addSectionHeader('INTRA OPERATIVE DATA');
      surgeryRecord.formData.intraOperativeData.forEach((item, index) => {
        checkPageBreak();
        yPosition = addText(`Position ${item.position} o'clock - Grade ${item.grade} - Energy: ${item.energy} J`, margin, yPosition);
      });
      const totalEnergy = surgeryRecord.formData.intraOperativeData.reduce((sum, item) => sum + parseFloat(item.energy), 0);
      yPosition = addText(`Total Energy Applied: ${totalEnergy} J`, margin, yPosition, 10, true);
      yPosition += 5;

      // Clinical Presentation
      addSectionHeader('CLINICAL PRESENTATION');
      const formatSymptom = (val) => {
        const mapping = {
          'never': 'Never',
          'less_than_once_month': 'Less than once a month',
          'less_than_once_week': 'Less than once a week',
          '1_6_days_per_week': '1-6 days per week',
          'every_day': 'Every day'
        };
        return mapping[val] || 'Not recorded';
      };
      yPosition = addText(`Pain: ${formatSymptom(surgeryRecord.formData.pain)}`, margin, yPosition);
      yPosition = addText(`Itching: ${formatSymptom(surgeryRecord.formData.itching)}`, margin, yPosition);
      yPosition = addText(`Bleeding: ${formatSymptom(surgeryRecord.formData.bleeding)}`, margin, yPosition);
      yPosition = addText(`Soiling: ${formatSymptom(surgeryRecord.formData.soiling)}`, margin, yPosition);
      yPosition = addText(`Prolapsing: ${formatSymptom(surgeryRecord.formData.prolapsing)}`, margin, yPosition);
      yPosition += 5;

      // Postoperative Medication
      addSectionHeader('POSTOPERATIVE MEDICATION');
      yPosition = addText(surgeryRecord.formData.postoperativeMedication, margin, yPosition);
      yPosition += 5;

      // Complications
      if (surgeryRecord.formData.hasComplications === 'yes') {
        addSectionHeader('COMPLICATIONS');
        yPosition = addText(surgeryRecord.formData.complications || 'None recorded', margin, yPosition);
      }
    }

    // Footer
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${timestamp}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    doc.save(`Surgery_Record_${surgeryRecord.id}_${surgeryRecord.patientName.replace(/\s+/g, '_')}.pdf`);
  };


  const getStatusBadge = (status, color) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200'
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${colors[color]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-cyan-600 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Surgery Records</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{surgeryRecord.procedure}</h1>
                {getStatusBadge(surgeryRecord.status, surgeryRecord.statusColor)}
              </div>
              <p className="text-gray-600">Record ID: <span className="font-semibold text-cyan-600">{surgeryRecord.id}</span></p>
            </div>

            <div className="flex space-x-2">
              <button
            onClick={handleDownloadPDF}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition" title="Download">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
          
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <User className="w-10 h-10 text-cyan-600 p-2 bg-cyan-50 rounded-lg" />
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-semibold text-gray-900">{surgeryRecord.patientName}</p>
                <p className="text-xs text-gray-500">{surgeryRecord.patientAge} years, {surgeryRecord.gender}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="w-10 h-10 text-blue-600 p-2 bg-blue-50 rounded-lg" />
              <div>
                <p className="text-sm text-gray-500">Surgery Type</p>
                <p className="font-semibold text-gray-900">{surgeryRecord.type}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-10 h-10 text-green-600 p-2 bg-green-50 rounded-lg" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-semibold text-gray-900">{surgeryRecord.date}</p>
                <p className="text-xs text-gray-500">{surgeryRecord.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-10 h-10 text-amber-600 p-2 bg-amber-50 rounded-lg" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">{surgeryRecord.duration}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-cyan-600" />
              <div>
                <p className="text-sm text-gray-500">Surgeon</p>
                <p className="font-semibold text-gray-900">{surgeryRecord.doctor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Surgery-Specific Details */}
        {renderSurgerySpecificDetails()}

      </div>
    </div>
  );
};

// ============================================
// Surgery Type Specific Components
// ============================================

// Laser Surgery Details Component
const LaserSurgeryDetails = ({ formData }) => {
  return (
    <div className="space-y-6">
      
      {/* Laser Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Activity className="w-6 h-6 text-cyan-600" />
          <span>Laser Settings</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DetailItem label="Laser Wavelength" value={formData.laserWavelength} />
          <DetailItem label="Laser Power" value={formData.laserPower} />
          <DetailItem label="Pulse Mode" value={formData.laserPulseMode} />
          <DetailItem label="Total Energy Applied" value={`${formData.totalAppliedEnergy} J`} />
        </div>
        <div className="mt-6">
          <DetailItem label="Medication" value={formData.medication} fullWidth />
        </div>
      </div>

      {/* Diagnostics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Differential Diagnostics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.diagnostics).map(([key, value]) => {
            if (value.observed || value.treated) {
              return (
                <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <div className="flex space-x-4 mt-2 text-sm">
                    <span className={value.observed ? 'text-green-600' : 'text-gray-400'}>
                      {value.observed ? '✓ Observed' : '✗ Not Observed'}
                    </span>
                    <span className={value.treated ? 'text-blue-600' : 'text-gray-400'}>
                      {value.treated ? '✓ Treated' : '✗ Not Treated'}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Anaesthesia */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Anaesthesia Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnaesthesiaItem label="General" value={formData.generalAnaesthesia} />
          <AnaesthesiaItem label="Regional" value={formData.regionalAnaesthesia} />
          <AnaesthesiaItem label="Local" value={formData.localAnaesthesia} />
        </div>
      </div>

      {/* Intra Operative Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Intra Operative Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Position (Clock)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Energy (J)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.intraOperativeData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.position} o'clock</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Grade {item.grade}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-cyan-600">{item.energy} J</td>
                </tr>
              ))}
              <tr className="bg-cyan-50 font-semibold">
                <td className="px-4 py-3 text-sm text-gray-900" colSpan="2">Total Energy Applied</td>
                <td className="px-4 py-3 text-sm text-cyan-700">
                  {formData.intraOperativeData.reduce((sum, item) => sum + parseFloat(item.energy), 0)} J
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Presentation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Clinical Presentation - Need for Surgery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SymptomItem label="Pain" value={formData.pain} />
          <SymptomItem label="Itching" value={formData.itching} />
          <SymptomItem label="Bleeding" value={formData.bleeding} />
          <SymptomItem label="Soiling" value={formData.soiling} />
          <SymptomItem label="Prolapsing" value={formData.prolapsing} />
        </div>
      </div>

      {/* Postoperative Medication */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Postoperative Medication</h2>
        <p className="text-gray-700 leading-relaxed">{formData.postoperativeMedication}</p>
      </div>

    </div>
  );
};

// Cardiac Surgery Details Component (Example)
const CardiacSurgeryDetails = ({ formData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Cardiac Surgery Details</h2>
      <p className="text-gray-600">Cardiac-specific fields would go here...</p>
      {/* Add cardiac-specific fields */}
    </div>
  );
};

// Orthopedic Surgery Details Component (Example)
const OrthopedicSurgeryDetails = ({ formData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Orthopedic Surgery Details</h2>
      <p className="text-gray-600">Orthopedic-specific fields would go here...</p>
      {/* Add orthopedic-specific fields */}
    </div>
  );
};

// Generic Surgery Details (Fallback)
const GenericSurgeryDetails = ({ formData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Surgery Details</h2>
      <p className="text-gray-600">General surgery information...</p>
    </div>
  );
};

// ============================================
// Helper Components
// ============================================

const DetailItem = ({ label, value, fullWidth }) => (
  <div className={fullWidth ? 'col-span-full' : ''}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-semibold text-gray-900">{value || 'N/A'}</p>
  </div>
);

const AnaesthesiaItem = ({ label, value }) => (
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className={`w-3 h-3 rounded-full ${value === 'yes' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
    <div>
      <p className="text-sm text-gray-500">{label} Anaesthesia</p>
      <p className="font-semibold text-gray-900">{value === 'yes' ? 'Yes' : 'No'}</p>
    </div>
  </div>
);

const SymptomItem = ({ label, value }) => {
  const formatValue = (val) => {
    const mapping = {
      'never': 'Never',
      'less_than_once_month': 'Less than once a month',
      'less_than_once_week': 'Less than once a week',
      '1_6_days_per_week': '1-6 days per week',
      'every_day': 'Every day (always)'
    };
    return mapping[val] || 'Not recorded';
  };

  const getColor = (val) => {
    if (val === 'never') return 'text-green-600 bg-green-50';
    if (val === 'every_day') return 'text-red-600 bg-red-50';
    return 'text-amber-600 bg-amber-50';
  };

  return (
    <div className={`p-4 rounded-lg border ${getColor(value)}`}>
      <p className="text-sm font-semibold mb-1">{label}</p>
      <p className="text-sm">{formatValue(value)}</p>
    </div>
  );
};

export default SurgeryDetailsPage;