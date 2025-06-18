import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  CreditCard,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelRightClose,
  ChevronsLeft,
  ChevronsRight,
  Building2,
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/accounts', icon: Users, label: 'Accounts' },
  { to: '/move-money', icon: ArrowRightLeft, label: 'Move Money' },
  { to: '/cards', icon: CreditCard, label: 'Cards' }, // Placeholder route
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const CollapsibleSidebar: React.FC = () => {
  console.log('CollapsibleSidebar loaded');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
      {
        'text-primary bg-muted font-medium': isActive,
        'justify-center': isCollapsed,
      }
    );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center border-b px-4 shrink-0 justify-between">
          <Link to="/" className={clsx("flex items-center gap-2 font-bold", isCollapsed && "justify-center w-full")}>
            <Building2 className="h-6 w-6 text-primary" />
            {!isCollapsed && <span className="text-lg">FinBank</span>}
          </Link>
          {!isCollapsed && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
              <ChevronsLeft className="h-5 w-5" />
              <span className="sr-only">Collapse Sidebar</span>
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) =>
            isCollapsed ? (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    className={navLinkClasses}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.exact}
                className={navLinkClasses}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </nav>

        {isCollapsed && (
          <div className="mt-auto p-2 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="w-full">
                  <ChevronsRight className="h-5 w-5" />
                  <span className="sr-only">Expand Sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Expand Sidebar
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
};

export default CollapsibleSidebar;