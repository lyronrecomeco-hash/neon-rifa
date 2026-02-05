import { memo } from 'react';
import { cn } from '@/lib/utils';
import { RaffleNumber } from '@/types/raffle';

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
        'raffle-number',
        status === 'available' && 'raffle-number-available',
        status === 'purchased' && 'raffle-number-purchased',
        status === 'selected' && 'raffle-number-selected'
      )}
      aria-label={`Número ${number} - ${status === 'available' ? 'Disponível' : status === 'purchased' ? 'Já comprado' : 'Selecionado'}`}
    >
      <span className="relative z-10">{number.toString().padStart(3, '0')}</span>
      {status === 'selected' && (
        <span className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse" />
      )}
    </button>
  );
});
