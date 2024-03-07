"use client"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, formatUnits } from "ethers";
import { useEffect, useState } from "react";


export default function Home() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [bal,setBal] = useState<number>();
  const { walletProvider } = useWeb3ModalProvider();
  const [transactionData,setTransactionData] = useState<Array>([])

  async function getBalance() {
    if (!isConnected) throw Error('User disconnected');
    if (!address) throw new Error('User disconnected');

    const web3Provider = new BrowserProvider(walletProvider as any)
    const clientBal = await web3Provider.getBalance(address);
    const balInEth = formatUnits(clientBal,"ether");
    setBal(Number(balInEth))
  }

  const fetchTransactions =async()=>{
    try {
      const txData = await fetch('https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=0xa4D9aCeFFE7A660BC222013E39af84697045B5D1&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=3NCF8YACU8R6D42I8PBCW2NJIZ6AB8B4MM')
      if (!txData.ok) {
        throw new Error(`Network response was not ok, status: ${txData.status}`);
      }
      const jsonData = await txData.json(); 
      setTransactionData(jsonData.result);
      console.log(jsonData.result);
    } catch (error) {
      console.error('Failed to fetch transaction data:', error);
    }

  };

  useEffect(() => {
    if (isConnected && address) {
      getBalance();
      fetchTransactions()
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
      <div className=' text-gray-600 text-[10px] md:text-[14px] overflow-hidden'>{address}</div>
      </div>

      <div className='grid md:flex gap-2 md:gap-4'>
      <p className='text-[14px] md:text-[16px]'>Account Balance :</p>
      <p className=' text-gray-600 text-[10px] md:text-[14px] overflow-hidden'>{bal}</p>
      </div>
     </div>
     </div>

     <div>
     <h1 className="text-bold text-xl">Transaction History</h1>
{transactionData && transactionData.map((tx,index)=>(
  <div key={index} className="py-2 text-gray-600">
     <div className="flex gap-2">
    <p className="text-semibold">TxHash</p>: <p>{tx?.hash}</p>
   </div>
   <div className="flex gap-2">
    <p>From</p>: <p>{tx.from}</p>
   </div>
   <div className="flex gap-2">
    <p>To</p>: <p>{tx.to}</p>
   </div>
   <div className="flex gap-2">
    <p>Value</p>: <p>{formatUnits(tx.value,'ether')}</p>
   </div>
  </div>
))}

     </div>

    </main>
  );
}
