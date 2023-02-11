import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const mantleTestnet: Chain = {
  id: 50001,
  name: "Mantle Testnet",
  network: "testnet",
  nativeCurrency: {
    name: "BitDAO",
    symbol: "BIT",
    decimals: 18,
  },
  rpcUrls: { default: "https://rpc.testnet.mantle.xyz" } as any,
  blockExplorers: {
    default: { name: "explorer.mantle", url: "https://explorer.testnet.mantle.xyz" },
  },
  testnet: true,
};

const { chains, provider } = configureChains([mantleTestnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "Podchain",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
