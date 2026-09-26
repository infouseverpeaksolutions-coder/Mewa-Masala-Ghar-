import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { FoodsStorePage } from './pages/FoodsStorePage';
import { BabyNutritionStorePage } from './pages/BabyNutritionStorePage';
import { PersonalCareStorePage } from './pages/PersonalCareStorePage';
import { JimmiJagguBrandPage } from './pages/JimmiJagguBrandPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { ShippingPolicyPage } from './pages/policies/ShippingPolicyPage';
import { ReturnsPolicyPage } from './pages/policies/ReturnsPolicyPage';
import { PrivacyPolicyPage } from './pages/policies/PrivacyPolicyPage';
import { TermsPage } from './pages/policies/TermsPage';
import { FaqPage } from './pages/policies/FaqPage';

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="flex-1">
        <Routes>
          {/* Landing & Store Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/foods" element={<FoodsStorePage />} />
          <Route path="/baby-nutrition" element={<BabyNutritionStorePage />} />
          <Route path="/personal-care" element={<PersonalCareStorePage />} />
          <Route path="/jimmi-jaggu" element={<JimmiJagguBrandPage />} />

          {/* Catalog & Product Discovery */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/order-success/:orderNo" element={<OrderSuccessPage />} />

          {/* Authentication & User Account */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<AccountPage />} />
          <Route path="/account/orders/:orderNo" element={<AccountPage />} />

          {/* Company & Support */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactPage />} />

          {/* Policies & Help */}
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/faq" element={<FaqPage />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Mini-Cart Drawer and Auth Modal */}
      <CartDrawer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};
