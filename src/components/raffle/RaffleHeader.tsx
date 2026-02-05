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
      <div className="container flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-primary shadow-glow">
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm sm:text-lg">Rifa Digital</span>
        </div>

        {/* Title - hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-2 text-center">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h1 className="font-semibold text-xs sm:text-base truncate max-w-[150px] md:max-w-none">
            {title}
          </h1>
        </div>

        {/* User area */}
        <Button
          variant="ghost"
          onClick={onOpenDashboard}
          className="flex items-center gap-1.5 sm:gap-2 hover:bg-primary/10 px-2 sm:px-4 h-9 sm:h-10"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Meus Números</span>
          {purchaseCount > 0 && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold min-w-[20px] text-center">
              {purchaseCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
