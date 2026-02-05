import { memo } from 'react';
import { cn } from '@/lib/utils';
import { RaffleNumber } from '@/types/raffle';
import { Check } from 'lucide-react';

interface NumberCardProps {
  number: number;
  status: RaffleNumber['status'];
  onClick: () => void;
}

export const NumberCard = memo(function NumberCard({ number, status, onClick }: NumberCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={status === 'purchased'}
      className={cn(
        'relative flex items-center justify-center rounded-lg font-bold text-xs sm:text-sm',
        'transition-all duration-200 cursor-pointer select-none',
        'min-h-[44px] sm:min-h-[48px] border-2',
        status === 'available' && 'bg-secondary/40 border-primary/30 text-foreground/90 hover:bg-primary/20 hover:border-primary/60 hover:shadow-glow active:scale-95',
        status === 'purchased' && 'bg-muted/20 border-border/20 text-muted-foreground/40 cursor-not-allowed',
        status === 'selected' && 'bg-primary/30 border-raffle-selected text-foreground shadow-neon scale-105'
      )}
      style={status === 'selected' ? { borderColor: 'hsl(var(--raffle-selected))' } : undefined}
      aria-label={`Número ${number} - ${status === 'available' ? 'Disponível' : status === 'purchased' ? 'Já comprado' : 'Selecionado'}`}
    >
      <span className="relative z-10">{number.toString().padStart(3, '0')}</span>
      {status === 'selected' && (
        <>
          <span className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-raffle-selected flex items-center justify-center shadow-neon">
            <Check className="w-3 h-3 text-primary-foreground" />
          </span>
        </>
      )}
    </button>
  );
});
