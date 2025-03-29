import React, { ReactNode, useState, useEffect, useRef } from 'react';

interface TooltipProps {
  children: ReactNode; // The trigger element
  content: ReactNode;  // The tooltip content as JSX
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  showArrow?: boolean; // New prop to control arrow visibility
}

const Tooltip = ({ 
  children, 
  content,
  position = 'top', 
  className = '',
  showArrow = true // Default to showing the arrow
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tooltipStyles, setTooltipStyles] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle clicks outside the tooltip to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible]);

  // Calculate tooltip position
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !containerRef.current) return;

    const tooltip = tooltipRef.current;
    const container = containerRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Position styles
    let newStyles: React.CSSProperties = {};

    switch (position) {
      case 'top':
        newStyles = {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
        break;
      case 'bottom':
        newStyles = {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
        break;
      case 'left':
        newStyles = {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
        break;
      case 'right':
        newStyles = {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
        break;
    }

    // Adjust for viewport boundaries
    if (tooltip && container) {
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Check right edge
      if (tooltipRect.right > viewportWidth) {
        if (position === 'top' || position === 'bottom') {
          const overflowAmount = tooltipRect.right - viewportWidth;
          newStyles.transform = `translateX(calc(-50% - ${overflowAmount}px))`;
        } else if (position === 'right') {
          newStyles.left = 'auto';
          newStyles.right = '100%';
          newStyles.marginLeft = '0';
          newStyles.marginRight = '8px';
        }
      }
      
      // Check left edge
      if (tooltipRect.left < 0) {
        if (position === 'top' || position === 'bottom') {
          const overflowAmount = -tooltipRect.left;
          newStyles.transform = `translateX(calc(-50% + ${overflowAmount}px))`;
        } else if (position === 'left') {
          newStyles.right = 'auto';
          newStyles.left = '100%';
          newStyles.marginRight = '0';
          newStyles.marginLeft = '8px';
        }
      }
      
      // Check bottom edge
      if (tooltipRect.bottom > viewportHeight) {
        if (position === 'bottom') {
          newStyles.top = 'auto';
          newStyles.bottom = '100%';
          newStyles.marginTop = '0';
          newStyles.marginBottom = '8px';
        } else if (position === 'left' || position === 'right') {
          const overflowAmount = tooltipRect.bottom - viewportHeight;
          newStyles.transform = `translateY(calc(-50% - ${overflowAmount}px))`;
        }
      }
      
      // Check top edge
      if (tooltipRect.top < 0) {
        if (position === 'top') {
          newStyles.bottom = 'auto';
          newStyles.top = '100%';
          newStyles.marginBottom = '0';
          newStyles.marginTop = '8px';
        } else if (position === 'left' || position === 'right') {
          const overflowAmount = -tooltipRect.top;
          newStyles.transform = `translateY(calc(-50% + ${overflowAmount}px))`;
        }
      }
    }

    setTooltipStyles(newStyles);
  }, [isVisible, position]);

  // Generate arrow styles based on position
  const getArrowStyles = (): React.CSSProperties => {
    const baseArrowStyles: React.CSSProperties = {
      position: 'absolute',
      width: '0',
      height: '0',
      borderStyle: 'solid',
    };

    switch (position) {
      case 'top':
        return {
          ...baseArrowStyles,
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 6px 0 6px',
          borderColor: '#1f2937 transparent transparent transparent',
        };
      case 'bottom':
        return {
          ...baseArrowStyles,
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 6px 6px 6px',
          borderColor: 'transparent transparent #1f2937 transparent',
        };
      case 'left':
        return {
          ...baseArrowStyles,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 0 6px 6px',
          borderColor: 'transparent transparent transparent #1f2937',
        };
      case 'right':
        return {
          ...baseArrowStyles,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 6px 6px 0',
          borderColor: 'transparent #1f2937 transparent transparent',
        };
      default:
        return baseArrowStyles;
    }
  };

  return (
    <div 
      className="relative inline-block"
      ref={containerRef}
    >
      <div
        className="cursor-pointer"
        onMouseEnter={() => !isMobile && setIsVisible(true)}
        onMouseLeave={() => !isMobile && setIsVisible(false)}
        onClick={() => isMobile && setIsVisible(!isVisible)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          style={tooltipStyles}
          className={`absolute z-50 bg-gray-800 text-white text-xs rounded py-2 px-3 ${className}`}
        >
          {content}
          {showArrow && <div style={getArrowStyles()} />}
        </div>
      )}
    </div>
  );
};

export default Tooltip;