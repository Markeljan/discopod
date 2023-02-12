import { PodcastCard } from "@/components/PodcastCard";

export default function Home() {
  return (
    <div className="h-full min-h-screen bg-black">
      <div className="flex flex-col w-5/6 mx-auto gap-4">
        <div className="flex flex-col space-y-10">
          <div className="flex flex-col justify-center text-center p-20 bg-slate-600 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-white">Welcome to Podchain 🎧</h1>
            <p className="text-4xl font-bold text-white">
              Become a creator and start your own Podchain to earn rewards, connect with your
              audience, and contribute to public goods.
            </p>
          </div>
        </div>
       <PodcastCard title="naamatest" hostName="naama.eth" guestName="mike.eth" topic="Carbon Footprint" fundGoal={1000} fundRaised={450}/>
      </div> 
    </div>
  );
}
