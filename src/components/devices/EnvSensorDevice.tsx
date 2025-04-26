
import React from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { Thermometer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface EnvSensorDeviceProps {
  device: Device;
}

export function EnvSensorDevice({ device }: EnvSensorDeviceProps) {
  const { toggleDevice } = useSmartHome();
  const temperature = device.data?.temperature || 22;
  const humidity = device.data?.humidity || 45;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Thermometer className={`h-6 w-6 ${device.isOn ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room}</p>
          </div>
        </div>
        <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
      </div>

      {device.isOn && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Temperature</span>
              <span className="text-sm font-medium">{temperature}°C</span>
            </div>
            <Progress value={(temperature - 10) / 30 * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Humidity</span>
              <span className="text-sm font-medium">{humidity}%</span>
            </div>
            <Progress value={humidity} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
}
