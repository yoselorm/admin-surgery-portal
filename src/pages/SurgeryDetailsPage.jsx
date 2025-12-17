import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentSurgery, fetchSurgeryById } from '../redux/SurgerySlice';
import AdminLHPSurgeryDetails from '../components/AdminLHPDetails';

const SurgeryDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentSurgery, loading } = useSelector(
    (state) => state.surgeries
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSurgeryById(id));
    }

    // Cleanup function
    return () => {
      dispatch(clearCurrentSurgery());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  if (!currentSurgery) {
    return <div>No surgery record found.</div>;
  }

  // 🔑 Decide which surgery UI to render
  const renderSurgerySpecificDetails = () => {
    switch (currentSurgery.surgeryType) {
      case 'Laser Surgery':
        return <AdminLHPSurgeryDetails currentSurgery={currentSurgery} loading={loading}/>;
      default:
        return <div>Unsupported surgery type</div>;
    }
  };

  return (
    <div className="p-6">
      {renderSurgerySpecificDetails()}
    </div>
  );
};

export default SurgeryDetailsPage;