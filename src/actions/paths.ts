"use server";
import { chromium } from "playwright";
import { db } from "@/server/db";
import { interactions, notes, pages, paths } from "@/server/db/schemas";
import { count, desc, eq, inArray } from "drizzle-orm";
import { url } from "inspector";

// Each path has => many pages and each page has => Interactions and notes
// interactions has => event, type, timestamp

export const getAllPaths = async () => {
  const response = await db.select().from(paths);
  return response;
};

export const getAllPathsWithPages = async () => {
  const allPaths = await db.select().from(paths);
  const pathIds = new Set(allPaths.map((path) => path.id));
  const allPages = await db
    .select()
    .from(pages)
    .where(inArray(pages.pathId, Array.from(pathIds)));

  let pathsWithPages = [];

  let numberOfNotes;

  for (const path of allPaths) {
    const pagesForPath = allPages
      .filter((page) => page.pathId === path.id)
      .map((page) => ({ url: page.url, domain: page.domain }));
    pathsWithPages.push({ ...path, pages: pagesForPath });
  }
  return pathsWithPages;
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

export async function getPathsWithDetails() {
  // Fetch all paths
  const allPaths = await db
    .select({
      id: paths.id,
      name: paths.name,
      createdAt: paths.createdAt,
      userId: paths.userId,
    })
    .from(paths);

  // Iterate over each path to fetch its related pages and notes
  const result = await Promise.all(
    allPaths.map(async (path) => {
      // Fetch all pages for the current path
      const pathPages = await db
        .select({
          id: pages.id,
          url: pages.url,
          domain: pages.domain,
          timeOnPage: pages.timeOnPage,
          isBookmarked: pages.isBookmarked,
          createdAt: pages.createdAt,
        })
        .from(pages)
        .where(eq(pages.pathId, path.id));
      // .orderBy(desc(pages.timeOnPage));

      // Fetch all notes related to the pages in the current path
      const pagesWithNotes = await Promise.all(
        pathPages.map(async (page) => {
          const pageNotes = await db
            .select({
              id: notes.id,
              body: notes.body,
              startTime: notes.startTime,
              endTime: notes.endTime,
              tags: notes.tags,
              color: notes.color,
              favorite: notes.favorite,
              hidden: notes.hidden,
              sort: notes.sort,
              createdAt: notes.createdAt,
            })
            .from(notes)
            .where(eq(notes.pageId, page.id));

          return {
            ...page,
            notes: pageNotes, // Attach notes to the page
          };
        })
      );

      // Calculate the number of pages and notes
      const numberOfPages = pagesWithNotes.length;
      const numberOfNotes = pagesWithNotes.reduce(
        (acc, page) => acc + page.notes.length,
        0
      );

      return {
        ...path, // All path properties
        pages: pagesWithNotes, // Array of pages with notes included
        numberOfPages,
        numberOfNotes,
      };
    })
  );

  return result;
}
