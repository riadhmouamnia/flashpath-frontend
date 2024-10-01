"use client";
import * as rrweb from "rrweb";
import "rrweb-player/dist/style.css";
import React, { useEffect, useLayoutEffect, useRef } from "react";

export default function RealTimeRrwebPlayer({ event }: { event: any }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const replayer = useRef<rrweb.Replayer | null>(null);
  console.log("event", event);

  useLayoutEffect(() => {
    if (rootRef.current) {
      replayer.current = new rrweb.Replayer([], {
        liveMode: true,
        root: rootRef.current,
      });
      if (event) {
        replayer.current.addEvent(event);
        const BUFFER_MS = 1000;
        replayer.current.startLive(Date.now() - BUFFER_MS);
        replayer.current.play();
      }
    }
  }, [event]);

  if (!event) {
    return <p>No event found.</p>;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[800px] h-full" ref={rootRef}></div>
    </div>
  );
}
