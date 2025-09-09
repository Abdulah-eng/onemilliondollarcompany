import React, { ComponentType, lazy } from 'react';

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

// Error fallback component for lazy-loaded sections
export const LazyLoadError: React.FC<{ error?: Error; retry?: () => void }> = ({ 
  error, 
  retry 
}) => (
  <div className="py-16 flex flex-col items-center justify-center text-center">
    <div className="max-w-md space-y-4">
      <div className="text-muted-foreground">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm">This section couldn't load properly.</p>
        {retry && (
          <button 
            onClick={retry}
            className="mt-3 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);