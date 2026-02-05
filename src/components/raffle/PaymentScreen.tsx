import { useState, useEffect, useCallback } from 'react';
import { Purchase } from '@/types/raffle';
import { X, Copy, CheckCircle2, Clock, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [status, setStatus] = useState<'pending' | 'processing' | 'confirmed'>('pending');
  const [copied, setCopied] = useState(false);

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
    // Simulating payment confirmation
    setTimeout(() => {
      setStatus('confirmed');
      toast.success('Pagamento confirmado com sucesso!');
      setTimeout(onConfirmPayment, 2000);
    }, 3000);
  };

  // Generate QR Code as SVG (simplified visual representation)
  const QRCodePlaceholder = () => (
    <div className="relative w-48 h-48 bg-white rounded-xl p-4 mx-auto">
      <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-0.5">
        {Array.from({ length: 49 }).map((_, i) => {
          const isCorner = 
            (i < 3 || (i >= 7 && i < 10) || (i >= 14 && i < 17)) || // top-left
            (i >= 4 && i < 7) || (i >= 11 && i < 14) || (i >= 18 && i < 21) || // top-right pattern
            (i >= 28 && i < 31) || (i >= 35 && i < 38) || (i >= 42 && i < 45); // bottom-left
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
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-2xl shadow-card animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pagamento PIX</h2>
              <p className="text-sm text-muted-foreground">{formatCurrency(purchase.amount)}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={status !== 'pending'}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/30">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Expira em:</span>
            <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-destructive' : 'text-foreground'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* QR Code */}
          <div className="space-y-4">
            <QRCodePlaceholder />
            <p className="text-center text-sm text-muted-foreground">
              Escaneie o QR Code com seu app do banco
            </p>
          </div>

          {/* PIX Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Ou copie o código PIX:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 rounded-lg bg-secondary/50 text-xs font-mono break-all max-h-20 overflow-y-auto">
                {purchase.pixCode}
              </div>
              <Button
                onClick={handleCopyCode}
                variant="secondary"
                size="icon"
                className="shrink-0"
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
          <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
            status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30' :
            status === 'processing' ? 'bg-primary/10 border border-primary/30' :
            'bg-green-500/10 border border-green-500/30'
          }`}>
            {status === 'pending' && (
              <>
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-500">Aguardando pagamento</span>
              </>
            )}
            {status === 'processing' && (
              <>
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm font-medium text-primary">Processando pagamento...</span>
              </>
            )}
            {status === 'confirmed' && (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-500">Pagamento confirmado!</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border/50">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={status !== 'pending'}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={status !== 'pending'}
            className="flex-1 bg-gradient-primary shadow-glow hover:shadow-neon"
          >
            {status === 'pending' ? 'Já paguei' : status === 'processing' ? 'Verificando...' : 'Concluído!'}
          </Button>
        </div>
      </div>
    </div>
  );
}
