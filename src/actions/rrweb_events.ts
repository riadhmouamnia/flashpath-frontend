"use server";

import { db } from "@/server/db";
import { pages, rrwebEvents } from "@/server/db/schemas";
import { and, eq, inArray } from "drizzle-orm";
import { getAllPagesByPathId } from "./pages";
import { EventType } from "rrweb";

export async function getRrwebEventsByPageId(pageId: number) {
  const events = await db.query.rrwebEvents.findMany({
    where: eq(rrwebEvents.pageId, pageId),
  });
  return events;
}

// export async function getAllRrwebEventsByPathId(pathId: number) {
//   try {
//     const pageIds = await db
//       .select({
//         id: pages.id,
//       })
//       .from(pages)
//       .where(eq(pages.pathId, pathId));
//     console.log(`found ${pageIds.length} pages for path ${pathId}`);
//     const AllEvents = await db
//       .select({ event: rrwebEvents.event })
//       .from(rrwebEvents)
//       .where(
//         inArray(
//           rrwebEvents.pageId,
//           pageIds.map(({ id }) => id)
//         )
//       )
//       .limit(100);
//     // const AllEvents = await Promise.all(
//     //   pageIds.map(async ({ id }) => {
//     //     const events = await getRrwebEventsByPageId(id);
//     //     return events;
//     //   })
//     // );

//     console.log(`found ${AllEvents.length} events for path ${pathId}`);
//     // console.log("AllEvents", AllEvents);
//     return AllEvents;
//   } catch (err) {
//     console.error("Error getting rrweb events by path id:", err);
//   }
// }

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

/**
 * Gets all rrweb events by path id. This function fetches the events in batches
 * of 100 and then reassembles chunked events. The function returns a strongly
 * typed array of events.
 *
 * @param {number} pathId - The path id to fetch events for
 * @return {Promise<EventType[]>} - A promise that resolves to an array of
 * reassembled events
 */
// export async function getAllRrwebEventsByPathId(
//   pathId: number
// ): Promise<EventType[]> {
//   try {
//     // Get the page IDs first
//     const pageIds = await db
//       .select({ id: pages.id })
//       .from(pages)
//       .where(eq(pages.pathId, pathId));

//     console.log(`found ${pageIds.length} pages for path ${pathId}`);

//     let allEvents: EventType[] = [];
//     let offset = 0;
//     const batchSize = 100;
//     let fetchedEvents: { event: EventType }[];

//     // Object to hold chunked snapshots by pageId
//     let chunkedSnapshots: { [pageId: number]: (string | undefined)[] } = {};

//     // Loop to fetch in batches of 100 until no more events are returned
//     do {
//       fetchedEvents = await db
//         .select({ event: rrwebEvents.event })
//         .from(rrwebEvents)
//         .where(
//           inArray(
//             rrwebEvents.pageId,
//             pageIds.map(({ id }) => id)
//           )
//         )
//         .limit(batchSize)
//         .offset(offset);

//       // Iterate over each fetched event
//       fetchedEvents.forEach(({ event }) => {
//         if (event.isChunked) {
//           // Reassemble chunked events
//           const { pageId, chunkIndex, totalChunks, chunk } = event;

//           // Initialize the array for the pageId if not present
//           if (!chunkedSnapshots[pageId]) {
//             chunkedSnapshots[pageId] = new Array(totalChunks);
//           }

//           // Store the chunk at the correct index
//           chunkedSnapshots[pageId][chunkIndex] = chunk;

//           // If all chunks are gathered, join and parse them
//           if (chunkedSnapshots[pageId].filter(Boolean).length === totalChunks) {
//             const fullSnapshotString = chunkedSnapshots[pageId].join("");
//             const fullSnapshot = JSON.parse(fullSnapshotString) as EventType;

//             // Push the reassembled full snapshot to allEvents
//             allEvents.push(fullSnapshot);

//             // Clear the chunks for that pageId
//             delete chunkedSnapshots[pageId];
//           }
//         } else {
//           // If the event is not chunked, simply add it to the list
//           allEvents.push(event);
//         }
//       });

