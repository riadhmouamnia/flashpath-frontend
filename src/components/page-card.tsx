"use client";
import { getLinkPreview } from "@/actions/linkPreview";
import { formatTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CiTimer } from "react-icons/ci";
import { Skeleton } from "./ui/skeleton";

function PageCard({ page }: { page: Page & { notes: Note[] } }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [{ url: page.url }],
    queryFn: async () => await getLinkPreview(page.url),
    refetchOnWindowFocus: false,
  });

  return (
    <Link
      href={`/pages/${page.id}`}
      key={page.id}
      className="min-w-80 flex flex-col space-y-4"
    >
      <div className="bg-secondary pb-4 rounded-lg hover:bg-secondary/60">
        <div>
          {isLoading && (
            <div>
              <Skeleton className="w-full h-72 rounded-md" />
            </div>
          )}
          {isError && <p>Error: {error.message}</p>}
          {data && (
            <div className="mb-2">
              {data.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="rounded-t-md w-full h-72 object-cover"
                  src={data.imageUrl}
                  alt={data.title}
                />
              ) : (
                <div className="h-72 px-4 bg-neutral-500" />
              )}
              <p className="mt-2 px-4 text-sm font-light">{data.description}</p>
            </div>
          )}
        </div>
        <p className="px-4 text-lg font-bold">{page.domain}</p>
        <p className="px-4 truncate text-sm font-light">{page.url}</p>
        <p className="px-4 text-sm text-neutral-500 font-light italic">
          Time on page: {formatTime(Number(page.timeOnPage))}
        </p>
        <p className="px-4 text-sm text-neutral-500 font-light italic flex gap-1 items-center">
          <CiTimer />
          <span>{page.createdAt?.toLocaleString()}</span>
        </p>
      </div>
      {page.notes.length ? (
        <div className="flex flex-col space-y-2 h-80 overflow-y-scroll no-scrollbar">
          {page.notes.map((note) => (
            <div
              key={note.id}
              className="text-sm text-neutral-500 font-light italic flex gap-1 items-center bg-secondary rounded-md p-4 hover:bg-secondary/60"
            >
              <span
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: note.color! }}
              ></span>
              <span className="truncate flex-1">{note.body}</span>
              <span>
                {note.createdAt?.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 font-light italic">No notes.</p>
      )}
    </Link>
  );
}

export default PageCard;
