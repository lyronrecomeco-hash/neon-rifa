import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { NumberCard } from './NumberCard';
import { RaffleNumber } from '@/types/raffle';
import { cn } from '@/lib/utils';

interface NumberGridProps {
  totalNumbers: number;
  getNumberStatus: (num: number) => RaffleNumber['status'];
  onToggleNumber: (num: number) => void;
}

const RANGE_SIZE = 100;

export function NumberGrid({
  totalNumbers,
  getNumberStatus,
  onToggleNumber,
}: NumberGridProps) {
  const [selectedRange, setSelectedRange] = useState<number>(0);
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  // Generate available ranges
  const ranges = useMemo(() => {
    const rangeCount = Math.ceil(totalNumbers / RANGE_SIZE);
    return Array.from({ length: rangeCount }, (_, i) => {
      const start = i * RANGE_SIZE + 1;
      const end = Math.min((i + 1) * RANGE_SIZE, totalNumbers);
      return { start, end, index: i };
    });
  }, [totalNumbers]);

  // Get numbers for current range
  const visibleNumbers = useMemo(() => {
    const range = ranges[selectedRange];
    if (!range) return [];
    return Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);
  }, [selectedRange, ranges]);

  const currentRange = ranges[selectedRange];

  // Count stats for current range
  const rangeStats = useMemo(() => {
    let available = 0;
    let purchased = 0;
    let selected = 0;
    
    visibleNumbers.forEach(num => {
      const status = getNumberStatus(num);
      if (status === 'available') available++;
      else if (status === 'purchased') purchased++;
      else if (status === 'selected') selected++;
    });
    
    return { available, purchased, selected };
  }, [visibleNumbers, getNumberStatus]);

  return (
    <div className="space-y-4">
      {/* Range selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl glass hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Exibindo:</span>
              <span className="font-bold text-gradient">
                {currentRange?.start.toString().padStart(3, '0')} - {currentRange?.end.toString().padStart(3, '0')}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-5 h-5 transition-transform",
              isRangeOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown menu */}
          {isRangeOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl glass shadow-card z-30 max-h-64 overflow-y-auto animate-scale-in">
              {ranges.map((range) => (
                <button
                  key={range.index}
                  onClick={() => {
                    setSelectedRange(range.index);
                    setIsRangeOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg transition-colors",
                    selectedRange === range.index
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-secondary/50"
                  )}
                >
                  <span className="font-medium">
                    {range.start.toString().padStart(3, '0')} - {range.end.toString().padStart(3, '0')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats badges */}
        <div className="flex items-center gap-2 justify-center sm:justify-end">
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
            {rangeStats.available} livres
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
            {rangeStats.purchased} vendidos
          </span>
          {rangeStats.selected > 0 && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-raffle-selected/20 text-raffle-selected border border-raffle-selected/30 shadow-neon">
              {rangeStats.selected} selecionados
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 animate-fade-in">
        {visibleNumbers.map((num) => (
          <NumberCard
            key={num}
            number={num}
            status={getNumberStatus(num)}
            onClick={() => onToggleNumber(num)}
          />
        ))}
      </div>

      {/* Quick navigation */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setSelectedRange(Math.max(0, selectedRange - 1))}
          disabled={selectedRange === 0}
          className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>
        <span className="px-4 py-2 text-sm text-muted-foreground">
          {selectedRange + 1} / {ranges.length}
        </span>
        <button
          onClick={() => setSelectedRange(Math.min(ranges.length - 1, selectedRange + 1))}
          disabled={selectedRange === ranges.length - 1}
          className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
