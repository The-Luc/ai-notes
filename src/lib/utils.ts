import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import debug from 'debug'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create debuggers for different parts of the application
export const createDebugger = (namespace: string) => debug(`ai-notes:${namespace}`)

// Pre-configured debuggers
export const debugAuth = createDebugger('auth')
export const debugError = createDebugger('error')
export const debugApp = createDebugger('app')

export const handleError = (error: unknown) => {
  // Log error using the debug package
  debugError('%O', error)

  if (error instanceof Error) {
    return { errorMessage: error.message }
  }
  return { errorMessage: "Something went wrong" }
}