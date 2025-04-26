
import React from 'react';
import { Device, useSmartHome } from '@/contexts/SmartHomeContext';
import { Thermometer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface ThermostatDeviceProps {
  device: Device;
}

export function ThermostatDevice({ device }: ThermostatDeviceProps) {
  const { toggleDevice, updateDeviceData } = useSmartHome();
  const currentTemp = device.data?.temperature || 22;
  const targetTemp = device.data?.targetTemp || 22;
  const mode = device.data?.mode || 'cooling';

  const handleTargetTempChange = (value: number[]) => {
    updateDeviceData(device.id, { targetTemp: value[0] });
  };

  const toggleMode = () => {
    const newMode = mode === 'cooling' ? 'heating' : 'cooling';
    updateDeviceData(device.id, { mode: newMode });
  };

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
        <>
          <div className="flex justify-center mt-2 mb-3">
            <div className="bg-gray-50 p-4 rounded-full w-24 h-24 flex items-center justify-center relative">
              <div className="text-2xl font-bold">{targetTemp}°C</div>
              <div className="absolute bottom-1 text-xs text-gray-500">Current: {currentTemp}°C</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Target Temperature</span>
              <span className="text-sm font-medium">{targetTemp}°C</span>
            </div>
            <Slider 
              value={[targetTemp]} 
              min={16} 
              max={30} 
              step={0.5} 
              onValueChange={handleTargetTempChange} 
              disabled={!device.isOn}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>16°C</span>
              <span>30°C</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Mode</span>
            <Button
              onClick={toggleMode}
              variant="outline"
              size="sm"
              className={`${
                mode === 'cooling' 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              {mode === 'cooling' ? 'Cooling' : 'Heating'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
