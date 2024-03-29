import { TransactionReceipt, TransactionResponse, ethers } from "ethers";
import erc314 from "../abi/erc314.abi.json";
import { rpc_degenChain } from "../helpers/rpcs";

const degenProvider = new ethers.JsonRpcProvider(rpc_degenChain);

function getContract(erc314Address: string) {
  return new ethers.Contract(erc314Address, erc314.abi, degenProvider);
}

export async function balanceOf(erc314Address: string, address: string): Promise<bigint> {
  return getContract(erc314Address).balanceOf(address);
}

export async function getAmountOut(erc314Address: string, amountIn: bigint, isSell = false): Promise<bigint> {
  return getContract(erc314Address).getAmountOut(amountIn, isSell);
}

export async function symbol(erc314Address: string): Promise<string> {
  return getContract(erc314Address).symbol();
}

export async function receive(signer: ethers.JsonRpcSigner, erc314Address: string, receiveAmount: bigint): Promise<TransactionResponse> {
  const unsignedTx = {
    to: erc314Address,
    value: receiveAmount,
  };
  return signer.sendTransaction(unsignedTx);
}

export async function transfer(signer: ethers.JsonRpcSigner, erc314Address: string, transferAmount: bigint): Promise<TransactionResponse> {
  const unsignedTx = await getContract(erc314Address).transfer.populateTransaction(erc314Address, transferAmount);
  return signer.sendTransaction(unsignedTx);
}
