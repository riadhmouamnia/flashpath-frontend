"use client";
import RealTimeRrwebPlayer from "@/app/_components/RealTimeRrwebPlayer";
import useSignalRReaderSubscriber from "../../_components/useSignalRReaderSubscriber";

export default function Live() {
  const { event } = useSignalRReaderSubscriber({ username: "karma2" });

  console.log("event", event);

  return (
    <div className="w-full">
      <RealTimeRrwebPlayer event={event} />
    </div>
  );
}
