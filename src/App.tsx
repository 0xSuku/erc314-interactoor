import React from "react";
import { ethers } from "ethers";
import { useConnectWallet, useWallets } from "@web3-onboard/react";
import * as erc314Contract from "./adapter/erc314";
import "./App.css";

interface IToken {
  symbol: string;
}

function App() {
  const [contractAddress, setContractAddress] = React.useState("");
  const [yourAddress, setYourAddress] = React.useState("");
  const [enableStats, setEnableStats] = React.useState(false);
  const [nativeBalance, setNativeBalance] = React.useState(0n);
  const [tokenBalance, setTokenBalance] = React.useState(0n);
  const [tokenNativeBalance, setTokenNativeBalance] = React.useState(0n);
  const [contractSymbol, setContractSymbol] = React.useState("");
  const [swapTokenA, setSwapTokenA] = React.useState<undefined | IToken>(undefined);
  const [swapTokenB, setSwapTokenB] = React.useState<undefined | IToken>(undefined);
  const [swapTokenAmount_A, setSwapTokenAmount_A] = React.useState<bigint>(0n);
  const [swapTokenAmount_B, setSwapTokenAmount_B] = React.useState<bigint>(0n);
  const [inverseSwap, setInverseSwap] = React.useState(false);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  React.useEffect(() => {
    setSwapTokenA({
      symbol: "DEGEN",
    });
  }, []);

  React.useEffect(() => {
    if (contractAddress.length === 42) {
    } else {
      setContractAddress("");
      setYourAddress("");
    }
  }, [contractAddress]);

  React.useEffect(() => {
    if (contractAddress.length === 42) {
      getBalanceOf();

      async function getBalanceOf() {
        if (wallet && wallet.accounts.length > 0) {
          const _yourAddress = wallet.accounts[0].address;
          const accountBalances = wallet.accounts[0].balance;
          setNativeBalance(ethers.parseEther(accountBalances ? accountBalances["DEGEN"] : "0"));
          const balanceOf = await erc314Contract.balanceOf(contractAddress, _yourAddress);
          setTokenBalance(balanceOf);
          setTokenNativeBalance(await erc314Contract.getAmountOut(contractAddress, balanceOf));
          const contractSymbol = await erc314Contract.symbol(contractAddress);
          setContractSymbol(contractSymbol);
          setYourAddress(_yourAddress);
          setEnableStats(true);
          setSwapTokenB({
            symbol: contractSymbol,
          });
        }
      }
    } else {
      setEnableStats(false);
    }
  }, [contractAddress, wallet]);

  async function swapTokens() {
    if (wallet) {
      const provider = new ethers.BrowserProvider(wallet.provider);
      const signer = await provider.getSigner();

      if (!inverseSwap) {
        const txResponse = await erc314Contract.receive(signer, contractAddress, swapTokenAmount_A);
        try {
          const txReceipt = await txResponse.wait();
          if (txReceipt) {
          }
        } catch (e) {}
      } else {
        const txResponse = await erc314Contract.transfer(signer, contractAddress, swapTokenAmount_B);
        try {
          const txReceipt = await txResponse.wait();
          if (txReceipt) {
          }
        } catch (e) {}
      }
    }
    debugger;
  }

  async function changeTokenAmount_A(e: any) {
    if (e.target.value === "" || e.target.value === "0") {
      setSwapTokenAmount_A(0n);
      setSwapTokenAmount_B(0n);
      return;
    }
    const commitAmount = ethers.parseEther(e.target.value);
    setSwapTokenAmount_A(commitAmount);
    if (!inverseSwap) {
      const balanceOf = await erc314Contract.getAmountOut(contractAddress, commitAmount);
      setSwapTokenAmount_B(balanceOf);
    }
  }

  async function changeTokenAmount_B(e: any) {
    if (e.target.value === "" || e.target.value === "0") {
      setSwapTokenAmount_A(0n);
      setSwapTokenAmount_B(0n);
      return;
    }
    const commitAmount = ethers.parseEther(e.target.value);
    setSwapTokenAmount_B(commitAmount);
    if (inverseSwap) {
      const balanceOf = await erc314Contract.getAmountOut(contractAddress, commitAmount);
      setSwapTokenAmount_A(balanceOf);
    }
  }

  function setMax(): void {
    if (inverseSwap) {
      changeTokenAmount_B({ target: { value: ethers.formatEther(tokenBalance) } });
    } else {
      const _nativeBalance = (nativeBalance * 999n) / 1000n;
      changeTokenAmount_A({ target: { value: ethers.formatEther(_nativeBalance) } });
    }
  }

  return (
    <div className="App">
      <div className="header">
        <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
          {connecting ? "connecting" : wallet ? "disconnect" : "connect"}
        </button>
      </div>
      <div className="content">
        Enter the contract address on Degen chain.
        <input
          id="contract-address"
          type="text"
          onKeyUp={(e) => setContractAddress((document.getElementById("contract-address") as HTMLInputElement)?.value)}
          style={{ width: "322px" }}
          maxLength={42}
        />
        {enableStats ? (
          <div>
            <br></br>
            <div>Your stats:</div>
            <div>Your address: {yourAddress}</div>
            <div>Native Balance: {ethers.formatEther(nativeBalance)}</div>
            <br></br>
            <div>
              Balance: {ethers.formatEther(tokenBalance)}
              {" " + contractSymbol}
            </div>
            <div>It is worth: {ethers.formatEther(tokenNativeBalance)} DEGEN</div>
            <br></br>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                Swap <button onClick={() => setMax()}>MAX</button>
              </div>
              <div>
                {!inverseSwap ? (
                  <>
                    <input type="text" value={ethers.formatEther(swapTokenAmount_A)} onChange={changeTokenAmount_A} /> {swapTokenA?.symbol}
                  </>
                ) : (
                  <>
                    <input type="text" value={ethers.formatEther(swapTokenAmount_B)} onChange={changeTokenAmount_B} /> {swapTokenB?.symbol}
                  </>
                )}
              </div>
              <div onClick={() => setInverseSwap(!inverseSwap)}>x</div>
              <div>
                {!inverseSwap ? (
                  <>
                    <input type="text" value={ethers.formatEther(swapTokenAmount_B)} onChange={changeTokenAmount_B} /> {swapTokenB?.symbol}
                  </>
                ) : (
                  <>
                    <input type="text" value={ethers.formatEther(swapTokenAmount_A)} onChange={changeTokenAmount_A} /> {swapTokenA?.symbol}
                  </>
                )}
              </div>
              <div>
                <button onClick={swapTokens}>Swap</button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
