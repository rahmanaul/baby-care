import { MainLayout } from './components/layout/MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';
import { AuthProvider } from './lib/auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </MainLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
