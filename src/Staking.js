import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getKktContract } from './contracts'; // you should define this helper

export default function Staking() {
  const [balance, setBalance] = useState('0');
  const [staked, setStaked] = useState('0');
  const [rewards, setRewards] = useState('0');
  const [autoCompound, setAutoCompound] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = getKktContract(provider);

  useEffect(() => {
    async function fetchData() {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const bal = await contract.balanceOf(address);
      const stk = await contract.stakedOf(address);
      const rew = await contract.earned(address);
      setBalance(ethers.utils.formatUnits(bal, 18));
      setStaked(ethers.utils.formatUnits(stk, 18));
      setRewards(ethers.utils.formatUnits(rew, 18));
    }
    fetchData();
  }, []);

  const handleStake = async () => {
    const amt = prompt("Enter KKT amount to stake:");
    if (!amt) return;
    const tx = await contract.stake(ethers.utils.parseUnits(amt, 18));
    await tx.wait();
    alert(`✅ Staked ${amt} KKT`);
    window.location.reload();
  };

  const handleUnstake = async () => {
    const amt = prompt("Enter KKT amount to unstake:");
    if (!amt) return;
    const tx = await contract.withdraw(ethers.utils.parseUnits(amt, 18));
    await tx.wait();
    alert(`🔻 Unstaked ${amt} KKT`);
    window.location.reload();
  };

  const handleClaimRewards = async () => {
    const tx = await contract.getReward();
    await tx.wait();
    alert("🎁 Rewards claimed!");
    window.location.reload();
  };

  const toggleAutoCompound = async () => {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const tx = await contract.setAutoCompound(address, !autoCompound);
    await tx.wait();
    alert(`🔁 Auto-Compound ${!autoCompound ? 'Enabled' : 'Disabled'}`);
    setAutoCompound(!autoCompound);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-xl text-white">
      <h2 className="text-2xl mb-4">🌱 KKT Staking Panel</h2>
      <p><strong>Wallet Balance:</strong> {balance} KKT</p>
      <p><strong>Currently Staked:</strong> {staked} KKT</p>
      <p><strong>Pending Rewards:</strong> {rewards} KKT</p>

      <div className="mt-4 space-x-3">
        <button
          onClick={handleStake}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
        >
          ✅ Stake
        </button>

        <button
          onClick={handleUnstake}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold"
        >
          🔻 Unstake
        </button>

        <button
          onClick={handleClaimRewards}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white font-bold"
        >
          🎁 Claim Rewards
        </button>

        <button
          onClick={toggleAutoCompound}
          className={`px-4 py-2 rounded font-bold ${
            autoCompound ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          🔁 Auto-Compound: {autoCompound ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}