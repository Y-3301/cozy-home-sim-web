
import React, { useState } from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, AirVent, User, Camera, Lock, Thermometer, Plug } from 'lucide-react';

export function FloorPlan() {
  const { devices, toggleDevice } = useSmartHome();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Map device types to icons
  const getDeviceIcon = (type: string, isOn: boolean) => {
    const iconProps = { 
      className: `h-4 w-4 ${isOn ? 'text-iot-blue' : 'text-gray-400'}`,
      strokeWidth: 2
    };
    
    switch (type) {
      case 'light': return <Lightbulb {...iconProps} />;
      case 'ac': return <AirVent {...iconProps} />;
      case 'motion': return <User {...iconProps} />;
      case 'camera': return <Camera {...iconProps} />;
      case 'lock': return <Lock {...iconProps} />;
      case 'thermostat': return <Thermometer {...iconProps} />;
      case 'plug': return <Plug {...iconProps} />;
      case 'sensor': return <Thermometer {...iconProps} />;
      default: return <Lightbulb {...iconProps} />;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative w-full h-[300px] bg-gray-100 rounded-md border border-gray-200">
          {/* Living Room */}
          <div className="absolute top-[30px] left-[30px] w-[150px] h-[150px] bg-white border border-gray-300 rounded-sm">
            <div className="text-xs text-center mt-1 text-gray-500">Living Room</div>
            
            {/* Place devices for this room */}
            {devices
              .filter(device => device.room === 'Living Room')
              .map((device, index) => {
                const x = 20 + (index * 30);
                const y = 50 + (index % 2 * 30);
                
                return (
                  <div 
                    key={device.id}
                    className="absolute cursor-pointer"
                    style={{ top: `${y}px`, left: `${x}px` }}
                    onClick={() => toggleDevice(device.id)}
                    onMouseEnter={() => setActiveTooltip(device.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getDeviceIcon(device.type, device.isOn)}
                    </div>
                    
                    {activeTooltip === device.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
                        {device.name}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          
          {/* Kitchen */}
          <div className="absolute top-[30px] right-[30px] w-[100px] h-[100px] bg-white border border-gray-300 rounded-sm">
            <div className="text-xs text-center mt-1 text-gray-500">Kitchen</div>
            
            {devices
              .filter(device => device.room === 'Kitchen')
              .map((device, index) => {
                const x = 20 + (index * 30);
                const y = 40;
                
                return (
                  <div 
                    key={device.id}
                    className="absolute cursor-pointer"
                    style={{ top: `${y}px`, left: `${x}px` }}
                    onClick={() => toggleDevice(device.id)}
                    onMouseEnter={() => setActiveTooltip(device.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getDeviceIcon(device.type, device.isOn)}
                    </div>
                    
                    {activeTooltip === device.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
                        {device.name}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          
          {/* Bedroom */}
          <div className="absolute bottom-[30px] right-[70px] w-[130px] h-[100px] bg-white border border-gray-300 rounded-sm">
            <div className="text-xs text-center mt-1 text-gray-500">Bedroom</div>
            
            {devices
              .filter(device => device.room === 'Bedroom')
              .map((device, index) => {
                const x = 20 + (index * 30);
                const y = 40;
                
                return (
                  <div 
                    key={device.id}
                    className="absolute cursor-pointer"
                    style={{ top: `${y}px`, left: `${x}px` }}
                    onClick={() => toggleDevice(device.id)}
                    onMouseEnter={() => setActiveTooltip(device.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getDeviceIcon(device.type, device.isOn)}
                    </div>
                    
                    {activeTooltip === device.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
                        {device.name}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          
          {/* Entry */}
          <div className="absolute bottom-[30px] left-[30px] w-[80px] h-[80px] bg-white border border-gray-300 rounded-sm">
            <div className="text-xs text-center mt-1 text-gray-500">Entry</div>
            
            {devices
              .filter(device => device.room === 'Entry')
              .map((device, index) => {
                const x = 20 + (index * 30);
                const y = 40;
                
                return (
                  <div 
                    key={device.id}
                    className="absolute cursor-pointer"
                    style={{ top: `${y}px`, left: `${x}px` }}
                    onClick={() => toggleDevice(device.id)}
                    onMouseEnter={() => setActiveTooltip(device.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getDeviceIcon(device.type, device.isOn)}
                    </div>
                    
                    {activeTooltip === device.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
                        {device.name}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          
          {/* Outside */}
          <div className="absolute bottom-[150px] left-[200px] w-[40px] h-[40px]">
            {devices
              .filter(device => device.room === 'Outside')
              .map((device, index) => {
                return (
                  <div 
                    key={device.id}
                    className="absolute cursor-pointer"
                    onClick={() => toggleDevice(device.id)}
                    onMouseEnter={() => setActiveTooltip(device.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className={`p-2 rounded-full ${device.isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getDeviceIcon(device.type, device.isOn)}
                    </div>
                    
                    {activeTooltip === device.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
                        {device.name}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-center text-gray-500">
          Interactive Floor Plan - Click on devices to toggle them
        </div>
      </CardContent>
    </Card>
  );
}
