"use server";

import { db } from "@/server/db";
import { pages, rrwebEvents } from "@/server/db/schemas";
import { and, eq, inArray } from "drizzle-orm";
import { getAllPagesByPathId } from "./pages";
import { EventType } from "rrweb";

/**
 * Fetches all rrweb events for a given page ID in batches.
 * This function retrieves events from the database by querying with
 * the specified page ID and processes them in batches of 10 until
 * all events are fetched. It returns an array of events.
 *
 * @param {number} pageId - The ID of the page to fetch events for.
 * @return {Promise<EventType[]>} - A promise that resolves to an array of
 * rrweb event objects.
 */
export async function getRrwebEventsByPageId(pageId: number) {
  let allEvents: EventType[] = [];
  let offset = 0; // Offset of the first event to fetch
  const batchSize = 10; // Number of events to fetch per batch
  let fetchedEvents;

  // Loop to fetch in batches of 10 until no more events are returned
  do {
    fetchedEvents = await db
      .select({ event: rrwebEvents.event })
      .from(rrwebEvents)
      .where(eq(rrwebEvents.pageId, pageId))
      .limit(batchSize)
      .offset(offset);

    allEvents = allEvents.concat(
      fetchedEvents.map((e) => e.event) as EventType[]
    );
    offset += batchSize;
  } while (fetchedEvents.length > 0);

  return allEvents;
}

/**
 * Gets all rrweb events by path id. This function fetches the events in batches
 * of 100 and then reassembles chunked events. The function returns a strongly
 * typed array of events.
 *
 * @param {number} pathId - The path id to fetch events for
 * @return {Promise<EventType[]>} - A promise that resolves to an array of
 * reassembled events
 */
export async function getAllRrwebEventsByPathId(
  pathId: number
): Promise<EventType[] | undefined> {
  try {
    // Get the page IDs first
    const pageIds = await db
      .select({ id: pages.id })
      .from(pages)
      .where(eq(pages.pathId, pathId));

    console.log(`found ${pageIds.length} pages for path ${pathId}`);

    let allEvents: EventType[] = [];
    let offset = 0;
    const batchSize = 100;
    let fetchedEvents;

    // Loop to fetch in batches of 100 until no more events are returned
    do {
      fetchedEvents = await db
        .select({ event: rrwebEvents.event })
        .from(rrwebEvents)
        .where(
          inArray(
            rrwebEvents.pageId,
            pageIds.map(({ id }) => id)
          )
        )
        .limit(batchSize)
        .offset(offset);

      allEvents = allEvents.concat(
        fetchedEvents.map((e) => e.event) as EventType[]
      );
      offset += batchSize;
    } while (fetchedEvents.length > 0); // Stop when no more events are returned

    console.log(`Total events fetched: ${allEvents.length}`);
    return allEvents;
  } catch (err) {
    console.error("Error getting rrweb events by path id:", err);
  }
}
