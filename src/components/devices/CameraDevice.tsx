
import React, { useEffect } from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { Camera } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface CameraDeviceProps {
  device: Device;
}

export function CameraDevice({ device }: CameraDeviceProps) {
  const { toggleDevice, updateDeviceData, addSecurityEvent } = useSmartHome();
  const isRecording = device.data?.recording || false;
  const autoRecord = device.settings?.autoRecord || false;
  const notifyOnMotion = device.settings?.notifyOnMotion || false;

  // Check for motion detection from other sensors in the same room
  useEffect(() => {
    // Only run effect if the device is on and has autoRecord enabled
    if (device.isOn && autoRecord) {
      // Set up an interval to check for motion in the same room
      const motionCheckInterval = setInterval(() => {
        const { devices } = useSmartHome();
        
        // Find motion sensors in the same room
        const motionSensors = devices.filter(d => 
          d.type === 'motion' && 
          d.room === device.room && 
          d.isOn && 
          d.data?.motion === true
        );
        
        // If motion is detected and camera is not recording, start recording
        if (motionSensors.length > 0 && !isRecording) {
          updateDeviceData(device.id, { recording: true });
          
          if (notifyOnMotion) {
            addSecurityEvent({
              deviceId: device.id,
              deviceName: device.name,
              deviceType: device.type,
              room: device.room,
              event: 'Auto-recording started due to motion',
              priority: 'medium',
            });
          }
        }
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(motionCheckInterval);
    }
  }, [device.isOn, autoRecord, device.id, isRecording, device.room, notifyOnMotion]);

  const toggleRecording = () => {
    updateDeviceData(device.id, { recording: !isRecording });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Camera className={`h-6 w-6 ${device.isOn ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room}</p>
          </div>
        </div>
        <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
      </div>

      {device.isOn && (
        <div className="space-y-2">
          <div className="bg-gray-900 h-24 rounded-md overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs opacity-80">Camera Feed</span>
            </div>
            {isRecording && (
              <div className="absolute top-2 right-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle"></div>
              </div>
            )}
            {autoRecord && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black/20 text-white border-none text-[10px]">
                  Auto-Record {autoRecord ? 'On' : 'Off'}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Recording</span>
            <div className="flex items-center space-x-2">
              {isRecording ? (
                <Badge variant="default" className="bg-red-500">Recording</Badge>
              ) : (
                <Badge variant="outline">Standby</Badge>
              )}
              <Switch 
                checked={isRecording} 
                onCheckedChange={toggleRecording} 
                disabled={!device.isOn} 
                className="scale-90" // Using a class to make it slightly smaller instead of the size prop
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
