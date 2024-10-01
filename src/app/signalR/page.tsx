import Link from "next/link";

export default function SignalR() {
  return (
    <div className="w-full flex items-center justify-center h-[400px] mt-10 gap-2">
      <Link className="px-2 py-1 rounded-md bg-slate-800" href="/signalR/live">
        Live events
      </Link>
      <Link
        className="px-2 py-1 rounded-md bg-slate-800"
        href="/signalR/replay"
      >
        Replay events
      </Link>
    </div>
  );
}
