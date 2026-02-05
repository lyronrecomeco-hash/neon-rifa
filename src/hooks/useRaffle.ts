import { useState, useCallback, useMemo } from 'react';
import { RaffleNumber, Purchase, RaffleConfig } from '@/types/raffle';

const DEFAULT_CONFIG: RaffleConfig = {
  pricePerNumber: 10,
  totalNumbers: 100,
  title: 'iPhone 15 Pro Max',
  description: 'Concorra a um iPhone 15 Pro Max 256GB novinho! Escolha seus números da sorte.',
  images: [],
};

export function useRaffle(initialConfig: Partial<RaffleConfig> = {}) {
  const [config, setConfig] = useState<RaffleConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [purchasedNumbers, setPurchasedNumbers] = useState<Set<number>>(new Set([3, 7, 15, 22, 45, 67, 89]));
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);

  const getNumberStatus = useCallback((num: number): RaffleNumber['status'] => {
    if (selectedNumbers.has(num)) return 'selected';
    if (purchasedNumbers.has(num)) return 'purchased';
    return 'available';
  }, [selectedNumbers, purchasedNumbers]);

  const toggleNumber = useCallback((num: number) => {
    if (purchasedNumbers.has(num)) return;
    
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(num)) {
        newSet.delete(num);
      } else {
        newSet.add(num);
      }
      return newSet;
    });
  }, [purchasedNumbers]);

  const selectRandomNumbers = useCallback((count: number) => {
    const available: number[] = [];
    for (let i = 1; i <= config.totalNumbers; i++) {
      if (!purchasedNumbers.has(i) && !selectedNumbers.has(i)) {
        available.push(i);
      }
    }

    const shuffled = available.sort(() => Math.random() - 0.5);
    const toSelect = shuffled.slice(0, Math.min(count, available.length));
    
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      toSelect.forEach(n => newSet.add(n));
      return newSet;
    });
  }, [config.totalNumbers, purchasedNumbers, selectedNumbers]);

  const clearSelection = useCallback(() => {
    setSelectedNumbers(new Set());
  }, []);

  const addNumberManually = useCallback((num: number): boolean => {
    if (num < 1 || num > config.totalNumbers) return false;
    if (purchasedNumbers.has(num)) return false;
    
    setSelectedNumbers(prev => new Set(prev).add(num));
    return true;
  }, [config.totalNumbers, purchasedNumbers]);

  const totalAmount = useMemo(() => {
    return selectedNumbers.size * config.pricePerNumber;
  }, [selectedNumbers.size, config.pricePerNumber]);

  const createPurchase = useCallback((): Purchase => {
    const purchase: Purchase = {
      id: `PUR-${Date.now()}`,
      numbers: Array.from(selectedNumbers).sort((a, b) => a - b),
      amount: totalAmount,
      status: 'pending',
      createdAt: new Date(),
      pixCode: generatePixCode(),
    };
    setCurrentPurchase(purchase);
    return purchase;
  }, [selectedNumbers, totalAmount]);

  const confirmPurchase = useCallback(() => {
    if (!currentPurchase) return;

    const confirmedPurchase: Purchase = {
      ...currentPurchase,
      status: 'confirmed',
      confirmedAt: new Date(),
    };

    setPurchases(prev => [...prev, confirmedPurchase]);
    setPurchasedNumbers(prev => {
      const newSet = new Set(prev);
      currentPurchase.numbers.forEach(n => newSet.add(n));
      return newSet;
    });
    setSelectedNumbers(new Set());
    setCurrentPurchase(null);

    return confirmedPurchase;
  }, [currentPurchase]);

  const cancelPurchase = useCallback(() => {
    setCurrentPurchase(null);
  }, []);

  const updateConfig = useCallback((updates: Partial<RaffleConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    config,
    updateConfig,
    purchasedNumbers,
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
  };
}

function generatePixCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '00020126580014BR.GOV.BCB.PIX0136';
  for (let i = 0; i < 36; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '5204000053039865802BR5925RIFA DIGITAL6009SAO PAULO62070503***6304';
  return code;
}
