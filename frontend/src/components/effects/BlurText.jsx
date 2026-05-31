import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BlurText = ({ text, className = '', delay = 0 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      elementRef.current,
      {
        filter: 'blur(10px)',
        opacity: 0,
        y: 10,
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: delay,
      }
    );
  }, [text, delay]);

  return (
    <span ref={elementRef} className={`inline-block ${className}`}>
      {text}
    </span>
  );
};

export default BlurText;
