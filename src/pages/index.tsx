import { Inter } from "@next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

const NAAMA_ADDRESS = "0x2Ba62a52b9244b4E45Ba52cc0B1f8D39B522025D";

export default function Home() {
  const { config } = usePrepareSendTransaction({
    request: { to: 'moxey.eth', value: BigNumber.from('10000000000000000') },
  })
  
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config);

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
          <button
            className="px-4 py-2 mt-4 text-white bg-primaryDark rounded-lg shadow-lg"
            onClick={() => sendTransaction({ to: NAAMA_ADDRESS })}
          >
        </div>
      </div>
    </div>
  );
}
