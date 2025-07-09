import React from 'react';
import Staking from './Staking';
import Governance from './Governance';
import KikundiChat from './KikundiChat';

export default function Home() {
  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🌱 Kikundi DAO Dashboard</h1>
      <Staking />
      <Governance />
      <KikundiChat />
    </div>
  );
}