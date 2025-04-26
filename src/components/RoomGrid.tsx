
import React, { useMemo } from 'react';
import { DeviceCard } from './devices/DeviceCard';
import { useSmartHome } from '@/contexts/SmartHomeContext';

interface RoomGridProps {
  selectedRoom: string | null;
}

export function RoomGrid({ selectedRoom }: RoomGridProps) {
  const { devices } = useSmartHome();
  
  const filteredDevices = useMemo(() => {
    if (!selectedRoom || selectedRoom === 'All Rooms') return devices;
    return devices.filter(device => device.room === selectedRoom);
  }, [devices, selectedRoom]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredDevices.map(device => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
