import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Suite {
  id: string;
  name: string;
  sleeps: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  image: string;
  gallery: Array<{
    src: string;
    alt: string;
  }>;
}

export interface BookingDetails {
  suite: Suite | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  nights: number;
}

interface BookingContextType {
  booking: BookingDetails;
  updateBooking: (updates: Partial<BookingDetails>) => void;
  calculateTotal: (suite: Suite, checkIn: Date, checkOut: Date) => { nights: number; total: number };
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBooking: BookingDetails = {
  suite: null,
  checkIn: null,
  checkOut: null,
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  totalPrice: 0,
  nights: 0,
};

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [booking, setBooking] = useState<BookingDetails>(initialBooking);

  const updateBooking = (updates: Partial<BookingDetails>) => {
    setBooking(prev => ({ ...prev, ...updates }));
  };

  const calculateTotal = (suite: Suite, checkIn: Date, checkOut: Date) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const total = nights * suite.pricePerNight;
    return { nights, total };
  };

  const resetBooking = () => {
    setBooking(initialBooking);
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, calculateTotal, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};