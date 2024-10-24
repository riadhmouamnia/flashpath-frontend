"use client";
import Link from "next/link";
import useSignalRReaderSubscriber from "../../../components/useSignalRReaderSubscriber";
import { useLayoutEffect, useRef } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

export default function Replay() {
  const { events } = useSignalRReaderSubscriber({ username: "karma2" });
  const rootRef = useRef<HTMLDivElement>(null);
  const replayer = useRef<rrwebPlayer | null>(null);

  console.log("events", events);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!events.length) return;
    replayer.current = new rrwebPlayer({
      target: rootRef.current, // customizable root element
      props: {
        events: events,
        speedOption: [1, 2, 3, 4],
        autoPlay: false,
        mouseTail: {
          strokeStyle: "green",
        },
      },
    });
  }, [events]);

  if (!events.length) return <p>No events found.</p>;

  return (
    <div className="w-full">
      {/* <RealTimeRrwebPlayer event={event} /> */}
      <div ref={rootRef}></div>
    </div>
  );
}
