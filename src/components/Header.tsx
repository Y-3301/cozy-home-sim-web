
import React from 'react';
import { House } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <House className="h-6 w-6 text-iot-blue" />
          <h1 className="text-xl font-bold text-gray-800">Smart Home IoT Simulation</h1>
        </div>
      </div>
    </header>
  );
}
