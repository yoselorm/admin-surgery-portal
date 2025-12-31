import React, { useState } from 'react';
import { X, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import ProcedureSelector from './ProcedureSelector';
import BiolitecLHPFilters from './BiolitecLHPFilters';
import CommonFilters from './CommonFilters';
import { useSelector } from 'react-redux';

const ExportFilterModal = ({ isOpen, onClose, onExport }) => {
  const [step, setStep] = useState(1); // 1: Select Procedure, 2: Apply Filters
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const {exportLoading} = useSelector((state)=>state.surgeries)
  const [filters, setFilters] = useState({
    // Common filters (always available)
    dateRange: { start: '', end: '' },
    patientAge: { min: '', max: '' },
    gender: 'all',
    status: 'all',
    
    // Procedure-specific filters will be added here
    procedureSpecific: {}
  });

  if (!isOpen) return null;

  const handleProcedureSelect = (procedure) => {
    setSelectedProcedure(procedure);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedProcedure('');
  };

  const handleExport = () => {
    onExport({
      procedure: selectedProcedure,
      filters: filters
    });
   setTimeout(()=>{
    handleClose();
   },1000)
  };

  const handleClose = () => {
    setStep(1);
    setSelectedProcedure('');
    setFilters({
      dateRange: { start: '', end: '' },
      patientAge: { min: '', max: '' },
      gender: 'all',
      status: 'all',
      procedureSpecific: {}
    });
    onClose();
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <ProcedureSelector 
          onSelect={handleProcedureSelect}
          onSelectAll={() => {
            setSelectedProcedure('all');
            setStep(2);
          }}
        />
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          {/* Selected Procedure Display */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-cyan-900">
              Selected Procedure: <span className="text-cyan-700">{selectedProcedure === 'all' ? 'All Procedures' : selectedProcedure}</span>
            </p>
          </div>

          {/* Common Filters - Always show */}
          <CommonFilters 
            filters={filters}
            onChange={setFilters}
          />

          {/* Procedure-Specific Filters */}
          {selectedProcedure === 'biolitec-lhp' && (
            <BiolitecLHPFilters 
              filters={filters}
              onChange={setFilters}
            />
          )}

          {/* Future procedures will be added here */}
          {selectedProcedure !== 'all' && selectedProcedure !== 'biolitec-lhp' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-800">
                Advanced filters for this procedure are coming soon.
              </p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Select Procedure Type' : 'Configure Export Filters'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 1 ? 'Choose a procedure to filter and export' : 'Apply filters to refine your export'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 ${step === 1 ? 'text-cyan-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 1 ? 'bg-cyan-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Select Procedure</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center space-x-2 ${step === 2 ? 'text-cyan-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 2 ? 'bg-cyan-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Apply Filters</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div>
            {step === 2 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            {step === 2 && (
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>{exportLoading ? 'exporting...' :'Export Data'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFilterModal;