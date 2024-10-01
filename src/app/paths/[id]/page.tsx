import { getPathById } from "@/actions/paths";
import RrwebPlayer from "@/app/_components/RrwebPlayer";
import Notes from "@/app/_components/Notes";
import { getPageCountByPathId } from "@/actions/pages";
export default async function PathDetails({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const initialPath = await getPathById(Number(id));
  const numberOfPages = await getPageCountByPathId(Number(id));
  // const initialPages = await getAllPagesByPathId(Number(id));

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-md mb-4">
        <p className="text-xl">{initialPath.name}</p>
        <p>
          {numberOfPages === 1
            ? "1 page on this path"
            : `${numberOfPages} pages on this path`}
        </p>
        {/* <button
          className="bg-slate-700 rounded-md px-4 py-2 hover:bg-slate-600"
          onClick={replayPath}
          >
          ▶️ Replay this path
          </button> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <div className="col-span-4 p-4 bg-slate-800 rounded-md">
          <RrwebPlayer pathId={initialPath.id} />
        </div>
        <div className="p-4 bg-slate-800 rounded-md col-span-2">
          <Notes pathId={initialPath.id} />
        </div>
      </div>
    </div>
  );
}
