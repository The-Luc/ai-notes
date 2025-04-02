"use client";

import React, { useState, useTransition } from "react";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Simulated async operations
const fetchUserProfile = () =>
  new Promise<{ name: string }>((resolve) =>
    setTimeout(() => resolve({ name: "John Doe" }), 1500),
  );

const fetchUserPosts = () =>
  new Promise<{ title: string }[]>((resolve) =>
    setTimeout(() => resolve([{ title: "Post 1" }, { title: "Post 2" }]), 2000),
  );

const fetchUserNotifications = () =>
  new Promise<{ message: string }[]>((resolve) =>
    setTimeout(() => resolve([{ message: "New message" }]), 1000),
  );

// Example 1: With manual loading states
export const WithManualLoadingStates = () => {
  // Multiple loading states to track
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Data states
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [posts, setPosts] = useState<{ title: string }[]>([]);
  const [notifications, setNotifications] = useState<{ message: string }[]>([]);

  // Calculate if any loading is happening
  const isAnyLoading =
    isLoadingProfile || isLoadingPosts || isLoadingNotifications;

  const loadAllData = async () => {
    // Need to manage multiple loading states
    setIsLoadingProfile(true);
    setIsLoadingPosts(true);
    setIsLoadingNotifications(true);

    try {
      // Fetch all data in parallel
      const [profileData, postsData, notificationsData] = await Promise.all([
        fetchUserProfile(),
        fetchUserPosts(),
        fetchUserNotifications(),
      ]);

      // Update all states
      setProfile(profileData);
      setPosts(postsData);
      setNotifications(notificationsData);

      toast.success("All data loaded successfully");
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      // Need to reset all loading states
      setIsLoadingProfile(false);
      setIsLoadingPosts(false);
      setIsLoadingNotifications(false);
    }
  };

  return (
    <div className="mb-8 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-bold">
        Example with Manual Loading States
      </h2>
      <Button onClick={loadAllData} disabled={isAnyLoading} className="mb-4">
        {isAnyLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Data...
          </>
        ) : (
          "Load All Data"
        )}
      </Button>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-3">
          <h3 className="font-semibold">Profile</h3>
          {isLoadingProfile ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : profile ? (
            <p>{profile.name}</p>
          ) : (
            <p className="text-gray-500">No profile loaded</p>
          )}
        </div>

        <div className="rounded border p-3">
          <h3 className="font-semibold">Posts</h3>
          {isLoadingPosts ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : posts.length > 0 ? (
            <ul>
              {posts.map((post, i) => (
                <li key={i}>{post.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts loaded</p>
          )}
        </div>

        <div className="rounded border p-3">
          <h3 className="font-semibold">Notifications</h3>
          {isLoadingNotifications ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, i) => (
                <li key={i}>{notification.message}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No notifications loaded</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Notice how we need to manage multiple loading states and remember to
        reset each one.
      </p>
    </div>
  );
};

// Example 2: With useTransition
export const WithUseTransition = () => {
  // Single pending state for all operations
  const [isPending, startTransition] = useTransition();

  // Data states
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [posts, setPosts] = useState<{ title: string }[]>([]);
  const [notifications, setNotifications] = useState<{ message: string }[]>([]);

  const loadAllData = () => {
    // Wrap all async operations in a single transition
    startTransition(async () => {
      try {
        // Fetch all data in parallel
        const [profileData, postsData, notificationsData] = await Promise.all([
          fetchUserProfile(),
          fetchUserPosts(),
          fetchUserNotifications(),
        ]);

        // Update all states
        setProfile(profileData);
        setPosts(postsData);
        setNotifications(notificationsData);

        toast.success("All data loaded successfully");
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      }
      // No need for finally block to reset loading states
    });
  };

  return (
    <div className="rounded-md border p-4">
      <h2 className="mb-4 text-xl font-bold">Example with useTransition</h2>
      <Button onClick={loadAllData} disabled={isPending} className="mb-4">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Data...
          </>
        ) : (
          "Load All Data"
        )}
      </Button>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-3">
          <h3 className="font-semibold">Profile</h3>
          {isPending ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : profile ? (
            <p>{profile.name}</p>
          ) : (
            <p className="text-gray-500">No profile loaded</p>
          )}
        </div>

        <div className="rounded border p-3">
          <h3 className="font-semibold">Posts</h3>
          {isPending ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : posts.length > 0 ? (
            <ul>
              {posts.map((post, i) => (
                <li key={i}>{post.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts loaded</p>
          )}
        </div>

        <div className="rounded border p-3">
          <h3 className="font-semibold">Notifications</h3>
          {isPending ? (
            <Loader2 className="mt-2 h-4 w-4 animate-spin" />
          ) : notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, i) => (
                <li key={i}>{notification.message}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No notifications loaded</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Notice how we use a single isPending state for all operations, and
        don&apos;t need to manually reset it.
      </p>
    </div>
  );
};

// Main component that showcases both examples
const MultipleAsyncOperationsExample = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <h1 className="text-2xl font-bold">Multiple Async Operations Example</h1>
      <p className="text-gray-600">
        This example demonstrates the difference between managing multiple
        loading states manually versus using useTransition for multiple
        asynchronous operations.
      </p>

      <WithManualLoadingStates />
      <WithUseTransition />
    </div>
  );
};

export default MultipleAsyncOperationsExample;
