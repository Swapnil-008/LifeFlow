import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Spinner from './components/ui/Spinner';
import Login from './pages/Login';
import Register from './pages/Register';

// Feature pages are lazy-loaded: the login/auth bundle stays small for the
// first paint, and each dashboard section (with its own charts library
// usage etc.) only downloads when the person actually navigates there.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Habits = lazy(() => import('./pages/Habits'));
const Expenses = lazy(() => import('./pages/Expenses'));
const DailySummary = lazy(() => import('./pages/DailySummary'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function PageFallback() {
  return (
    <div className="p-10 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/tasks"
            element={
              <Suspense fallback={<PageFallback />}>
                <Tasks />
              </Suspense>
            }
          />
          <Route
            path="/habits"
            element={
              <Suspense fallback={<PageFallback />}>
                <Habits />
              </Suspense>
            }
          />
          <Route
            path="/expenses"
            element={
              <Suspense fallback={<PageFallback />}>
                <Expenses />
              </Suspense>
            }
          />
          <Route
            path="/summary"
            element={
              <Suspense fallback={<PageFallback />}>
                <DailySummary />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<PageFallback />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/analytics"
            element={
              <Suspense fallback={<PageFallback />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
