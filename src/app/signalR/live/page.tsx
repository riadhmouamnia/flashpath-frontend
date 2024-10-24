"use client";
import RealTimeRrwebPlayer from "@/components/RealTimeRrwebPlayer";
import useSignalRReaderSubscriber from "../../../components/useSignalRReaderSubscriber";

export default function Live() {
  const { event } = useSignalRReaderSubscriber({ username: "karma2" });

  console.log("event", event);

  return (
    <div className="w-full">
      <RealTimeRrwebPlayer event={event} />
    </div>
  );
}
