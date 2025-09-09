// src/components/system/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                We've encountered an unexpected error. You can try refreshing the page or go back to the dashboard.
              </p>
              {this.state.error && (
                <details className="text-left">
                  <summary className="text-sm font-medium cursor-pointer">Error details</summary>
                  <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto max-h-32">
                    {this.state.error.message}
                    {process.env.NODE_ENV === 'development' && '\n\n' + this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="flex gap-2 justify-center">
                <Button onClick={this.handleReset} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => window.location.href = '/'} size="sm">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;