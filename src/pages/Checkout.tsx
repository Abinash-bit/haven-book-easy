import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, CreditCard, Calendar, Users, Shield, CheckCircle } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
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

    // Only validate card details if Stripe is selected
    if (paymentMethod === 'stripe') {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateBooking({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
      });
      
      navigate('/confirmation');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateBooking({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
      });
      
      navigate('/confirmation');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (paymentMethod === 'stripe') {
        handleStripePayment();
      } else {
        handlePayPalPayment();
      }
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Guest Information</CardTitle>
                    <CardDescription>
                      Please provide your contact details for the reservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="guestName">Full Name</Label>
                      <Input
                        id="guestName"
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange('guestName', e.target.value)}
                        className={cn("resort-input mt-2", errors.guestName && "border-destructive")}
                        placeholder="Enter your full name"
                      />
                      {errors.guestName && (
                        <p className="text-sm text-destructive mt-1">{errors.guestName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="guestEmail">Email Address</Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                        className={cn("resort-input mt-2", errors.guestEmail && "border-destructive")}
                        placeholder="Enter your email"
                      />
                      {errors.guestEmail && (
                        <p className="text-sm text-destructive mt-1">{errors.guestEmail}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="guestPhone">Phone Number</Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={formData.guestPhone}
                        onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                        className={cn("resort-input mt-2", errors.guestPhone && "border-destructive")}
                        placeholder="Enter your phone number"
                      />
                      {errors.guestPhone && (
                        <p className="text-sm text-destructive mt-1">{errors.guestPhone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Payment Method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'paypal')}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="w-4 h-4" />
                          Credit/Debit Card (Stripe)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                {paymentMethod === 'stripe' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl font-serif">Card Information</CardTitle>
                      </div>
                      <CardDescription>
                        Your payment information is secure and encrypted
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className={cn("resort-input mt-2", errors.cardNumber && "border-destructive")}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiry(e.target.value))}
                            className={cn("resort-input mt-2", errors.expiryDate && "border-destructive")}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            type="text"
                            value={formData.cvc}
                            onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                            className={cn("resort-input mt-2", errors.cvc && "border-destructive")}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvc && (
                            <p className="text-sm text-destructive mt-1">{errors.cvc}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paymentMethod === 'paypal' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <CardTitle className="text-xl font-serif">PayPal Payment</CardTitle>
                      </div>
                      <CardDescription>
                        You'll be redirected to PayPal to complete your payment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Your payment will be processed securely through PayPal's trusted platform.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  className="w-full resort-btn-primary text-lg py-4"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Confirm & Pay $${booking.totalPrice}`
                  )}
                </Button>
              </form>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Security Badge */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>SSL Encrypted Payment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;