import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true }); // When routing, we usually want it instant so the page doesn't look like it's rewinding
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
