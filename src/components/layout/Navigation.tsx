import { useAuth } from '../../lib/auth';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface NavigationProps {
  onMenuClick: () => void;
}

export function Navigation({ onMenuClick }: NavigationProps) {
  const { signOut, user } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 md:hidden hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <h1 className="text-xl font-bold">Baby Care Tracker</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="hidden md:block text-sm text-gray-700">{user.email}</span>
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                  className="text-sm"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
