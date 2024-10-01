import { NextResponse } from "next/server";
import { chromium } from "playwright";
import { getAllPagesByPathId } from "@/actions/pages";
import { getInteractionsByPageId } from "@/actions/interactions";
import { type Page } from "playwright";
import { getNotesByPageId } from "@/actions/notes";

interface Interaction {
  id: number;
  createdAt: Date | null;
  pageId: number;
  type: string;
  event: unknown;
}

interface Note {
  id: number;
  createdAt: Date | null;
  pageId: number;
  body: string;
  startTime: Date | null;
  endTime: Date | null;
  tags: string[];
  color: string | null;
  favorite: boolean | null;
  hidden: boolean | null;
  sort: string | null;
}

const data: string[] = [];

export async function POST(request: Request) {
  try {
    const { pathId } = await request.json();

    console.log(`Starting replay for pathId: ${pathId}`);

    // make sure to open the browser in fullscreen mode
    // show red dot on the screen
    const browser = await chromium.launch({
      headless: false,
      args: ["--start-fullscreen"],
    });
    const context = await browser.newContext({
      colorScheme: "dark",
    });
    const page = await context.newPage();

    const pages = await getAllPagesByPathId(Number(pathId));
    console.log(`Found ${pages.length} pages for pathId: ${pathId}`);

    for (const pageData of pages) {
      console.log(`Navigating to: ${pageData.url}`);
      await page.goto(pageData.url, {
        waitUntil: "load",
      });
      const interactions = await getInteractionsByPageId(pageData.id);
      console.log(
        `Found ${interactions.length} interactions for pageId: ${pageData.id}`
      );

      //   const notes = await getNotesByPageId(pageData.id);
      //   console.log(`Found ${notes.length} notes for pageId: ${pageData.id}`);

      let shownNoteIds = new Set<number>();

      for (let i = 0; i < interactions.length; i++) {
        const interaction = interactions[i];
        const nextInteraction = interactions[i + 1];
        const delay = calculateDelay(interaction, nextInteraction);

        // Check if it's time to show any notes
        // add some del
        // for (const note of notes) {
        //   if (!shownNoteIds.has(note.id) && shouldShowNote(note, interaction)) {
        //     await page.evaluate((noteData) => {
        //       alert(
        //         `Note: ${noteData.body}\nTags: ${noteData.tags.join(", ")}`
        //       );
        //     }, note);
        //     shownNoteIds.add(note.id);
        //   }
        // }

        // await new Promise((resolve) => setTimeout(resolve, delay));

        switch (interaction.type) {
          case "CLICK_EVENT":
            await handleClickEvent(page, interaction.event as ClickEvent);
            break;
          case "INPUT_EVENT":
            await handleInputEvent(page, interaction.event as InputKeyEvent);
            break;
          case "SCROLL_EVENT":
            await handleScrollEvent(page, interaction.event as ScrollEvent);
            break;
          case "MEDIA_EVENT":
            await handleMediaEvent(page, interaction.event as MediaEvent);
            break;
          case "SELECT_EVENT":
            await handleSelectEvent(page, interaction.event as SelectEvent);
            break;
        }
      }
      //   // Show any remaining notes at the end
      //   for (const note of notes) {
      //     if (!shownNoteIds.has(note.id)) {
      //       await page.evaluate((noteData) => {
      //         alert(`Note: ${noteData.body}\nTags: ${noteData.tags.join(", ")}`);
      //         // delay for 1 second
      //       }, note);
      //       shownNoteIds.add(note.id);
      //     }
      //   }
    }
    // await browser.close();
    return NextResponse.json({ success: true, data: data as string[] });
  } catch (error) {
    console.error("Error in replay:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

function shouldShowNote(note: Note, interaction: Interaction): boolean {
  if (!note.startTime || !interaction.createdAt) return false;
  return note.startTime.getTime() <= interaction.createdAt.getTime();
}

function calculateDelay(
  currentInteraction: Interaction,
  nextInteraction: Interaction | undefined
): number {
  if (!currentInteraction.createdAt) return 0;
  if (!nextInteraction || !nextInteraction.createdAt) return 0;

  const currentTime = currentInteraction.createdAt.getTime();
  const nextTime = nextInteraction.createdAt.getTime();
  const delay = nextTime - currentTime;

  // Ensure the delay is non-negative and within a reasonable range
  return Math.max(0, Math.min(delay, 1000)); // 1000ms = 1 second
}

async function handleClickEvent(page: Page, event: ClickEvent) {
  switch (event.tagName.toLocaleLowerCase()) {
    case "button":
      if (!event.textContent) return;
      await page.getByRole("button", { name: event.textContent }).hover();
      await page.getByRole("button", { name: event.textContent }).click();
      data.push(
        `await page.getByRole("button", { name: ${event.textContent} }).click();`
      );
      break;
    case "a":
      if (!event.textContent) return;
      page.getByRole("link", { name: event.textContent }).hover();
      page.getByRole("link", { name: event.textContent }).click();
      data.push(
        `page.getByRole("link", { name: ${event.textContent} }).click();`
      );
      break;
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      if (!event.textContent) return;
      await page.getByRole("heading", { name: event.textContent }).waitFor({
        state: "visible",
        timeout: 3000,
      });
      page.getByRole("heading", { name: event.textContent }).hover();
      page.getByRole("heading", { name: event.textContent }).click();
      data.push(
        `page.getByRole("heading", { name: ${event.textContent} }).click();`
      );
      break;
    case "img":
      if (!event.attributes.alt) return;
      await page.getByAltText(event.attributes.alt).waitFor({
        state: "visible",
        timeout: 3000,
      });
      page.getByAltText(event.attributes.alt).hover();
      page.getByAltText(event.attributes.alt).click();
      data.push(`page.getByAltText(${event.attributes.alt}).click();`);
      break;
    case "p":
      if (!event.textContent) return;

      page.getByRole("paragraph", { name: event.textContent }).hover();
      page
        .getByRole("paragraph", {
          name: event.textContent,
        })
        .click();
      data.push(
        `page.getByRole("paragraph", { name: ${event.textContent} }).click();`
      );
      break;
    case "article":
      if (!event.textContent) return;

      page.getByRole("article", { name: event.textContent }).click();
      data.push(
        `page.getByRole("article", { name: ${event.textContent} }).click();`
      );
      break;
    case "section":
      if (!event.textContent) return;

      page.getByText(event.textContent).hover();
      page.getByText(event.textContent).click();
      data.push(`page.getByText(${event.textContent}).click();`);
      break;

    default:
      if (event.attributes.id && event.attributes.id !== "undefined") {
        await page
          .locator(
            `${event.tagName.toLocaleLowerCase()}#${event.attributes.id}`
          )
          .click();
        data.push(
          `page.locator('${event.tagName.toLocaleLowerCase()}#${
            event.attributes.id
          }').click();`
        );
      } else if (
        event.attributes.class &&
        event.attributes.class !== "undefined"
      ) {
        await page
          .locator(
            `${event.tagName.toLocaleLowerCase()}.${event.attributes.class}`
          )
          .click();
        data.push(
          `page.locator('${event.tagName.toLocaleLowerCase()}.${
            event.attributes.class
          }').click();`
        );
      } else {
        return;
      }
      //   page.locator(`.${event.attributes.class}`).hover();
      //   page.locator(`.${event.attributes.class}`).click();
      break;
  }

  // get the selector for the elemnt based on what we have on the event.attributes objects
  //   const selectors = Object.entries(event.attributes).map(
  //     ([key, value]) => `${key}="${value}"`
  //   );

  //   // make a locator based on what we have on selectors
  //   const locator = page.locator(selectors.join(" "));
  //   console.log(`Locator: ${locator}`);
  //   if (!locator) return;

  //   await locator.click();
  //   console.log(`Attempting to click at: ${event.clientX}, ${event.clientY}`);
  //   await page.mouse.click(event.clientX, event.clientY);
}

async function handleInputEvent(page: Page, event: InputKeyEvent) {
  try {
    console.log(`Attempting to fill input: ${event.inputName}`);
    if (event.placeholder) {
      page
        .getByPlaceholder(event.placeholder)
        .pressSequentially(event.inputValue, { delay: 200 });
      data.push(
        `page.getByPlaceholder(${event.placeholder}).pressSequentially(${event.inputValue}, { delay: 200 });`
      );
    } else {
      if (!event.inputName) return;
      page
        .locator(`[name="${event.inputName}"]`)
        .pressSequentially(event.inputValue, { delay: 200 });
      // data.push(
      //   `page.locator(`[name = ${event.inputName}]`).pressSequentially(${event.inputValue}, { delay: 200 })`
      // );
    }
    // // Fill the input
    // await locator.fill(event.inputValue);
    // await locator.blur();
    console.log(`Successfully filled input: ${event.inputName}`);
  } catch (error) {
    console.warn(`Failed to interact with input ${event.inputName}: ${error}`);
    // Log the current page content for debugging
    const pageContent = await page.content();
    console.log(`Page content at time of error:\n${pageContent}`);
  }
}

async function handleScrollEvent(page: Page, event: ScrollEvent) {
  await page.evaluate(
    ({ scrollX, scrollY }: { scrollX: number; scrollY: number }) => {
      window.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: "smooth",
      });
    },
    event
  );
  data.push(`page.evaluate(({ ${event.scrollX}, ${event.scrollY} }: { scrollX: number; scrollY: number }) => {
      window.scrollTo({
        left: ${event.scrollX},
        top: ${event.scrollY},
        behavior: "smooth",
      });
    }, event);`);
}

async function handleMediaEvent(page: Page, event: MediaEvent) {
  // Implement media event handling
}

async function handleSelectEvent(page: Page, event: SelectEvent) {
  await page.evaluate((text: string) => {
    const range = document.createRange();
    const selection = window.getSelection();

    // Find the text node containing the highlighted text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.includes(text)) {
        const start = node.textContent.indexOf(text);
        range.setStart(node, start);
        range.setEnd(node, start + text.length);
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Highlight the selected text
        if (selection?.rangeCount) {
          try {
            const highlightSpan = document.createElement("span");
            highlightSpan.style.backgroundColor = "yellow";
            highlightSpan.style.color = "black";
            highlightSpan.textContent = text;
            range.deleteContents();
            range.insertNode(highlightSpan);
          } catch (error) {
            console.warn("Failed to highlight text:", error);
          }
        }
        break;
      }
    }
  }, event.highlightedText);
  data.push(`page.evaluate((text: string) => {
    const range = document.createRange();
    const selection = window.getSelection();
  }, ${event.highlightedText});`);
}
