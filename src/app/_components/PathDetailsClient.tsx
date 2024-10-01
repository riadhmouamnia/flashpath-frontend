"use client";

import { useQuery } from "@tanstack/react-query";
import { getPathById } from "@/actions/paths";
import { getAllPagesByPathId } from "@/actions/pages";
import RrwebPlayer from "./RrwebPlayer";

export default function PathDetailsClient({
  initialPath,
  id,
}: {
  initialPath: Path;
  id: string;
}) {
  const pathQuery = useQuery({
    queryKey: ["path", id],
    queryFn: () => getPathById(Number(id)),
    initialData: initialPath,
  });

  // const pagesQuery = useQuery({
  //   queryKey: ["pages", id],
  //   queryFn: () => getAllPagesByPathId(Number(id)),
  //   initialData: initialPages,
  // });

  // if (pathQuery.isLoading || pagesQuery.isLoading) return <p>Loading...</p>;
  // if (pathQuery.isError || pagesQuery.isError) return <p>Error loading data</p>;
  // if (!pathQuery.data || !pagesQuery.data) return <p>No data</p>;

  const path = pathQuery.data;
  // const pages = pagesQuery.data;

  // const replayPath = async () => {
  //   const response = await fetch("/api/replay", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ pathId: id }),
  //   });
  //   const result = await response.json();
  //   console.log(result.data);
  // };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-md mb-6">
        <p className="text-xl">{path.name}</p>
      </div>
      <RrwebPlayer pathId={path.id} />
    </div>
  );
}
