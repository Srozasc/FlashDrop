import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Merchants from "@/pages/admin/Merchants";
import Drivers from "@/pages/admin/Drivers";
import Orders from "@/pages/admin/Orders";
import Settings from "@/pages/admin/Settings";

import MerchantLayout from "@/layouts/MerchantLayout";
import MerchantDashboard from "@/pages/merchant/Dashboard";
import MerchantProducts from "@/pages/merchant/Products";
import MerchantOrders from "@/pages/merchant/Orders";
import MerchantReports from "@/pages/merchant/Reports";
import MerchantSettings from "@/pages/merchant/Settings";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes - Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="merchants" element={<Merchants />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Merchant Routes */}
          <Route path="/comercio" element={<MerchantLayout />}>
            <Route index element={<Navigate to="/comercio/dashboard" replace />} />
            <Route path="dashboard" element={<MerchantDashboard />} />
            <Route path="products" element={<MerchantProducts />} />
            <Route path="orders" element={<MerchantOrders />} />
            <Route path="reports" element={<MerchantReports />} />
            <Route path="settings" element={<MerchantSettings />} />
          </Route>

          <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
