import { getNotesByPageId } from "@/actions/notes";
import { getPageById } from "@/actions/pages";
import { formatTime } from "@/lib/utils";
import PageDetailsView from "@/components/page-details-view";
import { CiBookmarkCheck } from "react-icons/ci";
import { CiBookmarkMinus } from "react-icons/ci";
import { CgNotes } from "react-icons/cg";
import { CgLink } from "react-icons/cg";
import { CiGlobe } from "react-icons/ci";
import Link from "next/link";
import { getLinkPreview } from "@/actions/linkPreview";

// revalidate the page every 1000 seconds
export const revalidate = 1000;
export default async function PageDetails({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const page = await getPageById(Number(id));
  const notes = await getNotesByPageId(Number(id));
  const preview = await getLinkPreview(page.url);

  return (
    <div className="xl:p-20 md:p-14 p-6 w-full flex flex-col items-start justify-center gap-4">
      <div className="bg-secondary p-4 rounded-md w-full flex flex-col md:flex-row gap-4 items-start justify-between">
        <div>
          <Link
            href={page.url}
            className="text-lg font-bold flex gap-1 items-center"
            target="_blank"
          >
            <CgLink className="text-xl" />
            {page.url}
          </Link>
          <p className="flex gap-1 items-center">
            <CiGlobe className="text-lg" /> {page.domain}
          </p>
          <p className="flex gap-1 items-center">
            <CgNotes className="text-lg" /> {notes.length} notes
          </p>
          <p className="text-sm text-neutral-500">
            Spent on this page: {formatTime(Number(page.timeOnPage))}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div>
            {page.isBookmarked ? (
              <p className="flex gap-1 items-center justify-center">
                Bookmarked <CiBookmarkCheck className="text-xl" />
              </p>
            ) : (
              <p className="flex gap-1 items-center justify-center">
                Not bookmarked <CiBookmarkMinus className="text-xl" />
              </p>
            )}
          </div>
          <p className="text-sm text-neutral-500">
            {page.createdAt?.toLocaleString()}
          </p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold">{preview?.title}</p>
        <p>{preview?.description}</p>
      </div>
      <div className="grid grid-cols-8 gap-4 xl:h-[80vh] w-full">
        <div className="w-full col-span-8 xl:col-span-6">
          <PageDetailsView page={page} />
        </div>
        <div className="flex flex-col gap-2 p-2 col-span-8 xl:col-span-2 h-full overflow-y-scroll no-scrollbar">
          {notes.map((note) => (
            <div className="bg-secondary p-4 rounded-md" key={note.id}>
              {note.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
