import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoadingFallback from './components/LoadingFallback';

// Lazy load all non-homepage routes
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const CpnpComplianceSupportPage = lazy(() => import('./pages/CpnpComplianceSupportPage'));
const PrivateLabelPage = lazy(() => import('./pages/PrivateLabelPage'));
const PrivateLabelBottlesPage = lazy(() => import('./pages/PrivateLabelBottlesPage'));
const PrivateLabelBulkPage = lazy(() => import('./pages/PrivateLabelBulkPage'));
const GelitupDistributionPage = lazy(() => import('./pages/GelitupDistributionPage'));
const ClientRegistrationPage = lazy(() => import('./pages/ClientRegistrationPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const CookiesPolicyPage = lazy(() => import('./pages/CookiesPolicyPage'));
const PrivacyNoticeDistributorsPage = lazy(() => import('./pages/PrivacyNoticeDistributorsPage'));
const SeasonTrendsPage = lazy(() => import('./pages/SeasonTrendsPage'));
const ValentinesPage = lazy(() => import('./pages/ValentinesPage'));
const LiveFeedPage = lazy(() => import('./pages/LiveFeedPage'));
const FaqStartBrandPage = lazy(() => import('./pages/FaqStartBrandPage'));
const OrderFormPage = lazy(() => import('./pages/OrderFormPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const CatalogTest = lazy(() => import("./pages/CatalogTest"));
const CartTest = lazy(() => import("./pages/CartTest"));
const B2BPortalShell = lazy(() => import("./b2b/B2BPortalShell"));
const B2BDashboard = lazy(() => import("./b2b/pages/B2BDashboard"));
const B2BClientInfoPage = lazy(() => import("./b2b/pages/B2BClientInfoPage"));
const B2BSolidColoursPage = lazy(() => import("./b2b/pages/B2BSolidColoursPage"));
const B2BBuilderGelsPortalPage = lazy(() => import("./b2b/pages/B2BBuilderGelsPage"));
const B2BPolygelsPage = lazy(() => import("./b2b/pages/B2BPolygelsPage"));
const B2BExtraStrengthBasesPage = lazy(() => import("./b2b/pages/B2BExtraStrengthBasesPage"));
const B2BCheckoutPage = lazy(() => import("./b2b/pages/B2BCheckoutPage"));
const B2BOrdersPage = lazy(() => import("./b2b/pages/B2BOrdersPage"));
const LegacyB2BSolidColoursPage = lazy(() => import("./b2b/pages/LegacyB2BSolidColoursPage"));
const LegacyB2BBuilderGelsPage = lazy(() => import("./b2b/pages/LegacyB2BBuilderGelsPage"));
const ClientPortalProtectedRoute = lazy(() => import('./components/ClientPortalProtectedRoute'));
const ClientPortalLoginPage = lazy(() => import('./pages/ClientPortalLoginPage'));
const ClientPortalDashboardPage = lazy(() => import('./pages/ClientPortalDashboardPage'));
const PortalPendingApprovalPage = lazy(() => import('./pages/PortalPendingApprovalPage'));
const ClientPortalSetPasswordPage = lazy(() => import('./pages/ClientPortalSetPasswordPage'));

// Product Pages
const GelPolishPage = lazy(() => import('./pages/products/GelPolishPage'));
const BuilderAndStructureGelsPage = lazy(() => import('./pages/products/BuilderAndStructureGelsPage'));
const TopAndBasesPage = lazy(() => import('./pages/products/TopAndBasesPage'));
const PolygelAcrygelPage = lazy(() => import('./pages/products/PolygelAcrygelPage'));
const LiquidsAndSolutionsPage = lazy(() => import('./pages/products/LiquidsAndSolutionsPage'));
const NailArtPage = lazy(() => import('./pages/products/NailArtPage'));
const AccessoriesPage = lazy(() => import('./pages/products/AccessoriesPage'));
const JarsAndTubesPage = lazy(() => import('./pages/products/JarsAndTubesPage'));
const CategoryGridTestPage = lazy(() => import('./pages/products/CategoryGridTestPage'));

// Builder Gels Subcategories
const ThreePhasePage = lazy(() => import('./pages/products/builder-gels/ThreePhasePage'));
const ThreeInOnePage = lazy(() => import('./pages/products/builder-gels/ThreeInOnePage'));
const PremiumFiberGlassPage = lazy(() => import('./pages/products/builder-gels/PremiumFiberGlassPage'));
const BiabBuilderInABottlePage = lazy(() => import('./pages/products/builder-gels/BiabBuilderInABottlePage'));
const ThixotropicGelPage = lazy(() => import('./pages/products/builder-gels/ThixotropicGelPage'));
const LiquidPolygelPage = lazy(() => import('./pages/products/LiquidPolygelPage'));

// Top & Bases Subcategories
const TopCoatsPage = lazy(() => import('./pages/products/top-bases/TopCoatsPage'));
const StandardTopCoatsPage = lazy(() => import('./pages/products/top-bases/top-coats/StandardTopCoatsPage'));
const EffectsTopCoatsPage = lazy(() => import('./pages/products/top-bases/top-coats/EffectsTopCoatsPage'));
const BaseCoatsPage = lazy(() => import('./pages/products/top-bases/BaseCoatsPage'));
const ClassicBasePage = lazy(() => import('./pages/products/top-bases/base-coats/ClassicBasePage'));
const RubberBasePage = lazy(() => import('./pages/products/top-bases/base-coats/RubberBasePage'));
const EffectsRubberBasePage = lazy(() => import('./pages/products/top-bases/base-coats/EffectsRubberBasePage'));
const SuperiorBasePage = lazy(() => import('./pages/products/top-bases/base-coats/SuperiorBasePage'));
const NoHeatSpikeBuilderGelPage = lazy(() => import('./pages/products/top-bases/base-coats/NoHeatSpikeBuilderGelPage'));
const BrushOnBuilderPage = lazy(() => import('./pages/products/top-bases/BrushOnBuilderPage'));

// Lamps Category
const LampsPage = lazy(() => import('./pages/products/LampsPage'));
const ComfortPlusL3Page = lazy(() => import('./pages/products/lamps/ComfortPlusL3Page'));
const QuickCureG1Page = lazy(() => import('./pages/products/lamps/QuickCureG1Page'));

// Nail Art Subcategories
const NailArtProductsPage = lazy(() => import('./pages/products/nail-art/NailArtProductsPage'));

// Legacy Product Pages
const TopsBasesPrimersPage = lazy(() => import('./pages/products/TopsBasesPrimersPage'));
const BuilderSystemsPage = lazy(() => import('./pages/products/BuilderSystemsPage'));
const FrenchCollectionPage = lazy(() => import('./pages/products/FrenchCollectionPage'));

// Brand Pages
const GelItUpPage = lazy(() => import('./pages/brands/GelItUpPage'));

import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/certificates-and-compliance" element={<CertificatesPage />} />
          <Route path="/cpnp-compliance-support" element={<CpnpComplianceSupportPage />} />
          <Route path="/distributors-wanted" element={<Navigate to="/our-brands" replace />} />
          <Route path="/client-registration" element={<ClientRegistrationPage />} />
          <Route path="/season-trends" element={<SeasonTrendsPage />} />
          <Route path="/valentines" element={<ValentinesPage />} />
          <Route path="/live-feed" element={<LiveFeedPage />} />
          <Route path="/faq-starting-a-gel-polish-brand" element={<FaqStartBrandPage />} />
          <Route path="/order-form" element={<OrderFormPage />} />
          <Route path="/b2b-top-base" element={<OrderPage categoryKey="topBase" />} />
          <Route path="/b2b-solid-colour" element={<LegacyB2BSolidColoursPage />} />
          <Route path="/b2b-builder-gels" element={<LegacyB2BBuilderGelsPage />} />

          <Route
            path="/b2b"
            element={
              <ClientPortalProtectedRoute>
                <B2BPortalShell />
              </ClientPortalProtectedRoute>
            }
          >
            <Route index element={<B2BDashboard />} />
            <Route path="client-info" element={<B2BClientInfoPage />} />
            <Route path="solid-colours/*" element={<B2BSolidColoursPage />} />
            <Route path="builder-gels/*" element={<B2BBuilderGelsPortalPage />} />
            <Route path="polygels/*" element={<B2BPolygelsPage />} />
            <Route path="extra-strength-bases/*" element={<B2BExtraStrengthBasesPage />} />
            <Route path="checkout" element={<B2BCheckoutPage />} />
            <Route path="orders" element={<B2BOrdersPage />} />
          </Route>

          <Route path="/portal/login" element={<ClientPortalLoginPage />} />
          <Route path="/portal/set-password" element={<ClientPortalSetPasswordPage />} />
          <Route path="/portal/register" element={<Navigate to="/client-registration" replace />} />
          <Route path="/portal/pending-approval" element={<PortalPendingApprovalPage />} />
          <Route
            path="/portal"
            element={
              <ClientPortalProtectedRoute>
                <Navigate to="/b2b" replace />
              </ClientPortalProtectedRoute>
            }
          />
          <Route
            path="/portal/dashboard"
            element={
              <ClientPortalProtectedRoute>
                <ClientPortalDashboardPage />
              </ClientPortalProtectedRoute>
            }
          />

          {/* Products */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/gel-polish" element={<GelPolishPage />} />
          <Route path="/products/category-grid-test" element={<CategoryGridTestPage />} />
          <Route path="/catalog-test" element={<CatalogTest />} />
          <Route path="/cart-test" element={<CartTest />} />
          <Route path="/internal/solid-colour" element={<OrderPage categoryKey="solidColour" />} />

          {/* Builder & Structure Gels */}
          <Route path="/products/builder-and-structure-gels" element={<BuilderAndStructureGelsPage />} />
          <Route path="/products/builder-and-structure-gels/3-phase" element={<ThreePhasePage />} />
          <Route path="/products/builder-and-structure-gels/3-in-1" element={<ThreeInOnePage />} />
          <Route path="/products/builder-and-structure-gels/premium-fiber-glass" element={<PremiumFiberGlassPage />} />
          <Route path="/products/builder-and-structure-gels/no-heat-spike-builder-gel" element={<NoHeatSpikeBuilderGelPage />} />
          <Route path="/products/builder-and-structure-gels/biab-builder-in-a-bottle" element={<BiabBuilderInABottlePage />} />
          <Route path="/products/builder-and-structure-gels/thixotropic-gel" element={<ThixotropicGelPage />} />
          
          {/* Top & Bases */}
          <Route path="/products/top-and-bases" element={<TopAndBasesPage />} />
          <Route path="/products/top-and-bases/top-coats" element={<TopCoatsPage />} />
          <Route path="/products/top-and-bases/top-coats/standard" element={<StandardTopCoatsPage />} />
          <Route path="/products/top-and-bases/top-coats/effects" element={<EffectsTopCoatsPage />} />
          <Route path="/products/top-and-bases/base-coats" element={<BaseCoatsPage />} />
          <Route path="/products/top-and-bases/base-coats/classic" element={<ClassicBasePage />} />
          <Route path="/products/top-and-bases/base-coats/rubber-base" element={<RubberBasePage />} />
          <Route path="/products/top-and-bases/base-coats/rubber-base/effects" element={<EffectsRubberBasePage />} />
          <Route path="/products/top-and-bases/base-coats/superior-base-5-in-1" element={<SuperiorBasePage />} />
          <Route path="/products/top-and-bases/brush-on-builder" element={<BrushOnBuilderPage />} />
          
          {/* Lamps */}
          <Route path="/products/lamps" element={<LampsPage />} />
          <Route path="/products/lamps/comfort-plus-l3" element={<ComfortPlusL3Page />} />
          <Route path="/products/lamps/quick-cure-g1" element={<QuickCureG1Page />} />
          
          {/* Other Product Categories */}
          <Route path="/products/polygel-acrygel" element={<PolygelAcrygelPage />} />
          <Route path="/products/liquid-polygel" element={<LiquidPolygelPage />} />
          <Route path="/products/liquids-and-solutions" element={<LiquidsAndSolutionsPage />} />
          <Route path="/products/nail-art" element={<NailArtPage />} />
          <Route path="/products/nail-art/nail-art-products" element={<NailArtProductsPage />} />
          <Route path="/products/accessories" element={<AccessoriesPage />} />

          {/* Legacy Product Routes (for backwards compatibility) */}
          <Route path="/products/tops-bases-primers" element={<TopsBasesPrimersPage />} />
          <Route path="/products/builder-systems" element={<BuilderSystemsPage />} />
          <Route path="/products/french-collection" element={<FrenchCollectionPage />} />

          {/* Private Label */}
          <Route path="/private-label" element={<PrivateLabelPage />} />
          <Route path="/private-label/bottles" element={<PrivateLabelBottlesPage />} />
          <Route path="/private-label/jars-and-tubes" element={<JarsAndTubesPage />} />
          <Route path="/private-label/bulk" element={<PrivateLabelBulkPage />} />

          {/* Brands */}
          <Route path="/our-brands" element={<GelitupDistributionPage />} />
          <Route path="/our-brands/gel-it-up" element={<GelItUpPage />} />

          {/* Legal Pages */}
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
          <Route path="/privacy-notice-distributors" element={<PrivacyNoticeDistributorsPage />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </>
  );
}

export default App; 
