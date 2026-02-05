export interface RaffleNumber {
  number: number;
  status: 'available' | 'purchased' | 'selected';
  purchasedBy?: string;
  purchasedAt?: Date;
}

export interface Purchase {
  id: string;
  numbers: number[];
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  confirmedAt?: Date;
  pixCode?: string;
}

export interface RaffleConfig {
  pricePerNumber: number;
  totalNumbers: number;
  title: string;
  description: string;
  images: string[];
  drawDate?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  purchases: Purchase[];
}
