import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, optimismGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const mantleTestnet = {
  chainId: 5001,
  chainName: "Mantle Testnet",
  nativeCurrency: {
    name: "BitDAO",
    symbol: "BIT",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://mantle-testnet.bitdao.io",
  } as any,

  blockExplorerUrls: ["https://explorer.testnet.mantle.xyz"],
  iconUrls: ["https://bitdao.io/favicon.ico"],
  isTestnet: true,
};

const { chains, provider } = configureChains([optimismGoerli], [publicProvider()]);

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
