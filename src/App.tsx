import React from "react";
import { ethers } from "ethers";
import * as erc314Contract from "./adapter/erc314";
import "./App.css";

function App() {
  const [contractAddress, setContractAddress] = React.useState("");
  const [yourAddress, setYourAddress] = React.useState("");
  const [enableStats, setEnableStats] = React.useState(false);
  const [yourBalance, setYourBalance] = React.useState(0n);
  const [yourBalanceNative, setYourBalanceNative] = React.useState(0n);
  const [contractSymbol, setContractSymbol] = React.useState("");

  React.useEffect(() => {
    if (contractAddress.length === 42) {
    } else {
      setContractAddress("");
      setYourAddress("");
    }
  }, [contractAddress]);

  React.useEffect(() => {
    if (contractAddress.length === 42 && yourAddress.length === 42) {
      getBalanceOf();

      async function getBalanceOf() {
        const balanceOf = await erc314Contract.balanceOf(contractAddress, yourAddress);
        setYourBalance(balanceOf);
        setYourBalanceNative(await erc314Contract.getAmountOut(contractAddress, balanceOf));
        setContractSymbol(await erc314Contract.symbol(contractAddress));
        setEnableStats(true);
      }

    } else {
      setEnableStats(false);
    }
  }, [contractAddress, yourAddress]);

  return (
    <div className="App">
      <header className="App-header">
        Enter the contract address on Degen chain.
        <input
          id="contract-address"
          type="text"
          onKeyUp={(e) => setContractAddress((document.getElementById("contract-address") as HTMLInputElement)?.value)}
        />
        {contractAddress !== "" ? (
          <>
            Enter your address on Degen chain.
            <input
              id="your-address"
              type="text"
              onKeyUp={(e) => setYourAddress((document.getElementById("your-address") as HTMLInputElement)?.value)}
            />
          </>
        ) : (
          <></>
        )}
        {enableStats ? (
          <div><br/>
            Your stats:<br/>
            Balance: {ethers.formatEther(yourBalance)}{" " + contractSymbol}<br/>
            It is worth: {ethers.formatEther(yourBalanceNative)} DEGEN
          </div>
        ) : (
          <></>
        )}
      </header>
    </div>
  );
}

export default App;
