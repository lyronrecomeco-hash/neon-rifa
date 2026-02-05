import { Purchase } from '@/types/raffle';
import { X, Ticket, Calendar, CreditCard, CheckCircle2, Clock, Trophy, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserDashboardProps {
  purchases: Purchase[];
  onClose: () => void;
}

export function UserDashboard({ purchases, onClose }: UserDashboardProps) {
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

  // Calculate all unique purchased numbers
  const allPurchasedNumbers = purchases
    .filter(p => p.status === 'confirmed')
    .flatMap(p => p.numbers)
    .sort((a, b) => a - b);

  const totalNumbers = allPurchasedNumbers.length;
  const totalSpent = purchases
    .filter(p => p.status === 'confirmed')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[95vh] glass rounded-2xl shadow-card animate-scale-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Meus Números</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Seus números da sorte</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:p-6 border-b border-border/50 shrink-0">
          <div className="p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{totalNumbers}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Números</p>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Investido</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {totalNumbers === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-lg">Nenhum número comprado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione seus números da sorte e faça sua primeira compra!
              </p>
            </div>
          ) : (
            <>
              {/* All purchased numbers */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Todos os seus números ({totalNumbers})</h3>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {allPurchasedNumbers.map((num) => (
                      <span
                        key={num}
                        className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-sm font-bold text-primary shadow-sm"
                      >
                        {num.toString().padStart(3, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase history */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Histórico de compras</h3>
                </div>
                <div className="space-y-3">
                  {purchases.filter(p => p.status === 'confirmed').map((purchase) => (
                    <div
                      key={purchase.id}
                      className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-medium">{purchase.numbers.length} números</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(purchase.confirmedAt || purchase.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gradient">{formatCurrency(purchase.amount)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {purchase.numbers.map((num) => (
                          <span
                            key={num}
                            className="px-2 py-1 rounded-md bg-secondary/50 text-xs font-medium"
                          >
                            {num.toString().padStart(3, '0')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 shrink-0">
          <p className="text-center text-xs text-muted-foreground">
            Boa sorte no sorteio! 🍀
          </p>
        </div>
      </div>
    </div>
  );
}
