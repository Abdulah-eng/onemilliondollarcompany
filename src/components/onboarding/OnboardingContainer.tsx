import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface OnboardingContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  showBack?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export const OnboardingContainer = ({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps = 4,
  showBack = true,
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  isLoading = false,
}: OnboardingContainerProps) => {
  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col">
      {/* Progress Bar */}
      {currentStep && (
        <div className="w-full bg-gray-200 h-1.5">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6">
        <div className="w-full max-w-4xl mx-auto flex flex-col flex-1">
          <header className="text-center mb-8 mt-4 sm:mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{title}</h1>
            {subtitle && <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">{subtitle}</p>}
          </header>

          <div className="flex-1 mb-8">
            {children}
          </div>

          {/* Navigation Footer */}
          <footer className="sticky bottom-0 bg-gradient-to-t from-emerald-50 via-emerald-50/80 to-transparent pt-8 pb-4">
            <div className="max-w-md mx-auto flex flex-col gap-3">
              <Button
                onClick={onNext}
                disabled={nextDisabled || isLoading}
                className="w-full text-base py-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : nextLabel}
              </Button>
              
              {showBack && onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};
