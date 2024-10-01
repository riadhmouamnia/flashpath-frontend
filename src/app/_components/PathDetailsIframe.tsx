"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { getInteractionsByPageId } from "@/actions/interactions";

interface Interaction {
  id: number;
  createdAt: Date;
  pageId: number;
  type: string;
  event: ClickEvent | KeyEvent | ScrollEvent | MediaEvent | SelectEvent;
}

interface ClickEvent {
  clientX: number;
  clientY: number;
}

interface KeyEvent {
  inputName: string;
  inputValue: string;
}

interface ScrollEvent {
  scrollX: number;
  scrollY: number;
}

interface MediaEvent {
  // Add properties as needed
}

interface SelectEvent {
  highlightedText: string;
}

function playInteractions(
  iframe: HTMLIFrameElement,
  interactions: Interaction[]
) {
  let index = 0;

  function playNextInteraction() {
    if (index >= interactions.length) return;

    const interaction = interactions[index];
    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) return;

    switch (interaction.type) {
      case "CLICK_EVENT":
        const clickEvent = interaction.event as ClickEvent;
        const element = iframeDocument.elementFromPoint(
          clickEvent.clientX,
          clickEvent.clientY
        );
        if (element) (element as HTMLElement).click();
        break;
      case "KEY_EVENT":
        const keyEvent = interaction.event as KeyEvent;
        const inputElement = iframeDocument.querySelector(
          keyEvent.inputName
        ) as HTMLInputElement;
        if (inputElement) inputElement.value = keyEvent.inputValue;
        break;
      case "SCROLL_EVENT":
        const scrollEvent = interaction.event as ScrollEvent;
        iframe.contentWindow?.scrollTo({
          left: scrollEvent.scrollX,
          top: scrollEvent.scrollY,
          behavior: "smooth",
        });
        break;
      case "SELECT_EVENT":
        const selectEvent = interaction.event as SelectEvent;
        highlightText(iframeDocument, selectEvent.highlightedText);
        break;
      // Implement MEDIA_EVENT if needed
    }

    index++;
    if (index < interactions.length) {
      const delay = calculateDelay(interaction, interactions[index]);
      setTimeout(playNextInteraction, delay);
    }
  }

  playNextInteraction();
}

function calculateDelay(
  currentInteraction: Interaction,
  nextInteraction: Interaction
): number {
  const currentTime = new Date(currentInteraction.createdAt).getTime();
  const nextTime = new Date(nextInteraction.createdAt).getTime();
  const delay = nextTime - currentTime;

  return Math.max(0, Math.min(delay, 5000)); // Cap at 5 seconds
}

function highlightText(document: Document, text: string) {
  const range = document.createRange();
  const selection = document.getSelection();

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

      const highlightSpan = document.createElement("span");
      highlightSpan.style.backgroundColor = "yellow";
      highlightSpan.style.color = "black";
      range.surroundContents(highlightSpan);
      break;
    }
  }
}

export default function PathDetailsIframe({
  initialPath,
  initialPages,
  id,
}: {
  initialPath: Path;
  initialPages: Page[];
  id: string;
}) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: currentInteractions, isLoading: isLoadingInteractions } =
    useQuery({
      queryKey: ["interactions", initialPages[currentPageIndex]?.id],
      queryFn: () =>
        getInteractionsByPageId(initialPages[currentPageIndex]?.id),
      enabled: isPlaying && !!initialPages[currentPageIndex]?.id,
    });

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setCurrentPageIndex(0);
  };

  useEffect(() => {
    if (
      isPlaying &&
      initialPages.length > 0 &&
      !isLoadingInteractions &&
      currentInteractions
    ) {
      const currentPage = initialPages[currentPageIndex];

      if (iframeRef.current) {
        iframeRef.current.src = currentPage.url;

        iframeRef.current.onload = () => {
          if (iframeRef.current) {
            playInteractions(iframeRef.current, currentInteractions);
          }
        };
      }

      const totalDuration = currentInteractions.reduce(
        (sum, interaction, index) => {
          if (index < currentInteractions.length - 1) {
            return (
              sum + calculateDelay(interaction, currentInteractions[index + 1])
            );
          }
          return sum;
        },
        0
      );

      const timer = setTimeout(() => {
        if (currentPageIndex < initialPages.length - 1) {
          setCurrentPageIndex(currentPageIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, totalDuration + 1000); // Add 1 second buffer

      return () => clearTimeout(timer);
    }
  }, [
    isPlaying,
    currentPageIndex,
    initialPages,
    isLoadingInteractions,
    currentInteractions,
  ]);

  return (
    <div className="p-8 max-w-screen-2xl w-full">
      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-md mb-6">
        <p className="text-xl">{initialPath.name}</p>
        <button
          className="bg-slate-700 rounded-md px-4 py-2 hover:bg-slate-600"
          onClick={togglePlay}
        >
          {isPlaying ? "⏹️ Stop Playback" : "▶️ Play this path"}
        </button>
      </div>
      {initialPages.length > 0 && (
        <div className="mb-6">
          <iframe
            ref={iframeRef}
            src={initialPages[currentPageIndex].url}
            className="w-full h-[600px] border-0"
            title="Session Replay"
          ></iframe>
          <p className="mt-2">
            Page {currentPageIndex + 1} of {initialPages.length}
          </p>
          {isLoadingInteractions && <p>Loading interactions...</p>}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {initialPages.map((page) => (
          <div key={page.id} className="p-4 bg-slate-800 rounded-md">
            <p>{page.domain}</p>
            <p
              className="truncate hover:text-clip hover:whitespace-normal"
              title={page.url}
            >
              {page.url}
            </p>
            <p>{page.timeOnPage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
