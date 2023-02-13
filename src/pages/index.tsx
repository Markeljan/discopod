import { PodcastCard } from "@/components/PodcastCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full min-h-screen bg-black flex flex-col px-10 gap-8 items-center lg:items-stretch justify-evenly">
      {/* <div className="flex flex-col p-4 mx-auto gap-4 items-center lg:items-stretch h-full"> */}
        <div className="flex justify-between flex-col lg:flex-row lg:justify-between gap-8">
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <p className="text-white text-4xl w-80 text-center lg:text-left">JOIN THE PUBLIC DISCOURSE</p>
            <Link href="https://twitter.com/discopodxyz" target="_blank">
              <button className="w-40 rounded-md text-white text-center bg-violet-500 p-2">
                JOIN THE DISCO
              </button>
            </Link>
          </div>
          <div className="flex flex-col gap-4 items-center lg:items-end">
            <p className="text-white text-4xl w-80 lg:text-right text-center"> DISCO POD FOR PUBLIC GOODS</p>
            <Link href="/create">
              <button className="w-60 rounded-md text-white text-center bg-violet-500 p-2">
                CREATE A PODCAST
              </button>
            </Link>
          </div>
        </div>

        <div className="flex lg:flex lg:flex-row flex-col justify-between items-center lg:items-stretch gap-2">
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
      {/* </div> */}
    </div>
  );
}
