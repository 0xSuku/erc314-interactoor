import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import init from "@web3-onboard/core";
import { Web3OnboardProvider } from "@web3-onboard/react";
import { rpc_degenChain } from "./helpers/rpcs";
import injectedModule from "@web3-onboard/injected-wallets";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const initWeb3Onboard = init({
  theme: "dark",
  apiKey: "b18b42c1-1cb6-41fb-8cbe-e2babc0db180",
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  wallets: [injectedModule()],
  chains: [
    {
      id: "0x27bc86aa",
      token: "DEGEN",
      label: "DegenChain",
      rpcUrl: rpc_degenChain,
    },
  ],
});

root.render(
  <Web3OnboardProvider web3Onboard={initWeb3Onboard}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3OnboardProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
