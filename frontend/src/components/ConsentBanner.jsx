import React, { useState } from 'react';
import api from '../api';

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(!localStorage.getItem('cookieConsent'));

  const handleConsent = async (status) => {
    try {
      const visitorId = localStorage.getItem('visitorId');
      if (visitorId) {
        await api.post('/tracking/consent', { visitorId, consentStatus: status });
      }
      localStorage.setItem('cookieConsent', status);
      setShowBanner(false);
    } catch (error) {
      console.error('Failed to update consent', error);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 md:p-6  flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-1 max-w-4xl">
        <h3 className="font-semibold mb-1">We value your privacy</h3>
        <p className="text-sm text-gray-300">
          We use strictly necessary cookies to make our site work. We'd also like to set optional analytics cookies to help us improve it. We won't set optional cookies unless you enable them.
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => handleConsent('denied')}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-none transition-colors border border-gray-700"
        >
          Decline Optional
        </button>
        <button
          onClick={() => handleConsent('granted')}
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-none transition-colors"
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
