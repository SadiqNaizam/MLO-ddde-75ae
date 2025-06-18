import React from 'react';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertOctagon,
  MessageSquare,
  Settings2,
  Bell, // Default icon
  Icon as LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType =
  | 'alert'
  | 'info'
  | 'success'
  | 'warning'
  | 'message'
  | 'system_update';

interface NotificationItemProps {
  id: string | number;
  type: NotificationType;
  message: string;
  timestamp: string; // e.g., "5m ago", "10:30 AM"
  isRead?: boolean;
  onClick?: (id: string | number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  message,
  timestamp,
  isRead = false,
  onClick,
}) => {
  console.log(`NotificationItem loaded: ID ${id}, Type ${type}, Message "${message.substring(0,30)}..."`);

  const iconMap: Record<NotificationType, LucideIcon> = {
    alert: AlertTriangle,
    info: Info,
    success: CheckCircle2,
    warning: AlertOctagon,
    message: MessageSquare,
    system_update: Settings2,
  };

  const iconColorMap: Record<NotificationType, string> = {
    alert: 'text-destructive', // Typically red
    info: 'text-primary', // Typically blue
    success: 'text-emerald-500', // Green
    warning: 'text-amber-500', // Orange/Yellow
    message: 'text-sky-500', // Light blue
    system_update: 'text-slate-500', // Gray
  };

  const IconComponent = iconMap[type] || Bell; // Fallback to Bell icon
  const iconColor = iconColorMap[type] || 'text-foreground';

  const handleItemClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center p-3 space-x-3 border-b dark:border-slate-700 transition-colors',
        !isRead && 'border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10', // Unread: left border and subtle bg
        isRead ? 'bg-transparent dark:bg-transparent' : '',
        onClick ? 'cursor-pointer hover:bg-muted/50 dark:hover:bg-slate-800/60' : 'cursor-default'
      )}
      onClick={onClick ? handleItemClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && handleItemClick() : undefined}
      aria-label={`Notification: ${message}. ${isRead ? 'Read.' : 'Unread.'} Received ${timestamp}. Type: ${type}.`}
    >
      <div className="flex-shrink-0">
        <IconComponent className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
      </div>

      <div className="flex-grow min-w-0"> {/* min-w-0 for text truncation in flex child */}
        <p
          className={cn(
            'text-sm line-clamp-2', // Allow message to wrap up to 2 lines
            isRead ? 'font-normal text-muted-foreground dark:text-slate-400' : 'font-semibold text-foreground dark:text-slate-100'
          )}
        >
          {message}
        </p>
        <p className={cn('text-xs text-muted-foreground dark:text-slate-500 mt-0.5')}>
          {timestamp}
        </p>
      </div>

      {/* Optional: A more explicit unread dot, if the left border isn't enough or for different styling */}
      {/* {!isRead && (
        <div className="ml-auto flex-shrink-0 w-2 h-2 bg-primary rounded-full" aria-label="Unread"></div>
      )} */}
    </div>
  );
};

export default NotificationItem;