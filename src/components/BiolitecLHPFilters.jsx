import React from 'react';
import { Zap, Activity, Stethoscope, Pill, Syringe, Calendar } from 'lucide-react';

const BiolitecLHPFilters = ({ filters, onChange }) => {
  const updateFilter = (path, value) => {
    const keys = path.split('.');
    const newFilters = { ...filters };
    
    // Navigate to procedureSpecific
    if (!newFilters.procedureSpecific) {
      newFilters.procedureSpecific = {};
    }
    
    let current = newFilters.procedureSpecific;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onChange(newFilters);
  };

  // Initialize procedureSpecific if it doesn't exist
//   if (!filters?.procedureSpecific) {
//     filters?.procedureSpecific = {};
//   }

  return (
    <div className="">
      {/* Laser Parameters */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-cyan-600" />
          <span>Laser Parameters</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wavelength
            </label>
            <select
              value={filters?.procedureSpecific.laserWavelength || 'all'}
              onChange={(e) => updateFilter('laserWavelength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Wavelengths</option>
              <option value="1470nm">1470nm</option>
              <option value="980nm">980nm</option>
              <option value="810nm">810nm</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Laser Power Range (W)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters?.procedureSpecific.laserPowerMin || ''}
                onChange={(e) => updateFilter('laserPowerMin', e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="number"
                value={filters?.procedureSpecific.laserPowerMax || ''}
                onChange={(e) => updateFilter('laserPowerMax', e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Period */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>Follow-up Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Period
            </label>
            <select
              value={filters?.procedureSpecific.followUpPeriod || 'all'}
              onChange={(e) => updateFilter('followUpPeriod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Periods</option>
              <option value="twoWeeks">2 Weeks</option>
              <option value="sixWeeks">6 Weeks</option>
              <option value="threeMonths">3 Months</option>
              <option value="sixMonths">6 Months</option>
              <option value="twelveMonths">12 Months</option>
              <option value="twoYears">2 Years</option>
              <option value="threeYears">3 Years</option>
              <option value="fiveYears">5 Years</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Status
            </label>
            <select
              value={filters?.procedureSpecific.followUpCompleted || 'all'}
              onChange={(e) => updateFilter('followUpCompleted', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All</option>
              <option value="true">Completed</option>
              <option value="false">Not Completed</option>
            </select>
          </div>
        </div>

        {/* VAS Score Range */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VAS Score Range (0-10)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              max="10"
              value={filters?.procedureSpecific.vasScoreMin || ''}
              onChange={(e) => updateFilter('vasScoreMin', e.target.value)}
              placeholder="Min (0-10)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              min="0"
              max="10"
              value={filters?.procedureSpecific.vasScoreMax || ''}
              onChange={(e) => updateFilter('vasScoreMax', e.target.value)}
              placeholder="Max (0-10)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Stethoscope className="w-5 h-5 text-red-600" />
          <span>Symptoms Filter</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['pain', 'itching', 'bleeding', 'soiling', 'prolapsing'].map((symptom) => (
            <div key={symptom}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {symptom}
              </label>
              <select
                value={filters?.procedureSpecific[`symptom_${symptom}`] || 'all'}
                onChange={(e) => updateFilter(`symptom_${symptom}`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All</option>
                <option value="yes">Present</option>
                <option value="no">Not Present</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostics */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-orange-600" />
          <span>Diagnostics Filter</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['fissure', 'skinTags', 'fistula', 'cryptitis', 'analRectumProlapse', 'analStenosis'].map((diagnostic) => (
            <div key={diagnostic}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {diagnostic.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={filters?.procedureSpecific[`diagnostic_${diagnostic}`] || 'all'}
                onChange={(e) => updateFilter(`diagnostic_${diagnostic}`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All</option>
                <option value="observed">Observed</option>
                <option value="treated">Treated</option>
                <option value="both">Both</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Methods */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Pill className="w-5 h-5 text-green-600" />
          <span>Treatment Methods</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['medication', 'sclerosation', 'infraredCoagulation', 'rubberBandLigation', 'halDghal', 'surgery'].map((treatment) => (
            <div key={treatment}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {treatment.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={filters?.procedureSpecific[`treatment_${treatment}`] || 'all'}
                onChange={(e) => updateFilter(`treatment_${treatment}`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All</option>
                <option value="true">Used</option>
                <option value="false">Not Used</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Anaesthesia Type */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <Syringe className="w-5 h-5 text-yellow-600" />
          <span>Anaesthesia Type</span>
        </h3>
        
        <select
          value={filters?.procedureSpecific.anaesthesia || 'all'}
          onChange={(e) => updateFilter('anaesthesia', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Types</option>
          <option value="spinal">Spinal Anaesthesia</option>
          <option value="general">General Anaesthesia</option>
          <option value="local">Local Anaesthesia</option>
          <option value="regional">Regional Anaesthesia</option>
          <option value="saddleBlock">Saddle Block</option>
          <option value="pudendusBlock">Pudendus Block</option>
        </select>
      </div>
    </div>
  );
};

export default BiolitecLHPFilters;