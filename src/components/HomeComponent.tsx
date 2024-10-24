"use client";
import {
  getAllPaths,
  getAllPathsWithPages,
  getPathsWithDetails,
} from "@/actions/paths";
import { useQuery } from "@tanstack/react-query";
import PathCard from "./path-card";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

function HomeComponent() {
  const {
    data: paths,
    isFetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pathsWithDetails"],
    queryFn: async () => await getPathsWithDetails(),
    refetchOnWindowFocus: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const [filteredPaths, setFilteredPaths] = useState<PathWithDetails[]>([]);

  useEffect(() => {
    if (!paths?.length) return;
    const filteredPaths = paths.filter((path) =>
      path.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPaths(filteredPaths as any[]);
  }, [search, paths]);

  if (isFetching)
    return (
      <div className="container flex flex-col gap-4 p-4">
        <div className="flex justify-center items-center">
          <Skeleton className="w-80 h-10 rounded-lg self-end" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-auto grid-flow-dense">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-96 rounded-lg self-end" />
          ))}
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="w-full h-screen flex justify-center items-start p-24">
        <p>Error...{error.message}</p>
      </div>
    );

  if (!paths) return null;
  return (
    <div className="container flex flex-col gap-4 p-4">
      <div className="flex justify-center items-center">
        <div className="flex gap-1 items-center min-w-fit justify-start border border-primary/10 rounded-lg px-2 py-1 transition-all duration-500 ease-out">
          <CiSearch className="text-xl" />
          <Input
            ref={inputRef}
            disabled={isLoading || isError || !paths?.length}
            className="h-7 border-none ring-0 shadow-none focus-visible:ring-transparent focus-visible:shadow-none  p-0 text-sm font-light w-44 focus:w-80 transition-all duration-500 ease-out"
            type="text"
            placeholder="Search paths..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div
        // className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 rows-auto grid-flow-dense"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {filteredPaths.map((path) => (
          <PathCard key={path.id} path={path as any} url={path.pages[0].url} />
        ))}
      </div>
    </div>
  );
}

export default HomeComponent;
