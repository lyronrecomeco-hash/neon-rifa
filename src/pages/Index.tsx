import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { RaffleHeader } from '@/components/raffle/RaffleHeader';
import { ImageSlider } from '@/components/raffle/ImageSlider';
import { NumberGrid } from '@/components/raffle/NumberGrid';
import { SelectionPanel } from '@/components/raffle/SelectionPanel';
import { Legend } from '@/components/raffle/Legend';
import { PurchaseModal } from '@/components/raffle/PurchaseModal';
import { PaymentScreen } from '@/components/raffle/PaymentScreen';
import { UserDashboard } from '@/components/raffle/UserDashboard';
import { useRaffle } from '@/hooks/useRaffle';
import { toast } from 'sonner';

type View = 'main' | 'purchase' | 'payment' | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('main');
  
  const {
    config,
    selectedNumbers,
    purchases,
    currentPurchase,
    getNumberStatus,
    toggleNumber,
    selectRandomNumbers,
    clearSelection,
    addNumberManually,
    totalAmount,
    createPurchase,
    confirmPurchase,
    cancelPurchase,
  } = useRaffle({
    pricePerNumber: 10,
    totalNumbers: 1000,
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Concorra a um iPhone 15 Pro Max novinho!',
  });

  const handlePurchaseClick = () => {
    if (selectedNumbers.size === 0) {
      toast.error('Selecione pelo menos um número');
      return;
    }
    createPurchase();
    setCurrentView('purchase');
  };

  const handleProceedToPayment = () => {
    setCurrentView('payment');
  };

  const handleConfirmPayment = () => {
    confirmPurchase();
    toast.success('Parabéns! Seus números foram reservados com sucesso!');
    setCurrentView('main');
  };

  const handleCancelPurchase = () => {
    cancelPurchase();
    setCurrentView('main');
  };

  const totalPurchasedNumbers = purchases.reduce((acc, p) => acc + p.numbers.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <RaffleHeader
        title={config.title}
        purchaseCount={totalPurchasedNumbers}
        onOpenDashboard={() => setCurrentView('dashboard')}
      />

      <main className="flex-1 container py-6 space-y-8">
        {/* Hero section with slider */}
        <section className="animate-fade-in">
          <ImageSlider images={config.images} className="max-h-[400px]" />
        </section>

        {/* Prize info */}
        <section className="text-center space-y-3 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">
            {config.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {config.description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <span className="text-sm text-muted-foreground">Apenas</span>
            <span className="text-lg font-bold text-gradient">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(config.pricePerNumber)}
            </span>
            <span className="text-sm text-muted-foreground">por número</span>
          </div>
        </section>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Numbers section */}
          <div className="lg:col-span-2 space-y-6">
            <Legend />
            <NumberGrid
              totalNumbers={config.totalNumbers}
              getNumberStatus={getNumberStatus}
              onToggleNumber={toggleNumber}
              numbersPerPage={100}
            />
          </div>

          {/* Selection panel - sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SelectionPanel
              selectedCount={selectedNumbers.size}
              selectedNumbers={selectedNumbers}
              totalAmount={totalAmount}
              pricePerNumber={config.pricePerNumber}
              maxNumber={config.totalNumbers}
              onSelectRandom={selectRandomNumbers}
              onAddNumber={addNumberManually}
              onClearSelection={clearSelection}
              onToggleNumber={toggleNumber}
              onPurchase={handlePurchaseClick}
            />
          </div>
        </div>

        {/* Footer info */}
        <section className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © 2024 Rifa Digital. Todos os direitos reservados.
          </p>
        </section>
      </main>

      {/* Modals */}
      {currentView === 'purchase' && currentPurchase && (
        <PurchaseModal
          purchase={currentPurchase}
          pricePerNumber={config.pricePerNumber}
          onConfirm={handleProceedToPayment}
          onCancel={handleCancelPurchase}
        />
      )}

      {currentView === 'payment' && currentPurchase && (
        <PaymentScreen
          purchase={currentPurchase}
          onConfirmPayment={handleConfirmPayment}
          onCancel={handleCancelPurchase}
        />
      )}

      {currentView === 'dashboard' && (
        <UserDashboard
          purchases={purchases}
          onClose={() => setCurrentView('main')}
        />
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Index;
