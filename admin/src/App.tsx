import type React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./contexts/auth-context";

// Layouts
import DashboardLayout from "./layouts/dashboard-layout";

// Pages
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import ProductsPage from "./pages/products";
import ProductDetailPage from "./pages/product-detail";
import OrdersPage from "./pages/orders";
import OrderDetailPage from "./pages/order-detail";
import CustomersPage from "./pages/customers";
import CustomerDetailPage from "./pages/customer-detail";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/not-found";

// Create a client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="ecommerce-admin-theme">
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route
                    path="customers/:id"
                    element={<CustomerDetailPage />}
                  />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
