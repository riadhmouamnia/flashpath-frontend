"use server";
import { db } from "@/server/db";
import { pages, paths } from "@/server/db/schemas";
import { eq } from "drizzle-orm";

export const allPages = async () => {
  const response = await db.select().from(pages);
  return response;
};

export const getPageById = async (id: number) => {
  const response = await db
    .select()
    .from(pages)
    .where(eq(pages.id, id))
    .leftJoin(paths, eq(paths.id, pages.pathId));
  return response[0];
};
