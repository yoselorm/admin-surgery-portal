import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Calendar, User, Hash, ArrowLeft, Activity, Stethoscope, Syringe, Zap, FileText, ClipboardList } from 'lucide-react';
import { generateLHPSurgeryPDF } from '../utils/pdfGenerators';
import { useSelector } from 'react-redux';

const AdminLHPSurgeryDetails = ({ currentSurgery, loading }) => {
  const navigate = useNavigate();
  const {admin} = useSelector((state)=>state.auth)

  if (loading || !currentSurgery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading surgery record...</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'complete':
        return { bgClass: 'bg-green-100', textClass: 'text-green-800', borderClass: 'border-green-300', label: 'Completed' };
      case 'incomplete':
        return { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800', borderClass: 'border-yellow-300', label: 'Incomplete' };
      default:
        return { bgClass: 'bg-gray-100', textClass: 'text-gray-800', borderClass: 'border-gray-300', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(currentSurgery.status);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formData = currentSurgery.formData || {};

  const symptomLabels = {
    less_than_once_month: 'Less than once a month',
    less_than_once_week: 'Less than once a week',
    '1_6_days_per_week': '1-6 days per week',
    every_day: 'Every day'
  };

  const DataRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-900">{value || 'N/A'}</span>
    </div>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
        <Icon className="w-5 h-5 text-cyan-600" />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-cyan-600 transition mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Surgery Records</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-2xl font-bold text-gray-900">{currentSurgery.procedure}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
                  {statusConfig.label}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500 text-xs">Record ID</p>
                    <p className="font-semibold text-cyan-600">{currentSurgery.surgeryId || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500 text-xs">Patient</p>
                    <p className="font-semibold text-gray-900">{currentSurgery.patientName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500 text-xs">Surgery Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(currentSurgery.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500 text-xs">Surgery Type</p>
                    <p className="font-semibold text-gray-900">{currentSurgery.surgeryType || 'Laser Surgery'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <button onClick={() => generateLHPSurgeryPDF(currentSurgery)} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition shadow-lg">
                <Download className="w-5 h-5" />
                <span className="text-sm font-semibold">Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Admin View - Read Only</span>
          </div>
        </div>

        {/* Patient Information */}
        <Section title="Patient Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <DataRow label="Patient Name" value={currentSurgery.patientName} />
            <DataRow label="Age" value={currentSurgery.patientAge} />
            <DataRow label="Gender" value={currentSurgery.gender} />
            <DataRow label="Surgery Date" value={formatDate(currentSurgery.date)} />
          </div>
        </Section>

        {/* Doctor Information */}
        {currentSurgery.doctor && admin.role ==='super-admin' && (
          <Section title="Doctor Information" icon={Stethoscope}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <DataRow label="Doctor Name" value={currentSurgery.doctor.fullname} />
              <DataRow label="Email" value={currentSurgery.doctor.email} />
            </div>
          </Section>
        )}

        {/* Clinical Presentation */}
        <Section title="Clinical Presentation" icon={ClipboardList}>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Symptoms</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 bg-gray-50 p-4 rounded">
                <DataRow label="Pain" value={symptomLabels[formData.symptoms?.pain] || formData.symptoms?.pain} />
                <DataRow label="Itching" value={symptomLabels[formData.symptoms?.itching] || formData.symptoms?.itching} />
                <DataRow label="Bleeding" value={symptomLabels[formData.symptoms?.bleeding] || formData.symptoms?.bleeding} />
                <DataRow label="Soiling" value={symptomLabels[formData.symptoms?.soiling] || formData.symptoms?.soiling} />
                <DataRow label="Prolapsing" value={symptomLabels[formData.symptoms?.prolapsing] || formData.symptoms?.prolapsing} />
              </div>
            </div>
            <DataRow label="VAS Score (Pain Assessment)" value={formData.vasScore} />
          </div>
        </Section>

        {/* Diagnostics */}
        {formData.diagnostics && (
          <Section title="Diagnostics" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.diagnostics).map(([key, value]) => (
                value.observed || value.treated ? (
                  <div key={key} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium text-gray-900 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <div className="flex space-x-4 text-sm">
                      <span className={value.observed ? 'text-green-600' : 'text-gray-400'}>
                        Observed: {value.observed ? 'Yes' : 'No'}
                      </span>
                      <span className={value.treated ? 'text-green-600' : 'text-gray-400'}>
                        Treated: {value.treated ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {value.description && <p className="text-xs text-gray-600 mt-1">{value.description}</p>}
                  </div>
                ) : null
              ))}
            </div>
          </Section>
        )}

        {/* Anaesthesia */}
        <Section title="Anaesthesia" icon={Syringe}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
            <DataRow label="Spinal Anaesthesia" value={formData.spinalAnaesthesia} />
            <DataRow label="Saddle Block" value={formData.saddleBlock} />
            <DataRow label="Pudenous Block" value={formData.pudendusBlock} />
            <DataRow label="General Anaesthesia" value={formData.generalAnaesthesia} />
            <DataRow label="Regional Anaesthesia" value={formData.regionalAnaesthesia} />
            <DataRow label="Local Anaesthesia" value={formData.localAnaesthesia} />
          </div>
        </Section>

        {/* Laser Settings */}
        <Section title="Laser Settings" icon={Zap}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
            <DataRow label="Wavelength" value={formData.laserWavelength} />
            <DataRow label="Power" value={formData.laserPower} />
            <DataRow label="Pulse Mode" value={formData.laserPulseMode} />
          </div>
        </Section>

        {/* Intra-Operative Data */}
        {formData.intraOperativeData && formData.intraOperativeData.length > 0 && (
          <Section title="Intra-Operative Data" icon={Activity}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Grade</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Energy (J)</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.intraOperativeData.map((data, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-4 py-2 text-sm text-gray-900">{data.position}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{data.grade}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{data.energy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* Medications */}
        <Section title="Medications" icon={FileText}>
          <DataRow label="Pre-operative Medication" value={formData.medication} />
          <DataRow label="Post-operative Medication" value={formData.postoperativeMedication} />
        </Section>

        {/* Follow-Up */}
        {formData.followUp && (
          <Section title="Follow-Up Schedule" icon={Calendar}>
            <div className="space-y-4">
              {Object.entries(formData.followUp).map(([period, data]) => (
                data.completed && (
                  <div key={period} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 capitalize">{period.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Completed</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DataRow label="Date" value={formatDate(data.date)} />
                      <DataRow label="VAS Score" value={data.vasScore} />
                    </div>
                    {data.symptoms && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Symptoms</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {Object.entries(data.symptoms).map(([symptom, value]) => (
                            value && (
                              <div key={symptom} className="text-sm">
                                <span className="capitalize text-gray-600">{symptom}: </span>
                                <span className={value === 'yes' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                  {value}
                                </span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    {data.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{data.notes}</p>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

export default AdminLHPSurgeryDetails;