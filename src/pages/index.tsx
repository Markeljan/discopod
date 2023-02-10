import { Inter } from "@next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <ConnectButton />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>{" "}
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  );
}
