/**
 * Cache tags for Next.js revalidation
 */
export const CacheTags = {
  intakes: {
    all: "intakes",
    byId: (id: string) => `intake:${id}`,
    byStatus: (status: string) => `intakes:status:${status}`,
    byPriority: (priority: string) => `intakes:priority:${priority}`,
  },

  settings: {
    all: "settings",
    byKey: (key: string) => `setting:${key}`,
  },
} as const;
