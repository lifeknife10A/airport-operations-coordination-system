import React from 'react';
import './Hero.css';
import HeroVideo from './HeroVideo';
import HeroContent from './HeroContent';
import FlightTracker from './FlightTracker';
import { Particles } from '../../reactbits';

const Hero: React.FC = () => {
  return (
    <div className="hero-track">
      <div className="hero-container dark-theme">
        <HeroVideo />
        <Particles particleCount={40} particleColor="rgba(56, 189, 248, 0.25)" />
        <HeroContent />
        <FlightTracker />
      </div>
    </div>
  );
};

export default Hero;
