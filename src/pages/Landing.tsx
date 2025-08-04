import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { suites } from '@/data/suites';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="resort-container py-12 text-center">
        <h1 className="text-5xl sm:text-6xl font-serif text-foreground mb-4">
          Mountain Vista Resort
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover tranquility and luxury in our carefully curated collection of six exclusive suites, 
          each offering a unique perspective on natural beauty and sophisticated comfort.
        </p>
      </div>

      {/* Suites Grid */}
      <div className="resort-container pb-16">
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