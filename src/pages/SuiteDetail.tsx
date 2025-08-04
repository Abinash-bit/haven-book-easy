import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, Users, Check } from 'lucide-react';
import { suites } from '@/data/suites';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';

const SuiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { booking, updateBooking, calculateTotal } = useBooking();
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(booking.checkIn || undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(booking.checkOut || undefined);
  const [selectedImage, setSelectedImage] = useState(0);

  const suite = suites.find(s => s.id === id);

  useEffect(() => {
    if (suite && checkIn && checkOut) {
      const { nights, total } = calculateTotal(suite, checkIn, checkOut);
      updateBooking({ 
        suite, 
        checkIn, 
        checkOut, 
        nights, 
        totalPrice: total 
      });
    }
  }, [suite, checkIn, checkOut, calculateTotal, updateBooking]);

  if (!suite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Suite not found</h1>
          <Button onClick={() => navigate('/')} className="resort-btn-primary">
            Return to Suites
          </Button>
        </div>
      </div>
    );
  }

  const canProceed = checkIn && checkOut && checkIn < checkOut;
  const totalInfo = canProceed ? calculateTotal(suite, checkIn, checkOut) : null;

  const handleReserve = () => {
    if (canProceed) {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="resort-container py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Suites
          </Button>
          <h1 className="text-4xl font-serif text-foreground">{suite.name}</h1>
        </div>
      </div>

      <div className="resort-container py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={suite.gallery[selectedImage]}
                alt={suite.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-3">
              {suite.gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-[4/3] overflow-hidden rounded-lg transition-all duration-200",
                    selectedImage === index ? "ring-2 ring-primary" : "hover:opacity-80"
                  )}
                >
                  <img
                    src={img}
                    alt={`${suite.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details & Booking */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Users className="w-4 h-4" />
                <span>Sleeps {suite.sleeps}</span>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                {suite.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-serif mb-4">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suite.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Widget */}
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="text-xl font-serif mb-6">Reserve Your Stay</h3>
              
              <div className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal resort-input",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal resort-input",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date <= (checkIn || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Price Display */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground">${suite.pricePerNight} × {totalInfo?.nights || 0} nights</span>
                    <span className="text-foreground">${totalInfo?.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${totalInfo?.total || 0}</span>
                  </div>
                </div>

                <Button
                  onClick={handleReserve}
                  disabled={!canProceed}
                  className="w-full resort-btn-primary text-lg py-4"
                >
                  Reserve Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiteDetail;