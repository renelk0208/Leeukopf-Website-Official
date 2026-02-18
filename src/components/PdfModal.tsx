import { X } from 'lucide-react';
import { useEffect } from 'react';

interface PdfModalProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function PdfModal({ pdfUrl, title, onClose }: PdfModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Close PDF viewer"
      >
        <X size={20} className="text-gray-700 sm:w-6 sm:h-6" aria-hidden="true" />
      </button>

      {/* PDF viewer container */}
      <div
        className="w-full h-full max-w-6xl max-h-[95vh] bg-white rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900 truncate">{title}</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
