
import React from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { Lock, Unlock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface LockDeviceProps {
  device: Device;
}

export function LockDevice({ device }: LockDeviceProps) {
  const { toggleDevice, updateDeviceData, addSecurityEvent } = useSmartHome();
  const isLocked = device.data?.locked || false;

  const toggleLock = () => {
    const newLockedState = !isLocked;
    updateDeviceData(device.id, { locked: newLockedState });
    
    addSecurityEvent({
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      room: device.room,
      event: newLockedState ? 'Door locked' : 'Door unlocked',
      priority: newLockedState ? 'low' : 'medium',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-green-100' : 'bg-gray-100'}`}>
            {isLocked ? 
              <Lock className={`h-6 w-6 ${device.isOn ? 'text-green-500' : 'text-gray-400'}`} /> : 
              <Unlock className={`h-6 w-6 ${device.isOn ? 'text-orange-500' : 'text-gray-400'}`} />
            }
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room}</p>
          </div>
        </div>
        <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
      </div>

      {device.isOn && (
        <div className="flex justify-center">
          <Button 
            onClick={toggleLock}
            variant={isLocked ? "outline" : "default"}
            className={isLocked ? "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200" : "bg-orange-500 hover:bg-orange-600"}
          >
            {isLocked ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Locked
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unlocked
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
