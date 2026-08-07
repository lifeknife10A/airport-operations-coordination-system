import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, ShieldCheck, Zap, Layers, Plane } from 'lucide-react';
import './AccordionGallery.css';

export interface AccordionGalleryItem {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  link?: string;
  icon?: React.ReactNode;
}

export interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  orientation?: 'horizontal' | 'vertical';
  trigger?: 'hover' | 'click';
  expandRatio?: number;
  grayscale?: boolean;
  height?: string;
  className?: string;
  defaultExpandedIndex?: number;
}

export const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items,
  orientation = 'horizontal',
  trigger = 'hover',
  expandRatio = 3.5,
  grayscale = true,
  height = '480px',
  className = '',
  defaultExpandedIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultExpandedIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleInteraction = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.accordion-card');

    cards.forEach((card, idx) => {
      const isExpanded = idx === activeIndex;
      gsap.to(card, {
        flexGrow: isExpanded ? expandRatio : 1,
        duration: 0.6,
        ease: 'power3.out',
      });

      const contentEl = card.querySelector('.card-expanded-content');
      const badgeEl = card.querySelector('.card-badge');
      if (contentEl) {
        gsap.to(contentEl, {
          opacity: isExpanded ? 1 : 0,
          y: isExpanded ? 0 : 20,
          duration: 0.4,
          delay: isExpanded ? 0.15 : 0,
          ease: 'power2.out',
        });
      }
      if (badgeEl) {
        gsap.to(badgeEl, {
          scale: isExpanded ? 1 : 0.9,
          duration: 0.3,
        });
      }
    });
  }, [activeIndex, expandRatio]);

  return (
    <div
      ref={containerRef}
      className={`accordion-gallery-container ${orientation} ${className}`}
      style={{ height }}
    >
      {items.map((item, index) => {
        const isExpanded = index === activeIndex;
        return (
          <div
            key={item.id}
            className={`accordion-card ${isExpanded ? 'is-expanded' : 'is-collapsed'} ${
              grayscale && !isExpanded ? 'grayscale-effect' : ''
            }`}
            onMouseEnter={trigger === 'hover' ? () => handleInteraction(index) : undefined}
            onClick={trigger === 'click' ? () => handleInteraction(index) : undefined}
          >
            {/* Background Image & Gradient Overlay */}
            <div
              className="card-bg"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="card-overlay" />
            <div className="card-glow" />

            {/* Top Badge */}
            {item.badge && (
              <div className="card-badge">
                <span className="badge-dot" />
                {item.badge}
              </div>
            )}

            {/* Vertical Collapsed Title */}
            {!isExpanded && (
              <div className="card-collapsed-label">
                <span className="collapsed-title">{item.title}</span>
              </div>
            )}

            {/* Expanded Content View */}
            <div className="card-expanded-content">
              {item.subtitle && <span className="card-subtitle">{item.subtitle}</span>}
              <h3 className="card-title">{item.title}</h3>
              {item.description && <p className="card-description">{item.description}</p>}
              
              {item.link && (
                <a href={item.link} className="card-action-btn">
                  <span>Explore Telemetry</span>
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
