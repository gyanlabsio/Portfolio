import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SplitText = ({ text, className = '', delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const chars = containerRef.current.querySelectorAll('.split-char');
    
    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 20,
        rotateX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power3.out',
        delay: delay,
      }
    );
  }, [text, delay]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${className}`}
      style={{ perspective: '1000px' }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="split-char inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
