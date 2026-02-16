/**
 * Example: Cached repository implementation
 * This shows how to use Next.js cache with Prisma
 */

import { unstable_cache } from "next/cache";

export class CachedIntakeRepository {
  /**
   * Get intake by ID with caching
   */
  static getById = unstable_cache(
    async (id: string) => {
      // Prisma query here
      // const intake = await prisma.contactIntake.findUnique({ where: { id } });
      // return intake;
      return null;
    },
    ["intake-by-id"],
    {
      tags: ["intakes"],
      revalidate: 300, // 5 minutes
    },
  );

  /**
   * List intakes with caching
   */
  static list = unstable_cache(
    async (filters?: { status?: string; priority?: string }) => {
      // Prisma query here with indexes
      // const intakes = await prisma.contactIntake.findMany({
      //   where: {
      //     status: filters?.status,
      //     priority: filters?.priority,
      //   },
      //   orderBy: { createdAt: 'desc' },
      // });
      // return intakes;
      return [];
    },
    ["intakes-list"],
    {
      tags: ["intakes"],
      revalidate: 60, // 1 minute
    },
  );
}
