import { createSlice } from "@reduxjs/toolkit";

const surgerySlice = createSlice({
  name: "surgeries",
  initialState: {
    list: [
        {
          id: 'SRG-2847',
          patientName: 'Sarah Johnson',
          patientAge: 45,
          gender: 'Female',
          procedure: 'Biolitec Laser LHP',
          type: 'Laser Surgery',
          doctor: 'Dr. John Doe',
          date: '2024-03-15',
          time: '09:00 AM',
          duration: '2 hours',
          status: 'Completed',
          statusColor: 'green',
          formData: {
            doctorName: 'Dr. John Doe',
            location: 'Main Operating Theater',
            city: 'Accra',
            laserWavelength: '1470nm',
            laserPower: '8W',
            laserPulseMode: '3.0s',
            totalAppliedEnergy: '450',
            medication: 'Aspirin 75mg, Paracetamol 500mg',
            diagnostics: {
              fissure: { observed: true, treated: true },
              skinTags: { observed: false, treated: false },
              analVeinThrombosis: { observed: true, treated: false }
            },
            treatmentMethods: {
              medication: true,
              surgery: true,
              infraredCoagulation: false
            },
            generalAnaesthesia: 'no',
            regionalAnaesthesia: 'yes',
            localAnaesthesia: 'yes',
            hasComplications: 'no',
            complications: '',
            intraOperativeData: [
              { position: '3', grade: 'II', energy: '150' },
              { position: '7', grade: 'III', energy: '180' },
              { position: '11', grade: 'II', energy: '120' }
            ],
            pain: '1_6_days_per_week',
            itching: 'less_than_once_week',
            bleeding: 'every_day',
            soiling: 'never',
            prolapsing: 'less_than_once_month',
            postoperativeMedication: 'Antibiotics (Amoxicillin 500mg TDS), Pain relief (Ibuprofen 400mg PRN), Stool softeners'
          }
        },
        {
          id: 'SRG-3129',
          patientName: 'Michael Chen',
          patientAge: 52,
          gender: 'Male',
          procedure: 'Biolitec Laser LHP',
          type: 'Laser Surgery',
          doctor: 'Dr. Emily Watson',
          date: '2024-03-18',
          time: '10:30 AM',
          duration: '1.5 hours',
          status: 'Completed',
          statusColor: 'green',
          formData: {
            doctorName: 'Dr. Emily Watson',
            location: 'Theater 2',
            city: 'Kumasi',
            laserWavelength: '1470nm',
            laserPower: '10W',
            laserPulseMode: '2.5s',
            totalAppliedEnergy: '520',
            medication: 'Clopidogrel 75mg, Metformin 500mg',
            diagnostics: {
              fissure: { observed: false, treated: false },
              skinTags: { observed: true, treated: true },
              analVeinThrombosis: { observed: false, treated: false }
            },
            treatmentMethods: {
              medication: true,
              surgery: true,
              infraredCoagulation: true
            },
            generalAnaesthesia: 'no',
            regionalAnaesthesia: 'yes',
            localAnaesthesia: 'no',
            hasComplications: 'no',
            complications: '',
            intraOperativeData: [
              { position: '2', grade: 'III', energy: '195' },
              { position: '6', grade: 'III', energy: '200' },
              { position: '10', grade: 'II', energy: '125' }
            ],
            pain: 'every_day',
            itching: '1_6_days_per_week',
            bleeding: '1_6_days_per_week',
            soiling: 'less_than_once_week',
            prolapsing: 'every_day',
            postoperativeMedication: 'Antibiotics (Ciprofloxacin 500mg BD), Pain relief (Paracetamol 1g QDS), Laxatives (Lactulose 15ml BD)'
          }
        },
        {
          id: 'SRG-3241',
          patientName: 'Amina Osei',
          patientAge: 38,
          gender: 'Female',
          procedure: 'Biolitec Laser LHP',
          type: 'Laser Surgery',
          doctor: 'Dr. John Doe',
          date: '2024-03-22',
          time: '08:00 AM',
          duration: '2.25 hours',
          status: 'Completed',
          statusColor: 'green',
          formData: {
            doctorName: 'Dr. John Doe',
            location: 'Main Operating Theater',
            city: 'Accra',
            laserWavelength: '1470nm',
            laserPower: '7W',
            laserPulseMode: '3.5s',
            totalAppliedEnergy: '680',
            medication: 'None',
            diagnostics: {
              fissure: { observed: true, treated: true },
              skinTags: { observed: true, treated: true },
              analVeinThrombosis: { observed: true, treated: true }
            },
            treatmentMethods: {
              medication: false,
              surgery: true,
              infraredCoagulation: false
            },
            generalAnaesthesia: 'yes',
            regionalAnaesthesia: 'no',
            localAnaesthesia: 'yes',
            hasComplications: 'no',
            complications: '',
            intraOperativeData: [
              { position: '1', grade: 'IV', energy: '220' },
              { position: '5', grade: 'III', energy: '185' },
              { position: '9', grade: 'IV', energy: '210' },
              { position: '12', grade: 'II', energy: '65' }
            ],
            pain: 'every_day',
            itching: 'every_day',
            bleeding: 'every_day',
            soiling: '1_6_days_per_week',
            prolapsing: 'every_day',
            postoperativeMedication: 'Antibiotics (Metronidazole 400mg TDS + Amoxicillin 500mg TDS), Pain relief (Tramadol 50mg PRN), Stool softeners, Anti-inflammatory (Diclofenac 50mg BD)'
          }
        },
        {
          id: 'SRG-3358',
          patientName: 'David Mensah',
          patientAge: 61,
          gender: 'Male',
          procedure: 'Biolitec Laser LHP',
          type: 'Laser Surgery',
          doctor: 'Dr. Sarah Ahmed',
          date: '2024-03-25',
          time: '02:00 PM',
          duration: '1.75 hours',
          status: 'Completed',
          statusColor: 'green',
          formData: {
            doctorName: 'Dr. Sarah Ahmed',
            location: 'Theater 3',
            city: 'Takoradi',
            laserWavelength: '1470nm',
            laserPower: '9W',
            laserPulseMode: '2.8s',
            totalAppliedEnergy: '395',
            medication: 'Aspirin 75mg, Atorvastatin 20mg, Lisinopril 10mg',
            diagnostics: {
              fissure: { observed: false, treated: false },
              skinTags: { observed: false, treated: false },
              analVeinThrombosis: { observed: false, treated: false }
            },
            treatmentMethods: {
              medication: true,
              surgery: true,
              infraredCoagulation: false
            },
            generalAnaesthesia: 'no',
            regionalAnaesthesia: 'yes',
            localAnaesthesia: 'yes',
            hasComplications: 'yes',
            complications: 'Minor bleeding controlled with pressure',
            intraOperativeData: [
              { position: '4', grade: 'II', energy: '135' },
              { position: '8', grade: 'III', energy: '170' },
              { position: '12', grade: 'II', energy: '90' }
            ],
            pain: '1_6_days_per_week',
            itching: 'never',
            bleeding: 'less_than_once_month',
            soiling: 'never',
            prolapsing: '1_6_days_per_week',
            postoperativeMedication: 'Antibiotics (Augmentin 625mg BD), Pain relief (Ibuprofen 400mg TDS), Stool softeners (Docusate 100mg BD)'
          }
        },
        {
          id: 'SRG-3472',
          patientName: 'Grace Boateng',
          patientAge: 29,
          gender: 'Female',
          procedure: 'Biolitec Laser LHP',
          type: 'Laser Surgery',
          doctor: 'Dr. Emily Watson',
          date: '2024-03-28',
          time: '11:00 AM',
          duration: '1.25 hours',
          status: 'Completed',
          statusColor: 'green',
          formData: {
            doctorName: 'Dr. Emily Watson',
            location: 'Theater 2',
            city: 'Kumasi',
            laserWavelength: '1470nm',
            laserPower: '6W',
            laserPulseMode: '3.2s',
            totalAppliedEnergy: '285',
            medication: 'Iron supplements (Ferrous sulfate 200mg)',
            diagnostics: {
              fissure: { observed: false, treated: false },
              skinTags: { observed: true, treated: false },
              analVeinThrombosis: { observed: false, treated: false }
            },
            treatmentMethods: {
              medication: true,
              surgery: true,
              infraredCoagulation: false
            },
            generalAnaesthesia: 'no',
            regionalAnaesthesia: 'no',
            localAnaesthesia: 'yes',
            hasComplications: 'no',
            complications: '',
            intraOperativeData: [
              { position: '3', grade: 'II', energy: '95' },
              { position: '7', grade: 'II', energy: '100' },
              { position: '11', grade: 'II', energy: '90' }
            ],
            pain: 'less_than_once_week',
            itching: 'less_than_once_month',
            bleeding: '1_6_days_per_week',
            soiling: 'never',
            prolapsing: 'less_than_once_week',
            postoperativeMedication: 'Antibiotics (Amoxicillin 500mg TDS), Pain relief (Paracetamol 500mg QDS), Stool softeners, Continue iron supplements'
          }
        }
      ]
  },
  reducers: {
    addSurgery: (state, action) => {
      state.list.unshift(action.payload); // add new surgery at top
    },
  }
});

export const { addSurgery } = surgerySlice.actions;
export default surgerySlice.reducer;
