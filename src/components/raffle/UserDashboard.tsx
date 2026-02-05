import { Purchase } from '@/types/raffle';
import { X, Ticket, Calendar, CreditCard, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UserDashboardProps {
  purchases: Purchase[];
  onClose: () => void;
}

export function UserDashboard({ purchases, onClose }: UserDashboardProps) {
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const totalNumbers = purchases.reduce((acc, p) => acc + p.numbers.length, 0);
  const totalSpent = purchases.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] glass rounded-2xl shadow-card animate-scale-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold">Meus Números</h2>
            <p className="text-sm text-muted-foreground">Acompanhe suas compras</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-border/50 shrink-0">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalNumbers}</p>
                <p className="text-sm text-muted-foreground">Números comprados</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                <p className="text-sm text-muted-foreground">Total investido</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchases list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-muted-foreground">Nenhuma compra realizada</h3>
              <p className="text-sm text-muted-foreground/70">Selecione números e faça sua primeira compra!</p>
            </div>
          ) : (
            purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="rounded-xl border border-border/50 overflow-hidden transition-all"
              >
                {/* Purchase header */}
                <button
                  onClick={() => setExpandedPurchase(
                    expandedPurchase === purchase.id ? null : purchase.id
                  )}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'p-2 rounded-lg',
                      purchase.status === 'confirmed' ? 'bg-green-500/20' : 'bg-amber-500/20'
                    )}>
                      {purchase.status === 'confirmed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{purchase.numbers.length} números</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(purchase.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gradient">{formatCurrency(purchase.amount)}</span>
                    {expandedPurchase === purchase.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Purchase details */}
                {expandedPurchase === purchase.id && (
                  <div className="p-4 pt-0 space-y-3 animate-fade-in">
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-2">Números desta compra:</p>
                      <div className="flex flex-wrap gap-2">
                        {purchase.numbers.map((num) => (
                          <span
                            key={num}
                            className="px-2 py-1 rounded-md bg-primary/20 border border-primary/30 text-xs font-medium"
                          >
                            {num.toString().padStart(3, '0')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {purchase.confirmedAt ? (
                        <span>Confirmado em {formatDate(purchase.confirmedAt)}</span>
                      ) : (
                        <span>Aguardando confirmação</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
