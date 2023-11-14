import '../styles/globals.css';
import type { AppProps } from "next/app";
import Head from 'next/head';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet,
} from "@thirdweb-dev/react";

// This is the chain your dApp will work on.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        embeddedWallet(),
      ]}
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
        authUrl: "/api/auth",
      }}
    >
        <Head>
        <title>PASTA YOLO LUSTRUM 2023</title>
        <link rel="icon" href="/YOLO-COIN.png" />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
