"use client";
import { useQuery } from "@tanstack/react-query";
import { getPageById } from "../../../actions/pages";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";

export default function PageDetails() {
  const params = useParams();
  const id = params.id;
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => await getPageById(Number(id)),
  });

  if (isFetching) return <p>Loading...</p>;
  if (isError) return <p>Error... {error.message}</p>;

  return (
    <div>
      <p>page details:</p>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
