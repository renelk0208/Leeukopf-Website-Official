import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center px-4 pt-32 bg-white">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 mb-8 font-light">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary px-6 py-3 rounded-lg font-semibold">
              Back to Homepage
            </Link>
            <Link to="/private-label" className="btn-secondary px-6 py-3 rounded-lg font-semibold">
              Private Label
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
