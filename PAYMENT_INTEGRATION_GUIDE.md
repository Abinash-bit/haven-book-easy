# Payment Integration Guide for Mountain Vista Resort

This guide provides step-by-step instructions for integrating Stripe and PayPal payment methods into your resort booking application.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Stripe dependencies
npm install @stripe/stripe-js @stripe/react-stripe-js

# Install PayPal dependencies
npm install @paypal/react-paypal-js
```

### 2. Environment Setup

Create a `.env` file in your project root:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live' for production
```

## 🔧 Implementation Steps

### Step 1: Update App.tsx with Payment Providers

```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

// PayPal configuration
const paypalOptions = {
  'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture',
};

const App = () => (
  <PayPalScriptProvider options={paypalOptions}>
    <Elements stripe={stripePromise}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BookingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/suite/:id" element={<SuiteDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BookingProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Elements>
  </PayPalScriptProvider>
);
```

### Step 2: Create Stripe Payment Component

Create `src/components/StripePaymentForm.tsx`:

```tsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Guest Name',
            email: 'guest@example.com',
          },
        },
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Credit/Debit Card</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full resort-btn-primary"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${amount}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
```

### Step 3: Create PayPal Payment Component

Create `src/components/PayPalPaymentForm.tsx`:

```tsx
import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PayPalPaymentFormProps {
  amount: number;
  onSuccess: (order: any) => void;
  onError: (error: string) => void;
}

const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: 'USD',
          },
          description: 'Mountain Vista Resort Booking',
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();
      onSuccess(order);
    } catch (error) {
      onError('Payment failed. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">PayPal Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => onError('PayPal error occurred')}
          style={{ layout: 'vertical' }}
        />
      </CardContent>
    </Card>
  );
};

export default PayPalPaymentForm;
```

### Step 4: Update Checkout Page

The checkout page has already been updated with payment method selection. You can now integrate the actual payment components:

```tsx
// In your Checkout.tsx, replace the payment method sections with:

{paymentMethod === 'stripe' && (
  <StripePaymentForm
    amount={booking.totalPrice}
    onSuccess={(paymentIntent) => {
      updateBooking({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
      });
      navigate('/confirmation');
    }}
    onError={(error) => {
      // Handle error - show toast notification
      console.error('Stripe error:', error);
    }}
    isProcessing={isProcessing}
    setIsProcessing={setIsProcessing}
  />
)}

{paymentMethod === 'paypal' && (
  <PayPalPaymentForm
    amount={booking.totalPrice}
    onSuccess={(order) => {
      updateBooking({
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
      });
      navigate('/confirmation');
    }}
    onError={(error) => {
      // Handle error - show toast notification
      console.error('PayPal error:', error);
    }}
  />
)}
```

## 🔒 Backend Implementation

### Step 5: Create Backend API Endpoints

Create a Node.js/Express backend with these endpoints:

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Stripe Payment Intent Endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingId, guestEmail } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_id: bookingId,
        guest_email: guestEmail,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayPal Webhook Endpoint
app.post('/api/paypal-webhook', async (req, res) => {
  try {
    const { event_type, resource } = req.body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      // Handle successful payment
      const bookingId = resource.custom_id;
      const amount = resource.amount.value;
      
      // Update booking status in your database
      await updateBookingStatus(bookingId, 'confirmed');
      
      // Send confirmation email
      await sendConfirmationEmail(resource.payer.email_address);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment Confirmation Endpoint
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentId, bookingId, paymentMethod } = req.body;

    // Verify payment with payment provider
    let paymentVerified = false;
    
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      paymentVerified = paymentIntent.status === 'succeeded';
    } else if (paymentMethod === 'paypal') {
      // Verify PayPal payment
      paymentVerified = await verifyPayPalPayment(paymentId);
    }

    if (paymentVerified) {
      // Update booking status
      await updateBookingStatus(bookingId, 'confirmed');
      
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

## 🧪 Testing

### Stripe Test Cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`
- **Expired card**: `4000 0000 0000 0069`

### PayPal Testing:
1. Create test accounts in PayPal Developer Dashboard
2. Use sandbox environment for testing
3. Test both successful and failed payment scenarios

## 🔐 Security Best Practices

1. **Always use HTTPS** in production
2. **Never store sensitive payment data** on the client
3. **Implement proper webhook signature verification**
4. **Use environment variables** for API keys
5. **Implement rate limiting** on payment endpoints
6. **Log all payment attempts** for security monitoring
7. **Implement proper error handling** and user feedback
8. **Use PCI-compliant payment processors**
9. **Implement fraud detection measures**
10. **Regular security audits** and updates

## 📋 Environment Variables

Make sure to add these to your `.env` file:

```env
# Frontend
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id

# Backend
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

## 🚀 Production Deployment

1. **Update environment variables** to production keys
2. **Set up webhook endpoints** for payment notifications
3. **Implement proper error handling** and logging
4. **Set up monitoring** for payment failures
5. **Test thoroughly** in production environment
6. **Set up automated backups** for payment data
7. **Implement fraud detection** measures
8. **Set up customer support** for payment issues

## 📞 Support

For payment integration support:
- **Stripe Documentation**: https://stripe.com/docs
- **PayPal Developer Portal**: https://developer.paypal.com/
- **Security Guidelines**: Follow PCI DSS compliance guidelines

## ✅ Checklist

- [ ] Install payment dependencies
- [ ] Set up environment variables
- [ ] Configure payment providers
- [ ] Implement payment components
- [ ] Create backend API endpoints
- [ ] Test payment flows
- [ ] Implement error handling
- [ ] Set up webhooks
- [ ] Deploy to production
- [ ] Monitor payment processing

This integration provides a complete payment solution for your resort booking application with both Stripe and PayPal support! 