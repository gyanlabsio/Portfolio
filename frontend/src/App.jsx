import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded pages
const Home = lazy(() => import("./Pages/Home"));
const Bio = lazy(() => import("./Pages/Bio"));
const Readme = lazy(() => import("./Pages/Readme"));
const Projects = lazy(() => import("./Pages/Projects"));
const ProjectDetails = lazy(() => import("./Pages/ProjectDetails"));
const Blog = lazy(() => import("./Pages/Blog"));
const BlogPost = lazy(() => import("./Pages/BlogPost"));
const Testimonials = lazy(() => import("./Pages/Testimonials"));
const Contact = lazy(() => import("./Pages/Contact"));
const StartProject = lazy(() => import("./Pages/StartProject"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./Pages/TermsConditions"));
const CookiePolicy = lazy(() => import("./Pages/CookiePolicy"));
const NotFound = lazy(() => import("./Pages/NotFound"));

// Admin pages
const Login = lazy(() => import("./Pages/admin/Login"));
const AdminLayout = lazy(() => import("./Pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./Pages/admin/Dashboard"));
const ProjectsAdmin = lazy(() => import("./Pages/admin/ProjectsAdmin"));
const BlogAdmin = lazy(() => import("./Pages/admin/BlogAdmin"));
const ContactsAdmin = lazy(() => import("./Pages/admin/ContactsAdmin"));
const ServicesAdmin = lazy(() => import("./Pages/admin/ServicesAdmin"));
const LeadsAdmin = lazy(() => import("./Pages/admin/LeadsAdmin"));
const CommentsAdmin = lazy(() => import("./Pages/admin/CommentsAdmin"));
const TestimonialsAdmin = lazy(() => import("./Pages/admin/TestimonialsAdmin"));
const AnalyticsAdmin = lazy(() => import("./Pages/admin/AnalyticsAdmin"));
const SettingsAdmin = lazy(() => import("./Pages/admin/SettingsAdmin"));
const SeoAdmin = lazy(() => import("./Pages/admin/SeoAdmin"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#FF0000] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const content = (
    <div className="page-shell">
      <ScrollToTop />
      <AnalyticsTracker />
      {!isAdminRoute && <div className="grain-overlay" />}

      {!isAdminRoute && <Navbar />}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Bio" element={<Bio />} />
          <Route path="/readme" element={<Readme />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetails />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/Testimonials" element={<Testimonials />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/StartProject" element={<StartProject />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="leads" element={<LeadsAdmin />} />
            <Route path="contacts" element={<ContactsAdmin />} />
            <Route path="comments" element={<CommentsAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="analytics" element={<AnalyticsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="seo" element={<SeoAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!isAdminRoute && <Footer />}
    </div>
  );

  return isAdminRoute ? content : <SmoothScroll>{content}</SmoothScroll>;
};

export default App;
