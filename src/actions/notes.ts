"use server";

import { db } from "@/server/db";
import { notes, pages } from "@/server/db/schemas";
import { count } from "console";
import { eq, inArray } from "drizzle-orm";

// get all notes by page id
export async function getNotesByPageId(pageId: number) {
  const allNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.pageId, pageId));
  return allNotes;
}

// get all notes by path id
export async function getNotesByPathId(pathId: number) {
  // Get the page IDs first
  const pageIds = await db
    .select({ id: pages.id })
    .from(pages)
    .where(eq(pages.pathId, pathId));

  // left join the page url with the notes
  const allNotes = await Promise.all(
    pageIds.map(async ({ id: pageId }) => {
      const page = await db
        .select({
          url: pages.url,
        })
        .from(pages)
        .where(eq(pages.id, pageId))
        .limit(1);

      const notesForPage = await db
        .select()
        .from(notes)
        .where(eq(notes.pageId, pageId));

      return notesForPage.map((note) => ({
        ...note,
        pageUrl: page[0].url,
      }));
    })
  );

  return allNotes.flat();
}
