import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Home,
  FileText,
  BarChart3,
  UserCheck,
} from 'lucide-react';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { CouponsPage } from './pages/CouponsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CategoriesStoresPage } from './pages/CategoriesStoresPage';
import { CombosPage } from './pages/CombosPage';
import { HomepageBannersPage } from './pages/HomepageBannersPage';
import { ComingSoonPage } from './pages/ComingSoonPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('mmg_admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories-stores"
        element={
          <ProtectedRoute>
            <CategoriesStoresPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/combos"
        element={
          <ProtectedRoute>
            <CombosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coupons"
        element={
          <ProtectedRoute>
            <CouponsPage />
          </ProtectedRoute>
        }
      />

      {/* Phase 3 & 4 Planned Modules (Polished Coming Soon) */}
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <ComingSoonPage
              title="Verified Customer Reviews & Ratings"
              description="Moderate customer testimonials, inspect photo uploads, and analyze verified purchaser feedback per SKU."
              icon={Star}
              phase="Phase 3"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact-messages"
        element={
          <ProtectedRoute>
            <ComingSoonPage
              title="Inquiries & Customer Support"
              description="Manage WhatsApp / email wholesale inquiries, custom hamper requests, and institutional orders."
              icon={MessageSquare}
              phase="Phase 4"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/homepage-manager"
        element={
          <ProtectedRoute>
            <HomepageBannersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages"
        element={
          <ProtectedRoute>
            <ComingSoonPage
              title="CMS Content & Legal Policies"
              description="Manage About Us, APMC Vashi heritage story, FAQ, Shipping, and Returns & Refund terms."
              icon={FileText}
              phase="Phase 4"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ComingSoonPage
              title="Sales & GST Reconciliation Reports"
              description="Generate GSTR-1 state-wise tax reports, fast-moving dry fruit velocity charts, and gross margin breakdowns."
              icon={BarChart3}
              phase="Phase 4"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-roles"
        element={
          <ProtectedRoute>
            <ComingSoonPage
              title="Staff Accounts & Module Permissions"
              description="Assign granular access control to dispatch operators, catalog managers, and customer support representatives."
              icon={UserCheck}
              phase="Phase 4"
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

