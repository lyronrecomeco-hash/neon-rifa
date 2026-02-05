import { useState, useEffect, useCallback } from 'react';
import { Purchase } from '@/types/raffle';
import { Copy, CheckCircle2, Clock, Loader2, QrCode } from 'lucide-react';
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
import { toast } from 'sonner';

interface PaymentScreenProps {
  purchase: Purchase;
  onConfirmPayment: () => void;
  onCancel: () => void;
}

export function PaymentScreen({
  purchase,
  onConfirmPayment,
  onCancel,
}: PaymentScreenProps) {
  const [timeLeft, setTimeLeft] = useState(600);
  const [status, setStatus] = useState<'pending' | 'processing' | 'confirmed'>('pending');
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (status !== 'pending') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error('Tempo expirado! Por favor, tente novamente.');
          onCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, onCancel]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(purchase.pixCode || '');
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 2000);
  }, [purchase.pixCode]);

  const handleConfirmPayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('confirmed');
      toast.success('Pagamento confirmado com sucesso!');
      setTimeout(onConfirmPayment, 2000);
    }, 3000);
  };

  const QRCodePlaceholder = () => (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-xl p-3 mx-auto">
      <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-0.5">
        {Array.from({ length: 49 }).map((_, i) => {
          const isCorner = 
            (i < 3 || (i >= 7 && i < 10) || (i >= 14 && i < 17)) ||
            (i >= 4 && i < 7) || (i >= 11 && i < 14) || (i >= 18 && i < 21) ||
            (i >= 28 && i < 31) || (i >= 35 && i < 38) || (i >= 42 && i < 45);
          const isRandom = Math.random() > 0.5;
          return (
            <div
              key={i}
              className={`${isCorner || isRandom ? 'bg-gray-900' : 'bg-white'}`}
            />
          );
        })}
      </div>
      {status === 'confirmed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
      )}
    </div>
  );

  const Content = () => (
    <div className="space-y-4">
      {/* Header info with amount */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          <span className="font-semibold">{formatCurrency(purchase.amount)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className={`font-mono text-sm font-bold ${timeLeft < 60 ? 'text-destructive' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="space-y-2 text-center">
        <QRCodePlaceholder />
        <p className="text-xs text-muted-foreground">
          Escaneie com seu app do banco
        </p>
      </div>

      {/* PIX Code */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Ou copie o código PIX:
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-2 rounded-lg bg-secondary/50 text-xs font-mono break-all max-h-16 overflow-y-auto">
            {purchase.pixCode}
          </div>
          <Button
            onClick={handleCopyCode}
            variant="secondary"
            size="icon"
            className="shrink-0 h-auto"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
        status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30' :
        status === 'processing' ? 'bg-primary/10 border border-primary/30' :
        'bg-green-500/10 border border-green-500/30'
      }`}>
        {status === 'pending' && (
          <>
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Aguardando pagamento</span>
          </>
        )}
        {status === 'processing' && (
          <>
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-xs font-medium text-primary">Processando...</span>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">Confirmado!</span>
          </>
        )}
      </div>
    </div>
  );

  const Actions = () => (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button
        variant="secondary"
        onClick={onCancel}
        disabled={status !== 'pending'}
        className="w-full sm:flex-1"
      >
        Cancelar
      </Button>
      <Button
        onClick={handleConfirmPayment}
        disabled={status !== 'pending'}
        className="w-full sm:flex-1 bg-gradient-primary shadow-glow hover:shadow-neon"
      >
        {status === 'pending' ? 'Já paguei' : status === 'processing' ? 'Verificando...' : 'Concluído!'}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={(open) => !open && status === 'pending' && onCancel()}>
        <DrawerContent className="px-4 pb-6 max-h-[90vh]">
          <DrawerHeader className="text-left px-0">
            <DrawerTitle>Pagamento PIX</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <Content />
          </div>
          <DrawerFooter className="px-0 pt-4">
            <Actions />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && status === 'pending' && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento PIX</DialogTitle>
        </DialogHeader>
        <Content />
        <DialogFooter className="pt-4">
          <Actions />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
