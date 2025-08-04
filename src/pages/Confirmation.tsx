import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Users, Mail, Phone } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';

const Confirmation = () => {
  const navigate = useNavigate();
  const { booking, resetBooking } = useBooking();

  if (!booking.suite || !booking.checkIn || !booking.checkOut || !booking.guestName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">No booking confirmation found</h1>
          <Button onClick={() => navigate('/')} className="resort-btn-primary">
            Return to Suites
          </Button>
        </div>
      </div>
    );
  }

  const handleNewBooking = () => {
    resetBooking();
    navigate('/');
  };

  // Generate a mock confirmation number
  const confirmationNumber = `RES${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="resort-container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif text-foreground mb-4">
              Your Reservation is Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for choosing our resort. We look forward to hosting you.
            </p>
          </div>

          {/* Confirmation Details */}
          <div className="bg-card rounded-xl p-8 border mb-8">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
              <p className="text-2xl font-serif font-semibold">{confirmationNumber}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Suite Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Suite Details</h3>
                <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <img
                    src={booking.suite.image}
                    alt={booking.suite.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-medium text-lg">{booking.suite.name}</h4>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Users className="w-4 h-4" />
                  <span>Sleeps {booking.suite.sleeps}</span>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Reservation Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Check-in</span>
                      </div>
                      <p className="font-medium">{format(booking.checkIn!, 'EEEE, MMMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">3:00 PM</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Check-out</span>
                      </div>
                      <p className="font-medium">{format(booking.checkOut!, 'EEEE, MMMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">11:00 AM</p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-1">
                        <span>{booking.nights} nights</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Paid</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-card rounded-xl p-6 border mb-8">
            <h3 className="font-semibold text-lg mb-4">Guest Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {booking.guestName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{booking.guestName}</p>
                  <p className="text-sm text-muted-foreground">Primary Guest</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-13">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{booking.guestEmail}</span>
              </div>
              
              <div className="flex items-center gap-3 ml-13">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{booking.guestPhone}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-muted/50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">1</span>
                </div>
                <p>You will receive a confirmation email shortly at <strong>{booking.guestEmail}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">2</span>
                </div>
                <p>A member of our team will contact you 24 hours before your arrival with check-in details</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">3</span>
                </div>
                <p>Check-in begins at 3:00 PM on your arrival date</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleNewBooking}
              className="resort-btn-primary"
            >
              Book Another Stay
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Print Confirmation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;