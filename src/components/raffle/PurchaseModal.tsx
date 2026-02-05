import { Purchase } from '@/types/raffle';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Numbers */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Números selecionados ({purchase.numbers.length})
        </h3>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-lg bg-secondary/30">
          {purchase.numbers.map((num) => (
            <span
              key={num}
              className="px-2 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-medium"
            >
              {num.toString().padStart(3, '0')}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-2 pt-3 border-t border-border/50">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quantidade</span>
          <span>{purchase.numbers.length} números</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Valor unitário</span>
          <span>{formatCurrency(pricePerNumber)}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-border/30">
          <span>Total</span>
          <span className="text-gradient">{formatCurrency(purchase.amount)}</span>
        </div>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Os números serão reservados por 10 minutos após prosseguir.
        </p>
      </div>
    </div>
  );

  const Actions = () => (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button
        variant="secondary"
        onClick={onCancel}
        className="w-full sm:flex-1"
      >
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        className="w-full sm:flex-1 bg-gradient-primary shadow-glow hover:shadow-neon gap-2"
      >
        <CreditCard className="w-4 h-4" />
        <span>Pagar</span>
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={(open) => !open && onCancel()}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-left px-0">
            <DrawerTitle>Resumo da Compra</DrawerTitle>
          </DrawerHeader>
          <Content />
          <DrawerFooter className="px-0 pt-4">
            <Actions />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resumo da Compra</DialogTitle>
        </DialogHeader>
        <Content />
        <DialogFooter className="pt-4">
          <Actions />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
