
import React from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { Plug } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface SmartPlugDeviceProps {
  device: Device;
}

export function SmartPlugDevice({ device }: SmartPlugDeviceProps) {
  const { toggleDevice } = useSmartHome();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Plug className={`h-6 w-6 ${device.isOn ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room}</p>
          </div>
        </div>
        <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Power</span>
        <Badge variant={device.isOn ? "default" : "outline"} className={device.isOn ? "bg-green-500" : "text-gray-500"}>
          {device.isOn ? "ON" : "OFF"}
        </Badge>
      </div>
    </div>
  );
}
