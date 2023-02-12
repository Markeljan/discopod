import { Inter } from "@next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="h-full min-h-screen bg-primary">
      <div className="flex-col w-5/6 mx-auto">
        <Navbar />
        <div className="flex-col space-y-10">
          <div className="flex-col justify-center text-center p-20 bg-primaryDark rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-white">Welcome to Podchain 🎧</h1>
            <p className="text-4xl font-bold text-white">
              Become a creator and start your own Podchain to earn rewards, connect with your
              audience, and contribute to public goods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
