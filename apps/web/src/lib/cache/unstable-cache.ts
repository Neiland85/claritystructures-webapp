import { unstable_cache } from "next/cache";

/**
 * Cache wrapper with consistent tags and revalidation
 */
export function createCachedFunction<
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  options: {
    tags: string[];
    revalidate?: number | false;
    keyPrefix?: string;
  },
): T {
  return unstable_cache(fn, [options.keyPrefix || fn.name], {
    tags: options.tags,
    revalidate: options.revalidate,
  }) as T;
}

/**
 * Common cache configurations
 */
export const CacheConfig = {
  // Static data - revalidate hourly
  static: { revalidate: 3600 },

  // Dynamic data - revalidate every 5 minutes
  dynamic: { revalidate: 300 },

  // Real-time data - no cache
  realtime: { revalidate: 0 },

  // Long-term cache - revalidate daily
  longTerm: { revalidate: 86400 },
} as const;
