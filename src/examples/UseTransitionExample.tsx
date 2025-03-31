"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";
import { debugApp } from "../lib/utils";

interface Item {
  id: number;
  name: string;
  description: string;
}

// Simulate a large dataset
const generateLargeList = (): Item[] => {
  return Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `This is a description for item ${i}`,
  }));
};

const findItems = async (text: string): Promise<Item[]> => {
  return new Promise<Item[]>((r) =>
    setTimeout(
      () =>
        r(
          generateLargeList().filter(
            (item) =>
              item.name.toLowerCase().includes(text.toLowerCase()) ||
              item.description.toLowerCase().includes(text.toLowerCase()),
          ),
        ),
      2000,
    ),
  );
};

const UseTransitionExample = () => {
  // Our large dataset
  const allItems = useMemo(generateLargeList, []);

  // State for the search input
  const [searchText, setSearchText] = useState("");

  // State for the filtered results
  const [filteredItems, setFilteredItems] = useState(allItems);

  // useTransition hook
  const [isPending, startTransition] = useTransition();

  // Handle input change without useTransition (will cause UI lag)
  const handleSearchWithoutTransition = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const text = e.target.value;
    setSearchText(text);

    // This expensive operation will block the UI
    debugApp("handleSearchWithoutTransition");
    const filtered = await findItems(text);
    setFilteredItems(filtered);
    debugApp("handleSearchWithoutTransition end");
  };

  // Handle input change with useTransition (smooth UI)
  const handleSearchWithTransition = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const text = e.target.value;

    // Update the input value immediately (high priority)
    setSearchText(text);

    // Mark the filtering operation as a transition (lower priority)
    debugApp("handleSearchWithTransition");
    startTransition(async () => {
      const filtered = await findItems(text);
      setFilteredItems(filtered);
      debugApp("handleSearchWithTransition end");
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        useTransition Example: Search Filter
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Without useTransition</h2>
          <p className="mb-4 text-sm text-gray-600">
            Type quickly and notice how the UI becomes unresponsive
          </p>
          <Input
            placeholder="Search items..."
            onChange={handleSearchWithoutTransition}
            className="mb-2"
          />
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">With useTransition</h2>
          <p className="mb-4 text-sm text-gray-600">
            Type quickly and notice how the UI remains responsive
          </p>
          <div className="relative">
            <Input
              placeholder="Search items..."
              value={searchText}
              onChange={handleSearchWithTransition}
              className="mb-2"
            />
            {isPending && (
              <div className="absolute top-2 right-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">
          Results{" "}
          {isPending && <span className="text-gray-400">(updating...)</span>}
        </h2>
        <p className="text-sm text-gray-600">
          Showing {filteredItems.length} of {allItems.length} items
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="max-h-96 overflow-y-auto">
          {isPending ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Processing results...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No results found</p>
          ) : (
            <ul className="divide-y">
              {filteredItems.slice(0, 50).map((item) => (
                <li key={item.id} className="p-4 hover:bg-gray-50">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </li>
              ))}
              {filteredItems.length > 50 && (
                <li className="p-4 text-center text-gray-500">
                  Showing first 50 results of {filteredItems.length}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">How useTransition Works</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Without useTransition:</strong> The expensive filtering
            operation blocks the UI thread, making the input feel laggy.
          </li>
          <li>
            <strong>With useTransition:</strong> React marks the filtering as a
            lower priority update that can be interrupted.
          </li>
          <li>
            The input value updates immediately, keeping the UI responsive.
          </li>
          <li>
            The <code>isPending</code> state lets us show loading indicators
            while the transition is in progress.
          </li>
          <li>
            When typing quickly, React will skip intermediate filter operations
            and only process the latest one.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default UseTransitionExample;
