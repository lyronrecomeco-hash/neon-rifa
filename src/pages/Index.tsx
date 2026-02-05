import { useState } from 'react';
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
    description: 'Concorra a um iPhone 15 Pro Max novinho! Escolha seus números da sorte.',
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
    const confirmed = confirmPurchase();
    if (confirmed) {
      toast.success('🎉 Parabéns! Seus números foram confirmados!');
    }
    setCurrentView('main');
  };

  const handleCancelPurchase = () => {
    cancelPurchase();
    setCurrentView('main');
  };

  const totalPurchasedNumbers = purchases
    .filter(p => p.status === 'confirmed')
    .reduce((acc, p) => acc + p.numbers.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <RaffleHeader
        title={config.title}
        purchaseCount={totalPurchasedNumbers}
        onOpenDashboard={() => setCurrentView('dashboard')}
      />

      <main className="flex-1 container py-4 sm:py-6 space-y-6 sm:space-y-8 px-3 sm:px-4">
        {/* Hero section with slider */}
        <section className="animate-fade-in">
          <ImageSlider images={config.images} className="max-h-[250px] sm:max-h-[350px] md:max-h-[400px]" />
        </section>

        {/* Prize info */}
        <section className="text-center space-y-2 sm:space-y-3 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">
            {config.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            {config.description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <span className="text-xs sm:text-sm text-muted-foreground">Apenas</span>
            <span className="text-base sm:text-lg font-bold text-gradient">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(config.pricePerNumber)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">por número</span>
          </div>
        </section>

        {/* Legend */}
        <Legend />

        {/* Main content - Mobile first: panel on top */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Selection panel - Shows first on mobile */}
          <div className="lg:hidden">
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

          {/* Numbers section */}
          <div className="flex-1 lg:flex-[2]">
            <NumberGrid
              totalNumbers={config.totalNumbers}
              getNumberStatus={getNumberStatus}
              onToggleNumber={toggleNumber}
            />
          </div>

          {/* Selection panel - sticky on desktop */}
          <div className="hidden lg:block lg:w-80 lg:sticky lg:top-20 lg:self-start">
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

        {/* Mobile floating buy button when numbers selected */}
        {selectedNumbers.size > 0 && (
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30 animate-slide-up">
            <button
              onClick={handlePurchaseClick}
              className="w-full py-4 rounded-2xl bg-gradient-primary shadow-glow font-bold text-base flex items-center justify-center gap-3"
            >
              <span>Comprar {selectedNumbers.size} número{selectedNumbers.size > 1 ? 's' : ''}</span>
              <span className="px-3 py-1 rounded-full bg-background/20 text-sm">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalAmount)}
              </span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <section className="text-center py-6 sm:py-8 border-t border-border/50">
          <p className="text-xs sm:text-sm text-muted-foreground">
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
    </div>
  );
};

export default Index;
