"use client";
import { getPageCountByPathId } from "@/actions/pages";
import { getPathsByUserId } from "@/actions/paths";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function UserDetails({ params }: { params: { id: string } }) {
  const id = params.id;
  const {
    data: paths,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["paths", id],
    queryFn: async () => await getPathsByUserId(id),
    refetchOnWindowFocus: false,
  });

  if (isFetching)
    return (
      <div className="w-full h-screen flex justify-center items-start pt-24">
        <p>Loading...</p>
      </div>
    );
  if (isError)
    return (
      <div className="w-full h-screen flex justify-center items-start p-24">
        <p>Error...{error.message}</p>
      </div>
    );

  if (!paths?.length)
    return (
      <div className="w-full h-screen flex justify-center items-start p-24">
        <p>No paths found for this user</p>
      </div>
    );
  return (
    <div className="p-8 w-full">
      <p>
        This user has {paths.length === 1 ? "1 path" : `${paths.length} paths `}
      </p>
      <div className="p-4 flex flex-col gap-4">
        {paths.map((path) => (
          <div className="p-4 bg-slate-800 rounded-md" key={path.id}>
            <Link href={`/paths/${path.id.toString()}`}>
              <p className="text-xl">{path.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDetails;
