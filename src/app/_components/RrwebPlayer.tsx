"use client";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRrwebEventsByPathId } from "@/actions/rrweb_events";
import { unpack } from "@rrweb/packer";
import { EventType } from "rrweb";

export default function RrwebPlayer({ pathId }: { pathId: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rrwebEvents", pathId],
    queryFn: () => getAllRrwebEventsByPathId(pathId),
    refetchOnWindowFocus: false,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const replayer = useRef<rrwebPlayer | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!data?.length) return;
    replayer.current = new rrwebPlayer({
      target: rootRef.current, // customizable root element
      props: {
        events: data as any[],
        speedOption: [1, 2, 3, 4],
        autoPlay: false,
        mouseTail: {
          strokeStyle: "green",
        },
        unpackFn: unpack, // use pack function on the recorder side and unpack function here to reduce the size of data query
        // and to avoid NeonDbError: response is too large (max is 10485760 bytes), (seems like github file size are too large compared to other websites)
      },
    });
  }, [data]);

  if (isLoading) return <p>Loading video...</p>;
  if (isError) return <p>Error...</p>;

  //   const handlePlay = () => {
  //     if (!replayer.current) return;
  //     replayer.current?.play();
  //     setIsPlaying(true);
  //   };

  //   const handlePause = () => {
  //     if (!replayer.current) return;
  //     replayer.current?.pause();
  //     setIsPlaying(false);
  //   };

  //   const handleSpeed = (speed: number) => {
  //     if (!replayer.current) return;
  //     replayer.current.config.speed = speed;
  //   };

  if (!data?.length) return <p>No events found...</p>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* <div className="flex flex-col items-center justify-center">
        <button
          className={`bg-green-500 text-white p-2 rounded-md ${
            isPlaying ? "bg-red-500" : ""
          }`}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className="flex flex-row items-center justify-center">
        <button onClick={() => handleSpeed(1)}>1</button>
        <button onClick={() => handleSpeed(2)}>2</button>
        <button onClick={() => handleSpeed(3)}>3</button>
        <button onClick={() => handleSpeed(4)}>4</button>
      </div> */}
      <div ref={rootRef}></div>
    </div>
  );
}
