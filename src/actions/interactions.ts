"use server";

import { db } from "@/server/db";
import { interactions } from "@/server/db/schemas";
import { eq } from "drizzle-orm";

// get all interactions for a pageId
export const getInteractionsByPageId = async (pageId: number) => {
  const response = await db
    .select()
    .from(interactions)
    .where(eq(interactions.pageId, pageId));
  return response;
};
