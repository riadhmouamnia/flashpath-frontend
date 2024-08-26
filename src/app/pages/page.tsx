"use client";
import { allPages } from "@/actions/pages";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Pages() {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => await allPages(),
  });

  if (isFetching) return <p>Loading...</p>;
  if (isError) return <p>Error... {error.message}</p>;

  if (!data) return null;
  return (
    <div className="p-8 max-w-screen-2xl w-full">
      <p className="my-4">all pages</p>
      <div className="p-4 flex flex-col gap-4">
        {data.map((page) => (
          <div className="my-6" key={page.id}>
            <Link href={`pages/${page.id.toString()}`}>
              <p className="">Domain: {page.domain}</p>
              <p>URL: {page.url}</p>
              <p>Time on page: {page.timeOnPage}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
