import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

const useVisitorTracking = () => {
  const location = useLocation();
  const isInitialized = useRef(false);

  useEffect(() => {
    const initTracking = async () => {
      try {
        const storedVisitorId = localStorage.getItem('visitorId');
        const storedSessionId = sessionStorage.getItem('sessionId');

        const { data } = await api.post('/tracking/init', {
          visitorId: storedVisitorId,
          sessionId: storedSessionId
        });

        if (data.success) {
          localStorage.setItem('visitorId', data.visitorId);
          sessionStorage.setItem('sessionId', data.sessionId);
          isInitialized.current = true;
          logPageView(location.pathname);
        }
      } catch (error) {
        console.error('Analytics init failed:', error);
      }
    };

    if (!isInitialized.current) {
      initTracking();
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) {
      logPageView(location.pathname);
    }
  }, [location.pathname]);

  const logPageView = async (path) => {
    try {
      const visitorId = localStorage.getItem('visitorId');
      const sessionId = sessionStorage.getItem('sessionId');
      
      if (!visitorId || !sessionId) return;

      if (path.startsWith('/admin')) return;

      await api.post('/tracking/event', {
        visitorId,
        sessionId,
        eventType: 'PAGE_VIEW',
        pageUrl: path,
        metadata: { title: document.title }
      });
    } catch (error) {
      console.error('Analytics page view failed:', error);
    }
  };

  const trackEvent = async (eventType, metadata = {}) => {
    try {
      const visitorId = localStorage.getItem('visitorId');
      const sessionId = sessionStorage.getItem('sessionId');
      
      if (!visitorId || !sessionId) return;

      await api.post('/tracking/event', {
        visitorId,
        sessionId,
        eventType,
        pageUrl: window.location.pathname,
        metadata
      });
    } catch (error) {
      console.error('Analytics event failed:', error);
    }
  };

  const identify = async (userId) => {
    try {
      const visitorId = localStorage.getItem('visitorId');
      if (!visitorId || !userId) return;

      await api.post('/tracking/identify', {
        visitorId,
        userId
      });
    } catch (error) {
      console.error('Analytics identify failed:', error);
    }
  };

  return { trackEvent, identify };
};

export default useVisitorTracking;
