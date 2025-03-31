"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Simulate API calls that might fail
const simulateSuccessfulAPI = () => new Promise<string>(resolve => 
  setTimeout(() => resolve("Success!"), 1000)
);

const simulateFailingAPI = () => new Promise<string>((_, reject) => 
  setTimeout(() => reject(new Error("API Error: Something went wrong")), 1000)
);

// Example with manual error handling
const WithManualErrorHandling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSuccessCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateSuccessfulAPI();
      setResult(data);
      toast.success("API call successful");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("API call failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFailingCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateFailingAPI();
      setResult(data);
      toast.success("API call successful");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("API call failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">With Manual Error Handling</h2>
      
      <div className="flex gap-4 mb-4">
        <Button onClick={handleSuccessCall} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Call Successful API"
          )}
        </Button>
        
        <Button onClick={handleFailingCall} disabled={isLoading} variant="destructive">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Call Failing API"
          )}
        </Button>
      </div>
      
      {result && <p className="text-green-600 mb-2">{result}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      
      <p className="text-sm text-gray-500">
        Notice how we need to manually manage error state, loading state, and remember to reset them in the finally block.
      </p>
    </div>
  );
};

// Example with useTransition error handling
const WithTransitionErrorHandling = () => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Error boundary effect
  useEffect(() => {
    return () => {
      // This would normally be handled by React's error boundaries
      // but we're simulating it here for demonstration
    };
  }, []);
  
  const handleSuccessCall = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await simulateSuccessfulAPI();
        setResult(data);
        toast.success("API call successful");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        toast.error("API call failed");
      }
    });
  };
  
  const handleFailingCall = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await simulateFailingAPI();
        setResult(data);
        toast.success("API call successful");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        toast.error("API call failed");
      }
    });
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">With useTransition Error Handling</h2>
      
      <div className="flex gap-4 mb-4">
        <Button onClick={handleSuccessCall} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Call Successful API"
          )}
        </Button>
        
        <Button onClick={handleFailingCall} disabled={isPending} variant="destructive">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Call Failing API"
          )}
        </Button>
      </div>
      
      {result && <p className="text-green-600 mb-2">{result}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      
      <p className="text-sm text-gray-500">
        Notice how we don't need a finally block to reset loading state, and the error handling integrates better with React's patterns.
      </p>
    </div>
  );
};

// Main component that showcases both examples
const ErrorHandlingExample = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Error Handling Example</h1>
      <p className="text-gray-600">
        This example demonstrates the difference between manual error handling and error handling with useTransition.
      </p>
      
      <WithManualErrorHandling />
      <WithTransitionErrorHandling />
    </div>
  );
};

export default ErrorHandlingExample;
