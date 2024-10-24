import { getPathById } from "@/actions/paths";
import RrwebPlayer from "@/components/RrwebPlayer";
import { getPageCountByPathId } from "@/actions/pages";
import { getNotesByPathId } from "@/actions/notes";
import PagesList from "@/components/pages-list";
export default async function PathDetails({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const initialPath = await getPathById(Number(id));
  const numberOfPages = await getPageCountByPathId(Number(id));
  const notes = await getNotesByPathId(Number(id));
  // const initialPages = await getAllPagesByPathId(Number(id));

  return (
    <div className="xl:p-20 md:p-14 p-6 w-full flex flex-col gap-8">
      <div className="flex flex-col justify-center gap-4 container p-4">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
          {initialPath.name}
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, dolor
          cupiditate? Amet dolorem tempore, nemo qui modi asperiores alias quasi
          distinctio voluptatibus, hic similique atque doloribus nisi
          praesentium delectus? Beatae deserunt, suscipit itaque tempore
          similique tenetur. Eligendi sint ullam adipisci excepturi iste impedit
          perferendis at pariatur explicabo assumenda error ratione rerum illum,
          vero velit veritatis, odit ex natus corrupti. Dolores quis in quam
          esse. Eligendi adipisci unde enim labore, velit iste veritatis
          corporis alias. Magnam velit accusamus tenetur nemo quidem. Amet modi
          laudantium cupiditate hic voluptatibus aspernatur tempora, pariatur
          voluptate nihil, vitae optio numquam cumque ullam atque quo. Amet,
          beatae!
        </p>
        <div>
          <p className="text-neutral-500 italic text-sm">
            - This path has {""}
            {numberOfPages === 1 ? "1 page" : `${numberOfPages} pages`} and{" "}
            {notes.length === 1 ? "1 note" : `${notes.length} notes`}.
          </p>
          <p className="text-neutral-500 italic text-sm">
            - Created: {initialPath.createdAt?.toDateString()}
          </p>
          <p className="text-neutral-500 italic text-sm">- Spent 3 min</p>
        </div>
      </div>
      <div className="container mx-auto">
        <RrwebPlayer pathId={initialPath.id} />
      </div>
      <PagesList pathId={initialPath.id} />
    </div>
  );
}
