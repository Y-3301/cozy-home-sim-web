
import React, { useMemo } from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { House } from 'lucide-react';

interface RoomSelectorProps {
  selectedRoom: string | null;
  setSelectedRoom: (room: string) => void;
}

export function RoomSelector({ selectedRoom, setSelectedRoom }: RoomSelectorProps) {
  const { devices } = useSmartHome();
  
  const rooms = useMemo(() => {
    const uniqueRooms = ['All Rooms', ...new Set(devices.map(device => device.room))];
    return uniqueRooms;
  }, [devices]);

  return (
    <div className="mb-6">
      <Tabs 
        defaultValue={selectedRoom || 'All Rooms'} 
        value={selectedRoom || 'All Rooms'}
        onValueChange={setSelectedRoom}
        className="w-full overflow-x-auto"
      >
        <TabsList className="flex space-x-2 w-max min-w-full">
          {rooms.map(room => (
            <TabsTrigger key={room} value={room} className="flex items-center gap-1 px-4 py-2">
              {room === 'All Rooms' && <House className="h-4 w-4" />}
              {room}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
