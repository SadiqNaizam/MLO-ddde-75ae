import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, User, Settings, LogOut, Building2 } from 'lucide-react';
import NotificationItem from '@/components/NotificationItem'; // Assuming this path

// Mock data and type for notifications
interface AppNotification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success'; // Expanded based on common NotificationItem props
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: AppNotification[] = [
  { id: '1', type: 'alert', message: 'Unusual login attempt detected on your account.', timestamp: '2m ago', read: false },
  { id: '2', type: 'info', message: 'Your monthly e-statement for July is ready.', timestamp: '1h ago', read: false },
  { id: '3', type: 'success', message: 'Transfer of $500 to John Doe successful.', timestamp: '3h ago', read: true },
  { id: '4', type: 'warning', message: 'Scheduled maintenance on Sunday at 2 AM.', timestamp: '1d ago', read: true },
];


const Header: React.FC = () => {
  console.log('Header loaded');
  const navigate = useNavigate();
  const unreadNotificationsCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add actual logout logic here
    // navigate('/login'); // Example navigation after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">FinBank</span>
        </Link>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions, accounts..."
              className="w-full rounded-md bg-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 min-w-0 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadNotificationsCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm">Notifications</h4>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.length > 0 ? (
                  mockNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      type={notification.type as any} // Cast as any if NotificationItem props differ slightly
                      message={notification.message}
                      timestamp={notification.timestamp}
                      read={notification.read}
                    />
                  ))
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">No new notifications.</p>
                )}
              </div>
              {mockNotifications.length > 0 && (
                 <div className="p-2 border-t text-center">
                    <Button variant="link" size="sm" className="text-primary">View all notifications</Button>
                 </div>
              )}
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="User Avatar" /> {/* Placeholder image */}
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;