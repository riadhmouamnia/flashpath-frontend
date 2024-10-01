"use server";
import { chromium } from "playwright";
import { db } from "@/server/db";
import { interactions, pages, paths } from "@/server/db/schemas";
import { eq } from "drizzle-orm";
import { url } from "inspector";

// Each path has => many pages and each page has => Interactions and notes
// interactions has => event, type, timestamp

export const getAllPaths = async () => {
  const response = await db.select().from(paths);
  return response;
};

export const getPathById = async (pathId: number) => {
  const response = await db.select().from(paths).where(eq(paths.id, pathId));
  return response[0];
};

export const getPathsByUserId = async (userId: string) => {
  const response = await db
    .select()
    .from(paths)
    .where(eq(paths.userId, userId));
  return response;
};
