import React from 'react';
import './ScrollIndicator.css';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="scroll-indicator-wrapper">
      <div className="scroll-text">Scroll</div>
      <div className="scroll-arrow">↓</div>
    </div>
  );
};

export default ScrollIndicator;
