import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/protected-route";
import { AppLayout } from "./layouts/app-layout";

const LandingPage = lazy(() => import("./pages/landing-page").then((module) => ({ default: module.LandingPage })));
const AuthPage = lazy(() => import("./pages/auth-page").then((module) => ({ default: module.AuthPage })));
const DashboardPage = lazy(() => import("./pages/dashboard-page").then((module) => ({ default: module.DashboardPage })));
const ChatPage = lazy(() => import("./pages/chat-page").then((module) => ({ default: module.ChatPage })));
const DiseasePage = lazy(() => import("./pages/disease-page").then((module) => ({ default: module.DiseasePage })));
const WeatherPage = lazy(() => import("./pages/weather-page").then((module) => ({ default: module.WeatherPage })));
const MarketPage = lazy(() => import("./pages/market-page").then((module) => ({ default: module.MarketPage })));
const NotificationsPage = lazy(() => import("./pages/notifications-page").then((module) => ({ default: module.NotificationsPage })));
const AnalyticsPage = lazy(() => import("./pages/analytics-page").then((module) => ({ default: module.AnalyticsPage })));

export default function App() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="rounded-3xl bg-white/80 p-6 text-brand-800">Loading FarmGuard AI...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/disease" element={<ProtectedRoute><DiseasePage /></ProtectedRoute>} />
          <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
