import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ServicesPage from "./pages/ServicesPage";
import AllServicesPage from "./pages/AllServicesPage";
import OrderServicePage from "./pages/OrderServicePage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import BrandingIdentityPage from "./pages/BrandingIdentityPage";
import BrandingDetailPage from "./pages/BrandingDetailPage";
import WebDevelopmentPage from "./pages/WebDevelopmentPage";
import Animation3DPage from "./pages/Animation3DPage";
import UIUXDesignPage from "./pages/UIUXDesignPage";
import AccountPage from "./pages/AccountPage";
import VerifyOTP from "./pages/VerifyOTP";
import ManagementDashboard from "./pages/ManagementDashboard";
import BlogPage from "./pages/BlogPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ContactPage from "./pages/ContactPage";
import ApplyForEmployee from "./pages/ApplyForEmployee";
import ApplyForPosition from "./pages/ApplyForPosition";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import ChatBot from "./components/ChatBot";
import ChatbotDashboard from "./pages/ChatbotDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="rajkayal-theme-v2">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/management" element={
                <AdminRoute>
                  <ManagementDashboard />
                </AdminRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute>
                  <AllServicesPage />
                </ProtectedRoute>
              } />
              <Route path="/services-overview" element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              } />
              <Route path="/services/order/:serviceName" element={
                <ProtectedRoute>
                  <OrderServicePage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/branding-identity" element={
                <ProtectedRoute>
                  <BrandingIdentityPage />
                </ProtectedRoute>
              } />
              <Route path="/branding-identity/:id" element={
                <ProtectedRoute>
                  <BrandingDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/web-development" element={
                <ProtectedRoute>
                  <WebDevelopmentPage />
                </ProtectedRoute>
              } />
              <Route path="/3d-animation" element={
                <ProtectedRoute>
                  <Animation3DPage />
                </ProtectedRoute>
              } />
              <Route path="/uiux-design" element={
                <ProtectedRoute>
                  <UIUXDesignPage />
                </ProtectedRoute>
              } />
              <Route path="/blog" element={
                <ProtectedRoute>
                  <BlogPage />
                </ProtectedRoute>
              } />
              <Route path="/case-studies" element={
                <ProtectedRoute>
                  <CaseStudiesPage />
                </ProtectedRoute>
              } />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              } />
              <Route path="/apply-employee" element={
                <ProtectedRoute>
                  <ApplyForEmployee />
                </ProtectedRoute>
              } />
              <Route path="/apply-position/:positionId" element={
                <ProtectedRoute>
                  <ApplyForPosition />
                </ProtectedRoute>
              } />
              <Route path="/employee/:id" element={
                <ProtectedRoute>
                  <EmployeeDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/chatbot-dashboard" element={
                <AdminRoute>
                  <ChatbotDashboard />
                </AdminRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
