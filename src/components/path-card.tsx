"use client";
import { getLinkPreview } from "@/actions/linkPreview";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function PathCard({
  url,
  path,
}: {
  url: string;
  path: PathWithDetails;
}) {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: [{ url }],
    queryFn: async () => await getLinkPreview(url),
    refetchOnWindowFocus: false,
  });

  if (isFetching)
    return (
      <div>
        <Skeleton className="w-full h-96 rounded-lg " />
      </div>
    );
  if (isError)
    return (
      <div>
        <p>Error...{error.message}</p>
      </div>
    );

  if (!data) return null;

  const { imageUrl, title, description } = data;
  return (
    <div
      className={`${
        imageUrl ? "row-span-2" : "row-span-1"
      } w-full flex h-auto flex-col gap-2 rounded-lg bg-secondary hover:bg-secondary/60 ring-secondary ring-2 hover:shadow-lg`}
    >
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="rounded-t-lg h-auto w-full flex-1 object-cover"
          src={imageUrl}
          alt={title}
        />
      )}
      <div className="p-5">
        {title && (
          <h5 className="text-lg mb-2 font-semibold tracking-tight text-gray-900 dark:text-white truncate">
            {title}
          </h5>
        )}
        {description && (
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-light text-gray-800 dark:text-slate-500">
            {description}
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap mt-4">
          <div className=" flex flex-col gap-1">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {path.name}
            </span>
            <span className="text-sm font-light text-gray-800 dark:text-slate-500">
              {path.numberOfPages} pages | {path.numberOfNotes} notes
            </span>
            <span className="text-sm font-light text-gray-800 dark:text-slate-500">
              {path.createdAt?.toDateString()}
            </span>
          </div>
          <Button>
            <Link href={`paths/${path.id.toString()}`}>view this path</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
