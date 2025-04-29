import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useMobileMenu } from "@/lib/MobileMenuContext";
import { useMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";

interface SidebarProps {
  activeRoute: string;
}

export default function Sidebar({ activeRoute }: SidebarProps) {
  const { t } = useTranslation();
  const { isMenuOpen, closeMenu } = useMobileMenu();
  const isMobile = useMobile();

  // If on mobile and menu is not open, don't render
  if (isMobile && !isMenuOpen) return null;

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-primary flex items-center">
          <i className="fas fa-comments mr-2"></i>
          DesignResponder
        </h1>
      </div>
      
      <nav className="p-2">
        <div className="mb-4">
          <div className="sidebar-category">Main Sections</div>
          <Link href="/profile" className={`sidebar-link ${activeRoute === '/profile' ? 'active' : ''}`}>
            <i className="fas fa-user sidebar-icon"></i>
            Profile
          </Link>
          <Link href="/community" className={`sidebar-link ${activeRoute === '/community' ? 'active' : ''}`}>
            <i className="fas fa-comments sidebar-icon"></i>
            Community Chat
          </Link>
          <Link href="/chores" className={`sidebar-link ${activeRoute === '/chores' ? 'active' : ''}`}>
            <i className="fas fa-tasks sidebar-icon"></i>
            Household Chores
          </Link>
          <Link href="/banking" className={`sidebar-link ${activeRoute === '/banking' ? 'active' : ''}`}>
            <i className="fas fa-piggy-bank sidebar-icon"></i>
            Banking & Finance
          </Link>
          <Link href="/kitchen" className={`sidebar-link ${activeRoute === '/kitchen' ? 'active' : ''}`}>
            <i className="fas fa-utensils sidebar-icon"></i>
            Kitchen (Coming Soon)
          </Link>
        </div>
        
        <div className="mb-4">
          <div className="sidebar-category">Quick Access</div>
          <Link href="/goals" className="sidebar-link">
            <i className="fas fa-bullseye sidebar-icon"></i>
            Goals
          </Link>
          <Link href="/schedule" className="sidebar-link">
            <i className="fas fa-calendar sidebar-icon"></i>
            Schedule
          </Link>
          <Link href="/points" className="sidebar-link">
            <i className="fas fa-star sidebar-icon"></i>
            Points & Rewards
          </Link>
        </div>
        
        <div className="mb-4">
          <div className="sidebar-category">Settings</div>
          <Link href="/settings" className="sidebar-link">
            <i className="fas fa-cog sidebar-icon"></i>
            Preferences
          </Link>
          <Link href="/settings/notifications" className="sidebar-link">
            <i className="fas fa-bell sidebar-icon"></i>
            Notifications
          </Link>
        </div>
      </nav>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-neutral-400 bg-opacity-50 z-50">
        <div className="bg-white w-64 h-full overflow-y-auto">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-primary">DesignResponder</h1>
            <button className="text-neutral-400" onClick={closeMenu}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-2">
            {sidebarContent}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <aside className="bg-white w-64 border-r border-neutral-200 hidden md:block overflow-y-auto flex-shrink-0">
      {sidebarContent}
    </aside>
  );
}
