import { ComponentType, lazy } from 'react';

interface LazyWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  options: LazyWithRetryOptions = {}
) {
  const { maxRetries = 3, retryDelay = 1000 } = options;

  return lazy(() => {
    let retryCount = 0;

    const loadWithRetry = async (): Promise<{ default: T }> => {
      try {
        return await componentImport();
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`Failed to load component, retrying... (${retryCount}/${maxRetries})`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
          
          return loadWithRetry();
        }
        
        // If all retries fail, throw the error
        console.error('Failed to load component after all retries:', error);
        throw error;
      }
    };

    return loadWithRetry();
  });
}