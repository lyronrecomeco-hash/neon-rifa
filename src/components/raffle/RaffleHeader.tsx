import { Ticket, User, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RaffleHeaderProps {
  title: string;
  purchaseCount: number;
  onOpenDashboard: () => void;
}

export function RaffleHeader({ title, purchaseCount, onOpenDashboard }: RaffleHeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:block">Rifa Digital</span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-center">
          <Trophy className="w-5 h-5 text-primary hidden sm:block" />
          <h1 className="font-semibold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
            {title}
          </h1>
        </div>

        {/* User area */}
        <Button
          variant="ghost"
          onClick={onOpenDashboard}
          className="flex items-center gap-2 hover:bg-primary/10"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">Meus Números</span>
          {purchaseCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {purchaseCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
