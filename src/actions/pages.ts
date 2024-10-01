"use server";

import { db } from "@/server/db";
import { pages } from "@/server/db/schemas";
import { count, eq } from "drizzle-orm";

export const getAllPagesByPathId = async (pathId: number) => {
  const response = await db
    .select()
    .from(pages)
    .where(eq(pages.pathId, pathId));
  return response;
};

export const getPageById = async (pageId: number) => {
  const response = await db.select().from(pages).where(eq(pages.id, pageId));
  return response[0];
};

export const getPageCountByPathId = async (pathId: number) => {
  const pageCount = await db
    .select({ count: count() })
    .from(pages)
    .where(eq(pages.pathId, pathId));
  return pageCount[0].count;
};
