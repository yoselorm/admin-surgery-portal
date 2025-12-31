import React from 'react';
import { Zap, Heart, Brain, Bone, Scissors, Activity, CheckCircle } from 'lucide-react';

const ProcedureSelector = ({ onSelect, onSelectAll }) => {
  const procedures = [
    { 
      id: 'biolitec-lhp', 
      name: 'Biolitec Laser LHP', 
      icon: Zap,
      available: true,
      description: 'Laser hemorrhoid procedure'
    },
    { 
      id: 'cardiac', 
      name: 'Cardiac Surgery', 
      icon: Heart,
      available: false,
      description: 'Coming soon'
    },
    { 
      id: 'neurosurgery', 
      name: 'Neurosurgery', 
      icon: Brain,
      available: false,
      description: 'Coming soon'
    },
    { 
      id: 'orthopedic', 
      name: 'Orthopedic Surgery', 
      icon: Bone,
      available: false,
      description: 'Coming soon'
    },
    { 
      id: 'general', 
      name: 'General Surgery', 
      icon: Scissors,
      available: false,
      description: 'Coming soon'
    },
    { 
      id: 'ent', 
      name: 'ENT Surgery', 
      icon: Activity,
      available: false,
      description: 'Coming soon'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export All Option */}
      <button
        onClick={onSelectAll}
        className="w-full p-6 border-2 border-gray-300 rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">Export All Procedures</h3>
              <p className="text-sm text-gray-600">Export data from all available procedures</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-semibold">
            All Data
          </div>
        </div>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or select a specific procedure</span>
        </div>
      </div>

      {/* Individual Procedures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {procedures.map((procedure) => {
          const Icon = procedure.icon;
          const isAvailable = procedure.available;
          
          return (
            <button
              key={procedure.id}
              onClick={() => isAvailable && onSelect(procedure.id)}
              disabled={!isAvailable}
              className={`
                p-6 rounded-xl border-2 transition text-left
                ${isAvailable 
                  ? 'border-gray-200 hover:border-cyan-600 hover:bg-cyan-50 cursor-pointer group' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${isAvailable 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:scale-110' 
                    : 'bg-gray-300'
                  }
                  transition
                `}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-900">{procedure.name}</h3>
                    {isAvailable && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        Available
                      </span>
                    )}
                    {!isAvailable && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-semibold">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{procedure.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProcedureSelector;