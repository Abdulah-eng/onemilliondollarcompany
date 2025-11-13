import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { syncCheckoutSession, createOfferCheckoutSession } from '@/lib/stripe/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StepLog {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  timestamp: Date;
  details?: any;
}

const TestOfferPaymentFlow = () => {
  const navigate = useNavigate();
  const [offerId, setOfferId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<StepLog[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Add log entry
  const addLog = (step: string, status: StepLog['status'], message: string, details?: any) => {
    const log: StepLog = {
      step,
      status,
      message,
      timestamp: new Date(),
      details
    };
    setLogs(prev => [...prev, log]);
    console.log(`[TestFlow] ${step}:`, { status, message, details });
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    setCurrentStep(null);
  };

  // Step 1: Create checkout session
  const handleCreateCheckout = async () => {
    if (!offerId.trim()) {
      toast.error('Please enter an offer ID');
      return;
    }

    setLoading(true);
    clearLogs();
    setCurrentStep('create-checkout');
    addLog('1. Create Checkout', 'running', 'Creating Stripe checkout session...', { offerId });

    try {
      const appUrl = window.location.origin;
      addLog('1. Create Checkout', 'running', `Using app URL: ${appUrl}`);
      
      const result = await createOfferCheckoutSession(offerId, appUrl);
      addLog('1. Create Checkout', 'success', 'Checkout session created!', result);
      
      if (result.sessionId) {
        setSessionId(result.sessionId);
        addLog('2. Session ID', 'success', `Session ID: ${result.sessionId}`, { sessionId: result.sessionId });
        
        // Show alert with session ID
        alert(`Checkout session created!\n\nSession ID: ${result.sessionId}\n\nThis will be used for testing.`);
        
        toast.success('Checkout session created! Session ID saved.');
      }
    } catch (error) {
      addLog('1. Create Checkout', 'error', 'Failed to create checkout session', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      toast.error('Failed to create checkout: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  // Step 2: Test sync with session ID
  const handleTestSync = async () => {
    if (!sessionId.trim()) {
      toast.error('Please enter a session ID');
      return;
    }

    setLoading(true);
    setCurrentStep('test-sync');
    addLog('3. Test Sync', 'running', 'Calling stripe-sync function...', { sessionId });

    try {
      // Log the exact URL and headers that will be used
      const { data: { session } } = await supabase.auth.getSession();
      const { config } = await import('@/lib/config');
      const functionUrl = `${config.api.baseUrl}/stripe-sync?session_id=${sessionId}`;
      
      addLog('3. Test Sync', 'running', 'Request details', {
        url: functionUrl,
        method: 'GET',
        hasAuth: !!session?.access_token,
        sessionId
      });

      const syncResult = await syncCheckoutSession(sessionId);
      addLog('3. Test Sync', 'success', 'Sync completed!', syncResult);
      
      if (syncResult?.status === 'accepted' || syncResult?.ok) {
        addLog('4. Result', 'success', 'Offer status updated to accepted!', syncResult);
        toast.success('✅ Sync successful! Offer status: ' + (syncResult.status || 'accepted'));
      } else {
        addLog('4. Result', 'error', 'Sync completed but status not accepted', syncResult);
        toast.info('Sync completed. Check result below.');
      }
    } catch (error) {
      addLog('3. Test Sync', 'error', 'Sync failed', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Sync failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  // Step 3: Test full flow (create checkout, then simulate redirect and sync)
  const handleTestFullFlow = async () => {
    if (!offerId.trim()) {
      toast.error('Please enter an offer ID');
      return;
    }

    setLoading(true);
    clearLogs();
    setCurrentStep('full-flow');

    try {
      // Step 1: Create checkout
      addLog('1. Create Checkout', 'running', 'Creating Stripe checkout session...', { offerId });
      const appUrl = window.location.origin;
      const checkoutResult = await createOfferCheckoutSession(offerId, appUrl);
      addLog('1. Create Checkout', 'success', 'Checkout session created!', checkoutResult);
      
      if (!checkoutResult.sessionId) {
        throw new Error('No session ID returned from checkout creation');
      }

      const newSessionId = checkoutResult.sessionId;
      setSessionId(newSessionId);
      addLog('2. Session ID', 'success', `Session ID: ${newSessionId}`);

      // Step 2: Simulate waiting for payment (in real flow, user would pay here)
      addLog('3. Payment', 'running', 'Simulating payment completion...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('3. Payment', 'success', 'Payment completed (simulated)');

      // Step 3: Test sync (this is what should happen automatically after redirect)
      addLog('4. Auto Sync', 'running', 'Testing automatic sync (simulating redirect)...', { sessionId: newSessionId });
      const syncResult = await syncCheckoutSession(newSessionId);
      addLog('4. Auto Sync', 'success', 'Sync completed!', syncResult);

      if (syncResult?.status === 'accepted' || syncResult?.ok) {
        addLog('5. Result', 'success', '✅ Full flow successful! Offer accepted!', syncResult);
        toast.success('🎉 Full flow test successful! Offer status updated to accepted.');
      } else {
        addLog('5. Result', 'error', 'Flow completed but offer not accepted', syncResult);
        toast.warning('Flow completed but offer status not accepted. Check logs.');
      }
    } catch (error) {
      addLog('Error', 'error', 'Full flow test failed', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Full flow test failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  // Step 4: Test with URL parameters (simulate redirect)
  const handleTestWithUrlParams = () => {
    if (!sessionId.trim()) {
      toast.error('Please enter a session ID first');
      return;
    }

    addLog('URL Redirect Test', 'running', 'Simulating Stripe redirect...');
    
    // Simulate the redirect by navigating with URL parameters
    const redirectUrl = `/customer/messages?offer_status=paid&session_id=${sessionId}`;
    addLog('URL Redirect Test', 'success', `Would redirect to: ${redirectUrl}`);
    
    toast.info('Navigate to messages page to test automatic sync on redirect');
    navigate(redirectUrl);
  };

  // Get status icon
  const getStatusIcon = (status: StepLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: StepLog['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Offer Payment Flow</CardTitle>
          <CardDescription>
            Comprehensive test tool to debug the complete offer payment flow from checkout creation to sync.
            This helps identify where the flow breaks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="offerId" className="text-sm font-medium">
                Offer ID
              </label>
              <Input
                id="offerId"
                placeholder="Enter offer ID (UUID)"
                value={offerId}
                onChange={(e) => setOfferId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sessionId" className="text-sm font-medium">
                Session ID (from checkout or redirect URL)
              </label>
              <Input
                id="sessionId"
                placeholder="cs_test_..."
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={handleCreateCheckout}
              disabled={loading || !offerId.trim()}
              variant="outline"
              className="w-full"
            >
              {currentStep === 'create-checkout' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Step 1: Create Checkout
            </Button>

            <Button
              onClick={handleTestSync}
              disabled={loading || !sessionId.trim()}
              variant="outline"
              className="w-full"
            >
              {currentStep === 'test-sync' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Step 2: Test Sync
            </Button>

            <Button
              onClick={handleTestFullFlow}
              disabled={loading || !offerId.trim()}
              variant="default"
              className="w-full"
            >
              {currentStep === 'full-flow' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Test Full Flow
            </Button>

            <Button
              onClick={handleTestWithUrlParams}
              disabled={!sessionId.trim()}
              variant="outline"
              className="w-full"
            >
              Test Redirect
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={clearLogs}
              variant="ghost"
              size="sm"
            >
              Clear Logs
            </Button>
          </div>

          {/* Logs Section */}
          {logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Flow Logs</CardTitle>
                <CardDescription>
                  Detailed logs of each step in the payment flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          {getStatusIcon(log.status)}
                          <span className="font-medium text-sm">{log.step}</span>
                          {getStatusBadge(log.status)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.message}</p>
                      {log.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  <strong>Step 1: Create Checkout</strong> - Enter an offer ID and create a checkout session.
                  This will generate a session ID that you can use for testing.
                </li>
                <li>
                  <strong>Step 2: Test Sync</strong> - Enter a session ID (from Step 1 or from a real payment)
                  and test if the stripe-sync function works correctly.
                </li>
                <li>
                  <strong>Test Full Flow</strong> - Automatically tests the complete flow: create checkout,
                  simulate payment, and sync. This is the most comprehensive test.
                </li>
                <li>
                  <strong>Test Redirect</strong> - Simulates the Stripe redirect by navigating to the messages
                  page with URL parameters. This tests if the automatic sync triggers on redirect.
                </li>
              </ol>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs font-medium mb-1">💡 Tips:</p>
                <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                  <li>Check browser console for detailed API logs</li>
                  <li>Check Supabase Edge Functions logs for server-side logs</li>
                  <li>Use "Test Full Flow" to see the complete path end-to-end</li>
                  <li>If sync fails, check the error details in the logs above</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestOfferPaymentFlow;

