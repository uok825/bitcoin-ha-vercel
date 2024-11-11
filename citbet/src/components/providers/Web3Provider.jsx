import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export const citreaTestnet = {
  id: 5115,
  name: "Citrea Testnet",
  nativeCurrency: { name: "Bitcoin", symbol: "cBTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.citrea.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Citrea Explorer",
      url: "https://explorer.testnet.citrea.xyz",
    },
  },
};

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [citreaTestnet],

    // Required API Keys
    walletConnectProjectId: import.meta.env
      .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Betrea",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
