
import React from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { AirVent } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface ACDeviceProps {
  device: Device;
}

export function ACDevice({ device }: ACDeviceProps) {
  const { toggleDevice, updateDeviceData } = useSmartHome();
  const temperature = device.data?.temperature || 22;

  const handleTempChange = (value: number[]) => {
    updateDeviceData(device.id, { temperature: value[0] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <AirVent className={`h-6 w-6 ${device.isOn ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room}</p>
          </div>
        </div>
        <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
      </div>

      {device.isOn && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Temperature</span>
            <span className="text-sm font-medium">{temperature}°C</span>
          </div>
          <Slider 
            value={[temperature]} 
            min={16} 
            max={30} 
            step={0.5} 
            onValueChange={handleTempChange} 
            className={device.isOn ? "" : "opacity-50 cursor-not-allowed"}
            disabled={!device.isOn}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>16°C</span>
            <span>30°C</span>
          </div>
        </div>
      )}
    </div>
  );
}
