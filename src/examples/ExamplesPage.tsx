"use client";

import React from "react";
import MultipleAsyncOperationsExample from "./MultipleAsyncOperationsExample";
import PriorityUpdatesExample from "./PriorityUpdatesExample";
import ErrorHandlingExample from "./ErrorHandlingExample";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseTransitionExample from "./UseTransitionExample";

const ExamplesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        useTransition vs Manual Loading State Examples
      </h1>
      <p className="mb-8 text-gray-600">
        These examples demonstrate the practical benefits of using useTransition
        over manual loading state management.
      </p>

      <Tabs defaultValue="multiple-async">
        <TabsList className="mb-8">
          <TabsTrigger value="multiple-async">
            Multiple Async Operations
          </TabsTrigger>
          <TabsTrigger value="priority-updates">Priority Updates</TabsTrigger>
          <TabsTrigger value="search-large-list">Search Large List</TabsTrigger>
          <TabsTrigger value="error-handling">Error Handling</TabsTrigger>
        </TabsList>

        <TabsContent value="multiple-async">
          <MultipleAsyncOperationsExample />
        </TabsContent>

        <TabsContent value="priority-updates">
          <PriorityUpdatesExample />
        </TabsContent>

        <TabsContent value="search-large-list">
          <UseTransitionExample />
        </TabsContent>

        <TabsContent value="error-handling">
          <ErrorHandlingExample />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamplesPage;