//       offset += batchSize;
//     } while (fetchedEvents.length > 0); // Stop when no more events are returned

//     console.log(`Total events fetched: ${allEvents.length}`);
//     return allEvents;
//   } catch (err) {
//     console.error("Error getting rrweb events by path id:", err);
//   }
// }

// export async function getAllRrwebEventsByPathId(pathId: number) {
//   try {
//     // Get the page IDs that belong to the given pathId
//     const pageIds = await db
//       .select({ id: pages.id })
//       .from(pages)
//       .where(eq(pages.pathId, pathId));

//     console.log(`Found ${pageIds.length} pages for path ${pathId}`);

//     // Function to reconstruct chunked events
//     const reconstructChunkedEvents = (chunkedEvents) => {
//       const eventMap = new Map();

//       chunkedEvents.forEach((event) => {
//         const { chunkIndex, totalChunks, chunk, pageId } = event;

//         if (!eventMap.has(pageId)) {
//           eventMap.set(pageId, new Array(totalChunks).fill(null));
//         }

//         const chunksArray = eventMap.get(pageId);
//         chunksArray[chunkIndex] = chunk;

//         // If all chunks are available, combine them into the final event
//         if (chunksArray.every((ch) => ch !== null)) {
//           const fullEventString = chunksArray.join("");
//           const fullEvent = JSON.parse(fullEventString);
//           eventMap.set(pageId, fullEvent); // Replace chunk array with the full event
//         }
//       });

//       console.log(eventMap);

//       // Return reconstructed full events
//       return Array.from(eventMap.values()).filter(
//         (ev) => typeof ev === "object"
//       );
//     };

//     // First query: Get all chunked events
//     let offset = 0;
//     const batchSize = 100;
//     let fetchedChunkedEvents;
//     let allChunkedEvents = [];

//     do {
//       fetchedChunkedEvents = await db
//         .select({
//           chunk: rrwebEvents.chunk,
//           pageId: rrwebEvents.pageId,
//           isChunked: rrwebEvents.isChunked,
//           chunkIndex: rrwebEvents.chunkIndex,
//           totalChunks: rrwebEvents.totalChunks,
//         })
//         .from(rrwebEvents)
//         .where(
//           and(
//             eq(rrwebEvents.isChunked, true),
//             inArray(
//               rrwebEvents.pageId,
//               pageIds.map(({ id }) => id)
//             )
//           ) // Only chunked events
//         )
//         .limit(batchSize)
//         .offset(offset);

//       allChunkedEvents = allChunkedEvents.concat(fetchedChunkedEvents);
//       offset += batchSize;
//     } while (fetchedChunkedEvents.length > 0);

//     // Reconstruct the chunked events
//     const reconstructedEvents = reconstructChunkedEvents(allChunkedEvents);
//     console.log(reconstructedEvents);

//     // Second query: Get all non-chunked events
//     offset = 0;
//     let fetchedNonChunkedEvents;
//     let allNonChunkedEvents = [];

//     do {
//       fetchedNonChunkedEvents = await db
//         .select({ event: rrwebEvents.event })
//         .from(rrwebEvents)
//         .where(
//           and(
//             inArray(
//               rrwebEvents.pageId,
//               pageIds.map(({ id }) => id)
//             ),
//             eq(rrwebEvents.isChunked, false)
//           ) // Only non-chunked events
//         )
//         .limit(batchSize)
//         .offset(offset);

//       allNonChunkedEvents = allNonChunkedEvents.concat(fetchedNonChunkedEvents);
//       offset += batchSize;
//     } while (fetchedNonChunkedEvents.length > 0);

//     // Merge reconstructed chunked events and non-chunked events
//     const finalEvents = [
//       ...reconstructedEvents,
//       ...allNonChunkedEvents.map((e) => e.event),
//     ];

//     console.log(
//       `Total events fetched and reconstructed: ${finalEvents.length}`
//     );

//     return finalEvents;
//   } catch (err) {
//     console.error("Error getting rrweb events by path id:", err);
//   }
// }
