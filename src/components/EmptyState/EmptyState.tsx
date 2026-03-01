import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="text-base font-semibold text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground max-w-xs">{description}</div>
      {action}
    </div>
  );
}
