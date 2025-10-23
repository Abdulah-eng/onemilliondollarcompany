// src/lib/force-urls.ts
// Force correct URLs for production deployment

export const FORCE_PRODUCTION_URLS = {
  // Production domain
  DOMAIN: 'https://trainwisestudio.com',
  
  // Magic link URLs
  MAGIC_LINK: 'https://trainwisestudio.com/onboarding/step-1',
  PASSWORD_RESET: 'https://trainwisestudio.com/update-password',
  
  // Dashboard URLs
  CUSTOMER_DASHBOARD: 'https://trainwisestudio.com/customer/dashboard',
  COACH_DASHBOARD: 'https://trainwisestudio.com/coach/dashboard',
  
  // Payment URLs
  PAYMENT_SUCCESS: 'https://trainwisestudio.com/customer/settings?status=success',
  PAYMENT_CANCEL: 'https://trainwisestudio.com/customer/settings?status=cancel',
  OFFER_SUCCESS: 'https://trainwisestudio.com/customer/messages?offer_status=paid',
  OFFER_CANCEL: 'https://trainwisestudio.com/customer/messages?offer_status=cancel',
} as const;

export const getProductionUrl = (path: string) => {
  if (import.meta.env.PROD) {
    return `${FORCE_PRODUCTION_URLS.DOMAIN}${path}`;
  }
  return `${window.location.origin}${path}`;
};

export const logUrlUsage = (type: string, url: string) => {
  console.log(`🔗 ${type} URL:`, url);
  
  if (import.meta.env.PROD && !url.includes('trainwisestudio.com')) {
    console.error(`❌ ${type} is not using production domain!`);
  } else if (import.meta.env.PROD && url.includes('trainwisestudio.com')) {
    console.log(`✅ ${type} correctly using production domain`);
  }
};
