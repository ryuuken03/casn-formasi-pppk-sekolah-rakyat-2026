import { useState, useEffect, useRef } from 'react';

const ScrollToTop: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);
  const showScrollRef = useRef(false);

  useEffect(() => {
    const handler = () => {
      const shouldShow = window.pageYOffset > 400;
      if (shouldShow !== showScrollRef.current) {
        showScrollRef.current = shouldShow;
        setShowScroll(shouldShow);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScroll) return null;

  return (
    <button
      className="scroll-to-top"
      onClick={scrollToTop}
      title="Kembali ke atas"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTop;
