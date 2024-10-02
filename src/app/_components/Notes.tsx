"use client";

import { getNotesByPathId } from "@/actions/notes";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function Notes({ pathId }: { pathId: number }) {
  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", pathId],
    queryFn: () => getNotesByPathId(pathId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  if (isError) {
    return <div>Error... {error.message}</div>;
  }

  if (!notes?.length) {
    return <div>No notes for this path found</div>;
  }
  return (
    <div>
      <p>Notes for this path: </p>
      <div className="p-2 flex flex-col gap-2">
        {notes.map((note) => (
          <Link
            href={note.pageUrl}
            target="_blank"
            key={note.id}
            className="p-4 bg-slate-700 hover:bg-slate-600 rounded-md"
          >
            <p>{note.body}</p>
            <p className="text-sm font-light italic text-ellipsis overflow-hidden">
              url: {note.pageUrl}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Notes;
