import "@/index.css";
import "@/App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";

const Home = lazy(() => import("@/pages/Home"));
const ToolsPage = lazy(() => import("@/pages/Tools"));
const ToolPage = lazy(() => import("@/pages/ToolPage"));
const ServicesPage = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Legal = lazy(() => import("@/pages/Legal"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminTools = lazy(() => import("@/pages/admin/AdminTools"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminServices = lazy(() => import("@/pages/admin/AdminServices"));
const AdminContacts = lazy(() => import("@/pages/admin/AdminContacts"));
const AdminPages = lazy(() => import("@/pages/admin/AdminPages"));
const AdminAds = lazy(() => import("@/pages/admin/AdminAds"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminAudit = lazy(() => import("@/pages/admin/AdminAudit"));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CommandPaletteProvider>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/tools/:slug" element={<ToolPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Legal slug="privacy" />} />
                  <Route path="/terms" element={<Legal slug="terms" />} />
                  <Route path="/disclaimer" element={<Legal slug="disclaimer" />} />
                  <Route path="/cookies" element={<Legal slug="cookies" />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<Login />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/tools" element={<AdminTools />} />
                  <Route path="/admin/blog" element={<AdminBlog />} />
                  <Route path="/admin/services" element={<AdminServices />} />
                  <Route path="/admin/contacts" element={<AdminContacts />} />
                  <Route path="/admin/pages" element={<AdminPages />} />
                  <Route path="/admin/ads" element={<AdminAds />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/audit" element={<AdminAudit />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster richColors position="top-right" />
          </CommandPaletteProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
