"use client"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, formatUnits } from "ethers";
import { useEffect, useState } from "react";


export default function Home() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [bal,setBal] = useState<number>();
  const { walletProvider } = useWeb3ModalProvider()

  
  async function getBalance() {
    if (!isConnected) throw Error('User disconnected');
    if (!address) throw new Error('User disconnected');

    const web3Provider = new BrowserProvider(walletProvider as any)
    const clientBal = await web3Provider.getBalance(address);
    const balInEth = formatUnits(clientBal,"ether");
    setBal(Number(balInEth))
  }

  useEffect(() => {
    if (isConnected && address) {
      getBalance();
    }
  }, [isConnected, address]);
  
  return (
    <main className=" grid gap-5 py-5 w-11/12 md:w-[70%] mx-auto">
    <div className="w-full flex justify-end">
    <w3m-button />
    </div>

     <div>
     <div className='grid gap-4  '>
     <div className='grid md:flex gap-2 md:gap-4'>
      <p className='text-[14px] md:text-[16px]'>Account Address :</p>
      <div className='font-thin text-gray-300 text-[10px] md:text-[14px] overflow-hidden'>{address}</div>
      </div>

      <div className='grid md:flex gap-2 md:gap-4'>
      <p className='text-[14px] md:text-[16px]'>Account Balance :</p>
      <p className='font-thin text-gray-300 text-[10px] md:text-[14px] overflow-hidden'>{bal}</p>
      </div>
     </div>
     </div>

    </main>
  );
}
