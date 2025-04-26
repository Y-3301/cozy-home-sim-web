
import React, { useEffect } from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface MotionSensorDeviceProps {
  device: Device;
}

export function MotionSensorDevice({ device }: MotionSensorDeviceProps) {
  const { toggleDevice, updateDeviceData, addSecurityEvent } = useSmartHome();
  const motionDetected = device.data?.motion || false;

  // This is just for the simulation - normally this would be triggered by a real sensor
  const simulateMotion = () => {
    if (device.isOn && !motionDetected) {
      updateDeviceData(device.id, { motion: true });
      
      addSecurityEvent({
        deviceId: device.id,
        deviceName: device.name,
        deviceType: device.type,
        room: device.room,
        event: 'Motion detected',
        priority: 'medium',
      });
      
      // Automatically reset motion after some time
      setTimeout(() => {
        updateDeviceData(device.id, { motion: false });
      }, 5000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <User className={`h-6 w-6 ${device.isOn ? 'text-purple-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room}</p>
          </div>
        </div>
        <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Status</span>
        {device.isOn ? (
          motionDetected ? (
            <Badge variant="default" className="bg-red-500 animate-pulse-subtle">Motion Detected</Badge>
          ) : (
            <Badge variant="outline" className="text-green-500">Clear</Badge>
          )
        ) : (
          <Badge variant="outline" className="text-gray-400">Inactive</Badge>
        )}
      </div>

      {device.isOn && (
        <button 
          onClick={simulateMotion}
          className="w-full mt-2 text-xs bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded text-gray-600 transition-colors"
        >
          Simulate Motion (Demo)
        </button>
      )}
    </div>
  );
}
