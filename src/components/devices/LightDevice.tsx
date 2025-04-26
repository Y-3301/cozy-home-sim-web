
import React from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { Lightbulb } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface LightDeviceProps {
  device: Device;
}

export function LightDevice({ device }: LightDeviceProps) {
  const { toggleDevice, updateDeviceData } = useSmartHome();
  const brightness = device.data?.brightness || 100;

  const handleBrightnessChange = (value: number[]) => {
    updateDeviceData(device.id, { brightness: value[0] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-amber-100' : 'bg-gray-100'}`}>
            <Lightbulb className={`h-6 w-6 ${device.isOn ? 'text-amber-400' : 'text-gray-400'}`} />
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
            <span className="text-sm text-gray-500">Brightness</span>
            <span className="text-sm font-medium">{brightness}%</span>
          </div>
          <Slider 
            value={[brightness]} 
            min={10} 
            max={100} 
            step={10} 
            onValueChange={handleBrightnessChange} 
            className={device.isOn ? "" : "opacity-50 cursor-not-allowed"}
            disabled={!device.isOn}
          />
        </div>
      )}
    </div>
  );
}
