import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300"
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
}
