import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTopOnRouteChange
 *
 * A reusable React component that automatically scrolls to the top of the page
 * whenever the route's pathname changes. This is useful for ensuring that users
 * always start at the top of a new page when navigating between routes.
 *
 * Usage:
 *   Mount this component inside your BrowserRouter/Router at a top level so it
 *   applies globally to all route changes:
 *
 *   <BrowserRouter>
 *     <ScrollToTopOnRouteChange />
 *     <App />
 *   </BrowserRouter>
 *
 * Notes:
 *   - Only triggers on pathname changes, not on hash/anchor changes.
 *   - Uses behavior: "auto" (instant scroll) to avoid interfering with smooth
 *     scrolling for in-page anchors or other scroll behaviors.
 *   - Does not render any UI elements.
 */
export default function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly whenever the pathname changes.
    // We use "auto" (instant) behavior to avoid conflicting with any
    // smooth scrolling implementations for anchor links.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  // This component does not render anything to the DOM.
  return null;
}
