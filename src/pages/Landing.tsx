import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { suites } from '@/data/suites';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="resort-container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-serif text-foreground hover:text-primary transition-colors">
              Resort
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="#suites" className="text-foreground hover:text-primary transition-colors">
                Suites
              </Link>
              <Link to="#amenities" className="text-foreground hover:text-primary transition-colors">
                Amenities
              </Link>
              <Link to="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="resort-btn-primary">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-4 mt-4">
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="#suites" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Suites
                </Link>
                <Link 
                  to="#amenities" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Amenities
                </Link>
                <Link 
                  to="#contact" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-foreground hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full resort-btn-primary">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="resort-container py-12 text-center">
        <h1 className="text-5xl sm:text-6xl font-serif text-foreground mb-4">
          Resort
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover tranquility and luxury in our carefully curated collection of six exclusive suites, 
          each offering a unique perspective on natural beauty and sophisticated comfort.
        </p>
      </div>

      {/* Suites Grid */}
      <div id="suites" className="resort-container pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-foreground mb-4">Our Exclusive Suites</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each suite is thoughtfully designed to provide the perfect balance of luxury, comfort, and natural beauty.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suites.map((suite) => (
            <Link
              key={suite.id}
              to={`/suite/${suite.id}`}
              className="group resort-card block"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={suite.image}
                  alt={suite.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {suite.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Sleeps {suite.sleeps}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-lg font-semibold text-foreground">
                      ${suite.pricePerNight}
                      <span className="text-sm font-normal text-muted-foreground">/night</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div id="amenities" className="bg-card/50 py-16">
        <div className="resort-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-foreground mb-4">Resort Amenities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enjoy world-class amenities designed to enhance your stay and create unforgettable memories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏊‍♂️</span>
              </div>
              <h3 className="text-lg font-serif text-foreground mb-2">Infinity Pool</h3>
              <p className="text-muted-foreground">Relax in our heated infinity pool with mountain views</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-lg font-serif text-foreground mb-2">Fine Dining</h3>
              <p className="text-muted-foreground">Experience gourmet cuisine at our award-winning restaurant</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <h3 className="text-lg font-serif text-foreground mb-2">Spa & Wellness</h3>
              <p className="text-muted-foreground">Rejuvenate with our luxury spa treatments and yoga classes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚶‍♂️</span>
              </div>
              <h3 className="text-lg font-serif text-foreground mb-2">Nature Trails</h3>
              <p className="text-muted-foreground">Explore scenic hiking trails and guided nature walks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="resort-container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-foreground mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to experience luxury? Get in touch with our team to plan your perfect getaway.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-serif text-foreground mb-2">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-serif text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground">reservations@mountainvista.com</p>
          </div>
          <div>
            <h3 className="text-lg font-serif text-foreground mb-2">Address</h3>
            <p className="text-muted-foreground">123 Mountain Vista Drive<br />Aspen, CO 81611</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-card">
        <div className="resort-container py-8 text-center">
          <p className="text-muted-foreground">
            Mountain Vista Resort &middot; Where luxury meets nature
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;