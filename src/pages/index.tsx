import { PodcastCard } from "@/components/PodcastCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full min-h-screen bg-black">
      <div className="flex flex-col p-4 mx-auto gap-4">
        <div className="md:flex-row xs:flex-col justify-between h-80 md:px-20">
          <div className="flex flex-col gap-4">
            <p className="text-white text-4xl w-80">JOIN THE PUBLIC DISCOURSE</p>
            <Link href="https://twitter.com/discopodxyz" target="_blank">
              <button className="w-40 rounded-md text-white text-center bg-violet-500 p-2">
                JOIN THE DISCO
              </button>
            </Link>
          </div>
          <div className="flex flex-col gap-4 items-end my-10">
            <p className="text-white text-4xl w-80 text-right"> DISCO POD FOR PUBLIC GOODS</p>
            <Link href="/create">
              <button className="w-60 rounded-md text-white text-center bg-violet-500 p-2">
                CREATE A PODCAST
              </button>
            </Link>
          </div>
        </div>

        <div className="md:flex md:flex-row xs:flex-col justify-between ">
          <PodcastCard
            title="Carbon Credits in Web3"
            hostName="mark.eth"
            guestName="mike.eth"
            topic="Carbon Credits in Web3"
            fundGoal={250}
            fundRaised={220}
          />
          <PodcastCard
            title="Ocean Cleaning"
            hostName="mary.eth"
            guestName="mike.eth"
            topic="Ocean Cleaning"
            fundGoal={500}
            fundRaised={450}
          />
          <PodcastCard
            title="Climate Tech"
            hostName="naama.eth"
            guestName="mike.eth"
            topic="Climate Tech"
            fundGoal={1000}
            fundRaised={450}
          />
        </div>
      </div>
    </div>
  );
}
