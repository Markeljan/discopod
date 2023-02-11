import { Inter } from "@next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="h-screen bg-primary">
      <div className="flex-col w-5/6 mx-auto">
        <div className="flex justify-end p-4">
          <ConnectButton />
        </div>
        <div className="flex-col justify-center text-center p-20 bg-primaryDark rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white">Welcome to Podchain 🎧</h1>
          <p className="text-4xl font-bold text-white">
            Become a creator and start your own Podchain to earn rewards, connect with your
            audience, and give to public goods.
          </p>
        </div>
      </div>
    </div>
  );
}
