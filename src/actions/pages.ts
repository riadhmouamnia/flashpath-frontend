"use server";

import { db } from "@/server/db";
import { notes, pages } from "@/server/db/schemas";
import { count, eq, inArray, sql } from "drizzle-orm";

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

export const getAllPagesWithNotesByPathId = async (pathId: number) => {
  // Fetch all pages
  const allPages = await db
    .select()
    .from(pages)
    .where(eq(pages.pathId, pathId));

  // Create a set of pageIds to fetch relevant notes
  const pageIds = new Set(allPages.map((page) => page.id));

  // Fetch all notes for these pages
  const allNotes = await db
    .select()
    .from(notes)
    .where(inArray(notes.pageId, Array.from(pageIds)));

  // Create a map to group notes by pageId
  const notesByPageId = allNotes.reduce((acc, note) => {
    if (!acc[note.pageId]) {
      acc[note.pageId] = [];
    }
    acc[note.pageId].push(note);
    return acc;
  }, {} as Record<number, typeof allNotes>);

  // Attach notes to the corresponding page
  const pagesWithNotes = allPages.map((page) => ({
    ...page,
    notes: notesByPageId[page.id] || [], // If no notes, return an empty array
  }));

  return pagesWithNotes;
};
