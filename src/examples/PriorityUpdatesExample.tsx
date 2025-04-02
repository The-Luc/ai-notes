"use client";

import React, { useState, useTransition } from "react";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

// Example demonstrating how useTransition prioritizes UI updates
const PriorityUpdatesExample = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <h1 className="text-2xl font-bold">Priority Updates Example</h1>
      <p className="text-gray-600">
        This example demonstrates how useTransition allows React to prioritize
        important UI updates while handling expensive operations in the
        background.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <WithoutTransition />
        <WithTransition />
      </div>
    </div>
  );
};

// Simulate an expensive operation that returns a promise
const performExpensiveOperation = () => {
  return new Promise<string>((resolve) => {
    // Use setTimeout to simulate an async operation
    // This won't block the main thread
    setTimeout(() => {
      // Simulate CPU-intensive work inside the async operation
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Some CPU work that happens inside the async task
      }
      resolve("Operation complete");
    }, 2000);
  });
};

// Example without useTransition
const WithoutTransition = () => {
  const [count, setCount] = useState(0);
  const [operationResult, setOperationResult] = useState("");
  const [isTyping, setIsTyping] = useState("");

  const handleButtonClick = async () => {
    // Update count immediately
    setCount(count + 1);

    // This will make the UI unresponsive during the async operation
    // because we're not using useTransition
    const result = await performExpensiveOperation();
    setOperationResult(result);
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-bold">Without useTransition</h2>
      <div className="mb-4">
        <p className="mb-2">Type here to test responsiveness:</p>
        <input
          type="text"
          value={isTyping}
          onChange={(e) => setIsTyping(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Type here..."
        />
      </div>

      <Button onClick={handleButtonClick} className="mb-4">
        Run Expensive Operation (Click {count})
      </Button>

      {operationResult && <p className="text-green-600">{operationResult}</p>}

      <p className="mt-4 text-sm text-gray-500">
        Notice how the entire UI freezes when you click the button, including
        the input field.
      </p>
    </div>
  );
};

// Example with useTransition
const WithTransition = () => {
  const [count, setCount] = useState(0);
  const [operationResult, setOperationResult] = useState("");
  const [isTyping, setIsTyping] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleButtonClick = () => {
    // Immediate UI update (high priority)
    setCount(count + 1);

    // Expensive operation wrapped in useTransition (lower priority)
    startTransition(async () => {
      const result = await performExpensiveOperation();
      setOperationResult(result);
    });
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-bold">With useTransition</h2>
      <div className="mb-4">
        <p className="mb-2">Type here to test responsiveness:</p>
        <input
          type="text"
          value={isTyping}
          onChange={(e) => setIsTyping(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Type here..."
        />
      </div>

      <Button onClick={handleButtonClick} className="mb-4">
        Run Expensive Operation (Click {count})
        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>

      {operationResult && <p className="text-green-600">{operationResult}</p>}

      <p className="mt-4 text-sm text-gray-500">
        Notice how the UI remains responsive when you click the button. You can
        still type in the input field while the operation runs.
      </p>
    </div>
  );
};

export default PriorityUpdatesExample;
