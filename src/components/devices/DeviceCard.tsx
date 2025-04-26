
import React from 'react';
import { Card } from '@/components/ui/card';
import { Device } from '@/contexts/SmartHomeContext';
import { LightDevice } from './LightDevice';
import { ACDevice } from './ACDevice';
import { MotionSensorDevice } from './MotionSensorDevice';
import { CameraDevice } from './CameraDevice';
import { LockDevice } from './LockDevice';
import { ThermostatDevice } from './ThermostatDevice';
import { SmartPlugDevice } from './SmartPlugDevice';
import { EnvSensorDevice } from './EnvSensorDevice';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  // Render appropriate device component based on type
  const renderDevice = () => {
    switch (device.type) {
      case 'light':
        return <LightDevice device={device} />;
      case 'ac':
        return <ACDevice device={device} />;
      case 'motion':
        return <MotionSensorDevice device={device} />;
      case 'camera':
        return <CameraDevice device={device} />;
      case 'lock':
        return <LockDevice device={device} />;
      case 'thermostat':
        return <ThermostatDevice device={device} />;
      case 'plug':
        return <SmartPlugDevice device={device} />;
      case 'sensor':
        return <EnvSensorDevice device={device} />;
      default:
        return <div>Unknown device type</div>;
    }
  };

  return (
    <Card className="device-card overflow-hidden">
      {renderDevice()}
    </Card>
  );
}
