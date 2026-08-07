import React from 'react';
import './HeroContent.css';
import { ShinyText } from '../../reactbits';

const HeroContent: React.FC = () => {
  return (
    <div className="hero-content-wrapper dark-theme">
      <h1 className="hero-heading">
        <ShinyText text="SAPHIRE INTERNATIONAL" speed={4} />
      </h1>
      <h2 className="hero-subheading">Next-Gen Airport Operations & Coordination</h2>
    </div>
  );
};

export default HeroContent;
