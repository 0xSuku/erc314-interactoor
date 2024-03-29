import { ethers } from "ethers";
import erc314 from "../abi/erc314.abi.json";

const degenProvider = new ethers.JsonRpcProvider("https://rpc.degen.tips");

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
