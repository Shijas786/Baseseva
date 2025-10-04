import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function PrivySetupGuide() {
  const [step, setStep] = useState<number>(1);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = async (text: string, stepNumber: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepNumber);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const steps = [
    {
      title: "Install Dependencies",
      command: "npm install @privy-io/react-auth @privy-io/react-auth/smart-wallets viem",
      description: "Add the required Privy packages to your project"
    },
    {
      title: "Sign up for Privy",
      url: "https://privy.io",
      description: "Create a free account and set up your app"
    },
    {
      title: "Create Environment File",
      command: "VITE_PRIVY_APP_ID=your-privy-app-id-here",
      file: ".env",
      description: "Add your Privy App ID to your environment variables"
    },
    {
      title: "Configure Privy Dashboard",
      description: "Set up login methods, chains, and wallet settings in your Privy dashboard"
    }
  ];

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Enable Real Blockchain Wallets</h2>
        <p className="text-gray-600">
          Currently using mock wallets. Follow these steps to enable real Web3 functionality.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((stepData, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isCurrent = step === stepNumber;

          return (
            <div 
              key={stepNumber}
              className={`border rounded-lg p-4 transition-all ${
                isCurrent 
                  ? 'border-red-500 bg-red-50' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                  </div>
                  <h3 className="font-semibold">{stepData.title}</h3>
                </div>
                
                {isCompleted && (
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    Complete
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 ml-11">
                {stepData.description}
              </p>

              {stepData.command && (
                <div className="ml-11">
                  <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-sm flex items-center justify-between">
                    <code>{stepData.command}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(stepData.command, stepNumber)}
                      className="text-green-400 hover:text-green-300 h-6 px-2"
                    >
                      {copiedStep === stepNumber ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  {stepData.file && (
                    <p className="text-xs text-gray-500 mt-1">
                      Add to: <code>{stepData.file}</code>
                    </p>
                  )}
                </div>
              )}

              {stepData.url && (
                <div className="ml-11">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(stepData.url, '_blank')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Privy Dashboard
                  </Button>
                </div>
              )}

              {isCurrent && (
                <div className="ml-11 mt-3">
                  <Button
                    size="sm"
                    onClick={() => setStep(step + 1)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Mark as Complete
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📝 Quick Reference</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Supported Chains:</strong> Base, Base Sepolia</li>
          <li>• <strong>Login Methods:</strong> Email, SMS</li>
          <li>• <strong>Wallet Types:</strong> Embedded + Smart Accounts</li>
          <li>• <strong>Documentation:</strong> docs.privy.io</li>
        </ul>
      </div>

      <div className="mt-4 text-center">
        <Button
          variant="outline"
          onClick={() => window.open('/PRIVY_SETUP.md', '_blank')}
          className="text-gray-600"
        >
          View Complete Setup Guide
        </Button>
      </div>
    </Card>
  );
}