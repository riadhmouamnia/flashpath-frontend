"use client";
import { getRrwebEventsByPageId } from "@/actions/rrweb_events";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useRef } from "react";
import { EventType, unpack } from "rrweb";
import rrwebPlayer from "rrweb-player";
import * as rrweb from "rrweb";
// import "../app/rrweb_styles.css";
import "rrweb-player/dist/style.css";
import { Skeleton } from "./ui/skeleton";

export default function PageDetailsView({ page }: { page: Page }) {
  const id = page.id;
  const rootRef = useRef<HTMLDivElement>(null);
  const replayer = useRef<rrwebPlayer | null>(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rrwebEvents", id],
    queryFn: () => getRrwebEventsByPageId(id),
    refetchOnWindowFocus: false,
  });

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!data?.length) return;
    replayer.current = new rrwebPlayer({
      target: rootRef.current, // customizable root element
      props: {
        // useVirtualDom: true,
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

    rootRef.current.querySelector("iframe")?.setAttribute("scrolling", "true");

    // replayer.current = new rrweb.Replayer(data as any[], {
    //   root: rootRef.current,
    // });
    // replayer.current?.play();

    return () => {
      if (!replayer.current || !rootRef.current) return;
      replayer.current = null;
      rootRef.current.innerHTML = "";
    };
  }, [data]);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <Skeleton className="w-full h-full rounded-xl" />
      ) : isError ? (
        <div className="flex items-center justify-center h-[80vh] w-[100%]">
          Error... {error.message}
        </div>
      ) : !data?.length ? (
        <div className="flex items-center justify-center h-[80vh] w-[100%]">
          No events found...
        </div>
      ) : null}
      <div
        className="flex items-center justify-center h-[80vh] w-[100%]"
        // className="flex items-center justify-center"
        ref={rootRef}
      ></div>
    </div>
  );
}
