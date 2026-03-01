import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StubPageProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  features: { icon: ReactNode; text: string }[];
}

export function StubPage({ title, description, icon, iconBg, features }: StubPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white"
          style={{ background: iconBg }}
        >
          {icon}
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl font-bold text-foreground">{title}</span>
            <Badge variant="info">Скоро</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-2 text-left">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-card border border-card-border rounded-xl">
              <div className="text-muted-foreground shrink-0">{feature.icon}</div>
              <span className="text-sm text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        <Button variant="outline" size="lg" onClick={() => navigate('/')}>
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
