import { PodcastCard } from "@/components/PodcastCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full min-h-screen bg-black">
      <div className="flex flex-col p-4 mx-auto gap-4">
        <div className="flex flex-row justify-between h-80">
          <div className="flex flex-col gap-4">
            <p className="text-white text-4xl w-80">JOIN THE PUBLIC DISCOURSE</p>
            <Link href="https://twitter.com/discopod_xyz" target="_blank">
              <button className="w-40 rounded-md text-white text-center bg-violet-500 p-2">
                JOIN THE DISCO
              </button>
            </Link>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <p className="text-white text-4xl w-80 text-right"> DISCO POD FOR PUBLIC GOODS</p>
            <Link href="/create">
              <button className="w-60 rounded-md text-white text-center bg-violet-500 p-2">
                CREATE A PODCAST
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-row justify-between ">
          <PodcastCard
            title="naamatest"
            hostName="naama.eth"
            guestName="mike.eth"
            topic="Carbon Footprint"
            fundGoal={1000}
            fundRaised={450}
          />
          <PodcastCard
            title="naamatest"
            hostName="naama.eth"
            guestName="mike.eth"
            topic="Carbon Footprint"
            fundGoal={1000}
            fundRaised={450}
          />
          <PodcastCard
            title="naamatest"
            hostName="naama.eth"
            guestName="mike.eth"
            topic="Carbon Footprint"
            fundGoal={1000}
            fundRaised={450}
          />
        </div>
      </div>
    </div>
  );
}
