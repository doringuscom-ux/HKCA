import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import TopBar from './components/layout/TopBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import GalleryPage from './pages/GalleryPage'
import DisciplinesPage from './pages/DisciplinesPage'
import DisciplineDetails from './pages/DisciplineDetails'
import ContactPage from './pages/ContactPage'
import EventDetailsPage from './pages/EventDetailsPage'
import ResultsPage from './pages/ResultsPage'
import PDFViewerPage from './pages/PDFViewerPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFound from './pages/NotFound'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import RefundPolicyPage from './pages/RefundPolicyPage'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/common/Animations'
import { useLocation } from 'react-router-dom'
import ChatWidget from './components/Chatbot/ChatWidget'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageGallery from './pages/admin/ManageGallery'
import ManageAssets from './pages/admin/ManageAssets'
import ManageEvents from './pages/admin/ManageEvents'
import ManageUsers from './pages/admin/ManageUsers'
import ManageCoupons from './pages/admin/ManageCoupons'
import DailyReport from './pages/admin/DailyReport'
import ManageNews from './pages/admin/ManageNews'
import ManageInquiries from './pages/admin/ManageInquiries'
import ManageChatbot from './pages/admin/ManageChatbot'
import RegistrationManager from './pages/admin/RegistrationManager'

function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Dedicated Full Page Routes */}
          <Route path="/view-pdf" element={<PDFViewerPage />} />

          {/* Public Routes with Main Layout */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-white font-sans text-[#1a2128]">
                <TopBar />
                <Navbar />
                <main>
                  <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                      <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                      <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
                      <Route path="/gallery" element={<PageTransition><GalleryPage /></PageTransition>} />
                      <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                      <Route path="/disciplines" element={<PageTransition><DisciplinesPage /></PageTransition>} />
                      <Route path="/disciplines/:slug" element={<PageTransition><DisciplineDetails /></PageTransition>} />
                      <Route path="/events/:id" element={<PageTransition><EventDetailsPage /></PageTransition>} />
                      <Route path="/results" element={<PageTransition><ResultsPage /></PageTransition>} />
                      <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
                      <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                      <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
                       <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                      <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
                      <Route path="/terms-conditions" element={<PageTransition><TermsConditionsPage /></PageTransition>} />
                      <Route path="/refund-policy" element={<PageTransition><RefundPolicyPage /></PageTransition>} />
                      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Footer />
                <ChatWidget />
              </div>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="assets" element={<ManageAssets />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="news" element={<ManageNews />} />
            <Route path="coupons" element={<ManageCoupons />} />
            <Route path="report" element={<DailyReport />} />
            <Route path="inquiries" element={<ManageInquiries />} />
            <Route path="chatbot" element={<ManageChatbot />} />
            <Route path="registration" element={<RegistrationManager />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  )
}

export default App
