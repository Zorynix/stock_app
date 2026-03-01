import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ServiceCardProps {
  name: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  delay?: number;
}

export function ServiceCard({
  name,
  description,
  icon,
  iconBg,
  onClick,
  disabled = false,
  badge,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 bg-card border border-card-border rounded-2xl transition-colors',
        !disabled && 'cursor-pointer hover:bg-secondary active:scale-[0.98]',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</div>
      </div>
      {badge && <Badge variant="info">{badge}</Badge>}
      {!disabled && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
    </div>
  );
}
