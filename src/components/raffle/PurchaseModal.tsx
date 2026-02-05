import { Purchase } from '@/types/raffle';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PurchaseModalProps {
  purchase: Purchase;
  pricePerNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PurchaseModal({
  purchase,
  pricePerNumber,
  onConfirm,
  onCancel,
}: PurchaseModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-card animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">Resumo da Compra</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Numbers */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Números selecionados ({purchase.numbers.length})
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {purchase.numbers.map((num) => (
                <span
                  key={num}
                  className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-sm font-medium"
                >
                  {num.toString().padStart(3, '0')}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantidade</span>
              <span>{purchase.numbers.length} números</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor unitário</span>
              <span>{formatCurrency(pricePerNumber)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/30">
              <span>Total a pagar</span>
              <span className="text-gradient">{formatCurrency(purchase.amount)}</span>
            </div>
          </div>

          {/* Info notice */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Ao prosseguir, você será redirecionado para a tela de pagamento PIX.
              Os números serão reservados por 10 minutos.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border/50">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-primary shadow-glow hover:shadow-neon gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Prosseguir para pagamento
          </Button>
        </div>
      </div>
    </div>
  );
}
