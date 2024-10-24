"use client";

import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import {
  getAllPagesByPathId,
  getAllPagesWithNotesByPathId,
} from "@/actions/pages";
import { Skeleton } from "./ui/skeleton";
import PageCard from "./page-card";

function PagesList({ pathId }: { pathId: number }) {
  const {
    data: pagesWithNotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pagesWithNotes", pathId],
    queryFn: () => getAllPagesWithNotesByPathId(pathId),
    refetchOnWindowFocus: false,
  });

  // const [filteredPages, setFilteredPages] = useState<Page[] | undefined>();
  // const inputRef = useRef<HTMLInputElement>(null);
  // const [search, setSearch] = useState<string>("");
  const pagesRef = createRef<HTMLDivElement>();

  // useEffect(() => {
  //   if (!pagesWithNotes) return;
  //   const filteredPagesWithNotes = pagesWithNotes.filter(
  //     (item) =>
  //       item.page.url.toLowerCase().includes(search.toLowerCase()) ||
  //       item.notes?.body.toLowerCase().includes(search.toLowerCase())
  //   );

  //   setFilteredPages(filteredPages);
  // }, [search, pages]);

  useLayoutEffect(() => {
    if (!pagesRef.current) return;
    pagesRef.current.addEventListener("wheel", (event) => {
      event.preventDefault();
      pagesRef.current?.scrollBy({
        left: event.deltaY < 0 ? -30 : 30,
      });
    });
  }, [pagesRef]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 justify-center w-full">
        <div className="flex gap-1 items-center min-w-fit justify-start border border-primary/10 rounded-lg px-2 py-1 transition-all duration-500 ease-out">
          <CiSearch className="text-xl" />
          <Input
            // ref={inputRef}
            // disabled={isLoading || isError || !pages?.length}
            className="h-7 border-none ring-0 shadow-none focus-visible:ring-transparent focus-visible:shadow-none  p-0 text-sm font-light w-44 focus:w-80 transition-all duration-500 ease-out"
            type="text"
            placeholder="Search pages..."
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex space-x-4 py-4 overflow-x-scroll">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="w-80 h-96 rounded-lg" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-4">Error... {error.message}</div>
      ) : !pagesWithNotes?.length ? (
        <div className="py-4">No pages for this path found</div>
      ) : (
        <div
          className="flex space-x-4 overflow-x-scroll py-4 no-scrollbar"
          ref={pagesRef}
        >
          {pagesWithNotes.map((page) => (
            <PageCard key={page.id} page={page as any} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PagesList;
