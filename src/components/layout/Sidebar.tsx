import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 bg-white shadow-sm z-30 md:z-0
        `}
      >
        <div className="p-4">
          <div className="flex justify-end md:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              activeProps={{ className: 'bg-gray-100 text-gray-900' }}
              onClick={() => onClose()}
            >
              Dashboard
            </Link>
            <Link
              to="/pumping"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              activeProps={{ className: 'bg-gray-100 text-gray-900' }}
              onClick={() => onClose()}
            >
              Pumping Sessions
            </Link>
            <Link
              to="/dbf"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              activeProps={{ className: 'bg-gray-100 text-gray-900' }}
              onClick={() => onClose()}
            >
              Direct Breastfeeding
            </Link>
            <Link
              to="/diapers"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              activeProps={{ className: 'bg-gray-100 text-gray-900' }}
              onClick={() => onClose()}
            >
              Diaper Changes
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
