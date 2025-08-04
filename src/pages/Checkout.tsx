import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, CreditCard, Calendar, Users } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  
  const [formData, setFormData] = useState({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!booking.suite || !booking.checkIn || !booking.checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">No booking information found</h1>
          <Button onClick={() => navigate('/')} className="resort-btn-primary">
            Return to Suites
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Full name is required';
    }

    if (!formData.guestEmail.trim()) {
      newErrors.guestEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
      newErrors.guestEmail = 'Please enter a valid email address';
    }

    if (!formData.guestPhone.trim()) {
      newErrors.guestPhone = 'Phone number is required';
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updateBooking({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
      });
      
      // In a real app, you would process payment here
      navigate('/confirmation');
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="resort-container py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/suite/${booking.suite.id}`)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Suite Details
          </Button>
          <h1 className="text-4xl font-serif text-foreground">Complete Your Reservation</h1>
        </div>
      </div>

      <div className="resort-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Guest Information & Payment */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Guest Information */}
                <div className="bg-card rounded-xl p-6 border">
                  <h2 className="text-xl font-serif mb-6">Guest Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="guestName" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="guestName"
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange('guestName', e.target.value)}
                        className={cn("resort-input", errors.guestName && "border-destructive")}
                        placeholder="Enter your full name"
                      />
                      {errors.guestName && (
                        <p className="text-sm text-destructive mt-1">{errors.guestName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="guestEmail" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="guestEmail"
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                        className={cn("resort-input", errors.guestEmail && "border-destructive")}
                        placeholder="Enter your email"
                      />
                      {errors.guestEmail && (
                        <p className="text-sm text-destructive mt-1">{errors.guestEmail}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="guestPhone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                        className={cn("resort-input", errors.guestPhone && "border-destructive")}
                        placeholder="Enter your phone number"
                      />
                      {errors.guestPhone && (
                        <p className="text-sm text-destructive mt-1">{errors.guestPhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-serif">Payment Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                        Card Number
                      </label>
                      <Input
                        id="cardNumber"
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        className={cn("resort-input", errors.cardNumber && "border-destructive")}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                          Expiry Date
                        </label>
                        <Input
                          id="expiryDate"
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiry(e.target.value))}
                          className={cn("resort-input", errors.expiryDate && "border-destructive")}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium mb-2">
                          CVC
                        </label>
                        <Input
                          id="cvc"
                          type="text"
                          value={formData.cvc}
                          onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                          className={cn("resort-input", errors.cvc && "border-destructive")}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvc && (
                          <p className="text-sm text-destructive mt-1">{errors.cvc}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full resort-btn-primary text-lg py-4">
                  Confirm & Pay ${booking.totalPrice}
                </Button>
              </form>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-card rounded-xl p-6 border">
                <h2 className="text-xl font-serif mb-6">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                      src={booking.suite.image}
                      alt={booking.suite.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{booking.suite.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Users className="w-4 h-4" />
                      <span>Sleeps {booking.suite.sleeps}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Check-in</span>
                    </div>
                    <p className="font-medium">{format(booking.checkIn!, 'EEEE, MMMM d, yyyy')}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Check-out</span>
                    </div>
                    <p className="font-medium">{format(booking.checkOut!, 'EEEE, MMMM d, yyyy')}</p>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>${booking.suite.pricePerNight} × {booking.nights} nights</span>
                      <span>${booking.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;