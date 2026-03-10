import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../shell/AppShell.jsx";

import HomePage from "../pages/user/HomePage.jsx";
import CategoriesPage from "../pages/user/CategoriesPage.jsx";
import ServicesPage from "../pages/user/ServicesPage.jsx";
import ProviderProfilePage from "../pages/user/ProviderProfilePage.jsx";
import BookingPage from "../pages/user/BookingPage.jsx";
import BookingConfirmationPage from "../pages/user/BookingConfirmationPage.jsx";
import BookingsPage from "../pages/user/BookingsPage.jsx";
import OrderTrackingPage from "../pages/user/OrderTrackingPage.jsx";
import FavoritesPage from "../pages/user/FavoritesPage.jsx";
import ReviewsPage from "../pages/user/ReviewsPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import EditProfilePage from "../pages/user/EditProfilePage.jsx";
import WalletPage from "../pages/user/WalletPage.jsx";
import NotificationsPage from "../pages/user/NotificationsPage.jsx";
import ChatPage from "../pages/user/ChatPage.jsx";

import ProviderDashboard from "../pages/provider/ProviderDashboard.jsx";
import AddServicePage from "../pages/provider/AddServicePage.jsx";
import ManageServicesPage from "../pages/provider/ManageServicesPage.jsx";
import BookingRequestsPage from "../pages/provider/BookingRequestsPage.jsx";
import EarningsPage from "../pages/provider/EarningsPage.jsx";
import AvailabilityPage from "../pages/provider/AvailabilityPage.jsx";
import PortfolioPage from "../pages/provider/PortfolioPage.jsx";
import ProviderReviewsPage from "../pages/provider/ProviderReviewsPage.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageUsersPage from "../pages/admin/ManageUsersPage.jsx";
import ManageProvidersPage from "../pages/admin/ManageProvidersPage.jsx";
import AdminManageServicesPage from "../pages/admin/ManageServicesPage.jsx";
import ReviewModerationPage from "../pages/admin/ReviewModerationPage.jsx";
import AnalyticsDashboard from "../pages/admin/AnalyticsDashboard.jsx";
import DisputeResolutionPage from "../pages/admin/DisputeResolutionPage.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* User area */}
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat" element={<ChatPage />} />

        {/* Provider area */}
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/add-service" element={<AddServicePage />} />
        <Route path="/provider/services" element={<ManageServicesPage />} />
        <Route path="/provider/booking-requests" element={<BookingRequestsPage />} />
        <Route path="/provider/earnings" element={<EarningsPage />} />
        <Route path="/provider/availability" element={<AvailabilityPage />} />
        <Route path="/provider/portfolio" element={<PortfolioPage />} />
        <Route path="/provider/reviews" element={<ProviderReviewsPage />} />

        {/* Admin area */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsersPage />} />
        <Route path="/admin/providers" element={<ManageProvidersPage />} />
        <Route path="/admin/services" element={<AdminManageServicesPage />} />
        <Route path="/admin/reviews" element={<ReviewModerationPage />} />
        <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
        <Route path="/admin/disputes" element={<DisputeResolutionPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

