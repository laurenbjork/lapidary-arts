import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Earrings from './pages/Earrings';
import Necklaces from './pages/Necklaces';
import Rings from './pages/Rings';
import Engagement from './pages/Engagement';
import Diamonds from './pages/Diamonds';
import CustomDesign from './pages/CustomDesign';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import NewArrivals from './pages/NewArrivals';
import Shop from './pages/Shop';
import Watches from './pages/Watches';
import Collections from './pages/Collections';
import Designers from './pages/Designers';
import Gifts from './pages/Gifts';
import Lifestyle from './pages/Lifestyle';
import PopUps from './pages/PopUps';
import ProductDetails from './pages/ProductDetails';
import { ProductProvider } from './context/ProductContext';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { CustomerProvider } from './context/CustomerContext';
import { BlogProvider } from './context/BlogContext';
import NewsletterPopup from './components/NewsletterPopup';
import FAQ from './pages/FAQ';
import SizeGuide from './pages/SizeGuide';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <ProductProvider>
        <ContentProvider>
          <CustomerProvider>
            <AppointmentProvider>
            <BlogProvider>
            <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
              <ScrollToTop />
              {!isAdmin && <NewsletterPopup />}
              {!isAdmin && <Navbar />}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/earrings" element={<Earrings />} />
                <Route path="/necklaces" element={<Necklaces />} />
                <Route path="/rings" element={<Rings />} />
                <Route path="/engagement" element={<Engagement />} />
                <Route path="/diamonds" element={<Diamonds />} />
                <Route path="/custom-design" element={<CustomDesign />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                {/* New Main Nav Routes */}
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/watches" element={<Watches />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:collection" element={<Collections />} />
                <Route path="/designers" element={<Designers />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/gifts/:guide" element={<Gifts />} />
                <Route path="/lifestyle" element={<Lifestyle />} />
                <Route path="/pop-ups" element={<PopUps />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
              </Routes>
              </main>
              {!isAdmin && <Footer />}
            </div>
            </BlogProvider>
            </AppointmentProvider>
          </CustomerProvider>
        </ContentProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
