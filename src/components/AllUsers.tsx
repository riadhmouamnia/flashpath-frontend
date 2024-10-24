import { getAllUsers } from "@/actions/users";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

async function AllUsers() {
  const usersIds = (await getAllUsers()).map((user) => user.id);
  const users = await clerkClient().users.getUserList({
    userId: usersIds,
  });

  return (
    <div className="w-full">
      <p className="text-center">Flashpath by all users:</p>
      <div className="p-4 flex gap-4 mx-auto max-w-2xl items-center justify-center flex-wrap">
        {users.data.map((user) => (
          <div className="p-4 bg-slate-800 rounded-md w-28" key={user.id}>
            <Link
              href={`users/${user.id.toString()}`}
              className="flex flex-col gap-2 items-center justify-center"
            >
              <Image
                src={user.imageUrl}
                width={50}
                height={50}
                alt={user.username ?? "user"}
                className="rounded-full"
              />
              <p className="text-sm text-slate-400 font-light">
                {user.username}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;
