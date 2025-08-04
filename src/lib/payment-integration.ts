// Payment Integration Guide for Stripe and PayPal
// This file contains the actual integration code for production use

// ============================================================================
// STRIPE INTEGRATION
// ============================================================================

// 1. Install Stripe dependencies:
// npm install @stripe/stripe-js @stripe/react-stripe-js

// 2. Initialize Stripe (in your main App.tsx or a config file):
/*
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key_here');

// Wrap your app with Stripe provider
import { Elements } from '@stripe/react-stripe-js';

const App = () => (
  <Elements stripe={stripePromise}>
    <YourApp />
  </Elements>
);
*/

// 3. Stripe Payment Component:
/*
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create payment intent on your backend
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

      // 2. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
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
    <form onSubmit={handleSubmit}>
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
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};
*/

// ============================================================================
// PAYPAL INTEGRATION
// ============================================================================

// 1. Install PayPal dependencies:
// npm install @paypal/react-paypal-js

// 2. Initialize PayPal (in your main App.tsx):
/*
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  'client-id': 'your_paypal_client_id_here',
  currency: 'USD',
  intent: 'capture',
};

const App = () => (
  <PayPalScriptProvider options={initialOptions}>
    <YourApp />
  </PayPalScriptProvider>
);
*/

// 3. PayPal Payment Component:
/*
import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalPaymentForm = ({ amount, onSuccess, onError }) => {
  const createOrder = (data, actions) => {
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

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      onSuccess(order);
    } catch (error) {
      onError('Payment failed. Please try again.');
    }
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={(err) => onError('PayPal error occurred')}
      style={{ layout: 'vertical' }}
    />
  );
};
*/

// ============================================================================
// BACKEND API ENDPOINTS (Node.js/Express Example)
// ============================================================================

/*
// 1. Stripe Payment Intent Endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_id: req.body.bookingId,
        guest_email: req.body.guestEmail,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. PayPal Webhook Endpoint
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

// 3. Payment Confirmation Endpoint
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
*/

// ============================================================================
// ENVIRONMENT VARIABLES (.env file)
// ============================================================================

/*
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live' for production

# Database Configuration
DATABASE_URL=your_database_connection_string
*/

// ============================================================================
// ERROR HANDLING AND VALIDATION
// ============================================================================

export const validatePaymentData = (data: any) => {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Invalid amount');
  }

  if (!data.currency) {
    errors.push('Currency is required');
  }

  if (!data.guestEmail) {
    errors.push('Guest email is required');
  }

  return errors;
};

export const handlePaymentError = (error: any) => {
  console.error('Payment error:', error);
  
  // Map common errors to user-friendly messages
  const errorMessages: Record<string, string> = {
    'card_declined': 'Your card was declined. Please try a different card.',
    'insufficient_funds': 'Insufficient funds. Please try a different payment method.',
    'expired_card': 'Your card has expired. Please use a different card.',
    'invalid_cvc': 'Invalid CVC. Please check your card details.',
    'processing_error': 'Payment processing error. Please try again.',
    'network_error': 'Network error. Please check your connection and try again.',
  };

  return errorMessages[error.code] || 'Payment failed. Please try again.';
};

// ============================================================================
// SECURITY BEST PRACTICES
// ============================================================================

/*
1. Always use HTTPS in production
2. Never store sensitive payment data on the client
3. Implement proper webhook signature verification
4. Use environment variables for API keys
5. Implement rate limiting on payment endpoints
6. Log all payment attempts for security monitoring
7. Implement proper error handling and user feedback
8. Use PCI-compliant payment processors
9. Implement fraud detection measures
10. Regular security audits and updates
*/

// ============================================================================
// TESTING
// ============================================================================

/*
// Stripe Test Cards:
// Success: 4242 4242 4242 4242
// Decline: 4000 0000 0000 0002
// Insufficient funds: 4000 0000 0000 9995

// PayPal Test Accounts:
// Create test accounts in PayPal Developer Dashboard
// Use sandbox environment for testing
*/

export default {
  validatePaymentData,
  handlePaymentError,
}; 