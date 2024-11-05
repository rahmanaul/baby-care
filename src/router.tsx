import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { PumpingPage } from './pages/PumpingPage';
import { DBFPage } from './pages/DBFPage';
import { DiapersPage } from './pages/DiapersPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import App from './App';
import { useAuth } from './lib/auth';
import { Navigate } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: App,
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const pumpingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pumping',
  component: () => (
    <ProtectedRoute>
      <PumpingPage />
    </ProtectedRoute>
  ),
});

const dbfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dbf',
  component: () => (
    <ProtectedRoute>
      <DBFPage />
    </ProtectedRoute>
  ),
});

const diapersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/diapers',
  component: () => (
    <ProtectedRoute>
      <DiapersPage />
    </ProtectedRoute>
  ),
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signin',
  component: () => (
    <AuthRoute>
      <SignInPage />
    </AuthRoute>
  ),
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signup',
  component: () => (
    <AuthRoute>
      <SignUpPage />
    </AuthRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  pumpingRoute,
  dbfRoute,
  diapersRoute,
  signInRoute,
  signUpRoute,
]);

export const router = createRouter({ routeTree });
