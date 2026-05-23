import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#06060b]">
      {/* Sidebar (desktop only) */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {children}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
