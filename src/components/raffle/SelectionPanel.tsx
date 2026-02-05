import { useState } from 'react';
import { Shuffle, Plus, Trash2, ShoppingCart, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SelectionPanelProps {
  selectedCount: number;
  selectedNumbers: Set<number>;
  totalAmount: number;
  pricePerNumber: number;
  maxNumber: number;
  onSelectRandom: (count: number) => void;
  onAddNumber: (num: number) => boolean;
  onClearSelection: () => void;
  onToggleNumber: (num: number) => void;
  onPurchase: () => void;
}

export function SelectionPanel({
  selectedCount,
  selectedNumbers,
  totalAmount,
  pricePerNumber,
  maxNumber,
  onSelectRandom,
  onAddNumber,
  onClearSelection,
  onToggleNumber,
  onPurchase,
}: SelectionPanelProps) {
  const [manualNumber, setManualNumber] = useState('');
  const [error, setError] = useState('');

  const handleAddManual = () => {
    const num = parseInt(manualNumber);
    if (isNaN(num)) {
      setError('Digite um número válido');
      return;
    }
    if (num < 1 || num > maxNumber) {
      setError(`O número deve estar entre 1 e ${maxNumber}`);
      return;
    }
    const success = onAddNumber(num);
    if (success) {
      setManualNumber('');
      setError('');
    } else {
      setError('Número já comprado ou selecionado');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const sortedNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 space-y-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Seus Números
        </h3>
        {selectedCount > 0 && (
          <button
            onClick={onClearSelection}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        )}
      </div>

      {/* Quick random buttons */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Seleção rápida:</label>
        <div className="grid grid-cols-4 gap-2">
          {[2, 5, 10, 20].map((count) => (
            <Button
              key={count}
              variant="secondary"
              size="sm"
              onClick={() => onSelectRandom(count)}
              className="gap-1 text-xs sm:text-sm"
            >
              <Shuffle className="w-3 h-3" />
              +{count}
            </Button>
          ))}
        </div>
      </div>

      {/* Manual input */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Adicionar número específico:</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Ex: 123"
            value={manualNumber}
            onChange={(e) => {
              setManualNumber(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAddManual()}
            className="bg-secondary/50 border-border/50"
            min={1}
            max={maxNumber}
          />
          <Button
            onClick={handleAddManual}
            size="icon"
            variant="secondary"
            className="shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive animate-fade-in">{error}</p>
        )}
      </div>

      {/* Selected numbers display */}
      {selectedCount > 0 && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedCount} número{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-lg bg-secondary/30">
            {sortedNumbers.map((num) => (
              <button
                key={num}
                onClick={() => onToggleNumber(num)}
                className="group flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-medium hover:bg-destructive/20 hover:border-destructive/40 transition-colors"
              >
                <span>{num.toString().padStart(3, '0')}</span>
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="pt-4 border-t border-border/50 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Valor por número</span>
          <span>{formatCurrency(pricePerNumber)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-gradient">{formatCurrency(totalAmount)}</span>
        </div>

        <Button
          onClick={onPurchase}
          disabled={selectedCount === 0}
          className={cn(
            'w-full h-12 text-base font-semibold gap-2 transition-all',
            selectedCount > 0 && 'bg-gradient-primary shadow-glow hover:shadow-neon'
          )}
        >
          <ShoppingCart className="w-5 h-5" />
          {selectedCount === 0 ? 'Selecione números' : `Comprar ${selectedCount} número${selectedCount > 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}
