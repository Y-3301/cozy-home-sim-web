
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Define types for our IoT devices
export type DeviceType = 'light' | 'ac' | 'motion' | 'camera' | 'lock' | 'thermostat' | 'plug' | 'sensor';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  isOn: boolean;
  data?: {
    temperature?: number;
    humidity?: number;
    motion?: boolean;
    locked?: boolean;
    recording?: boolean;
    targetTemp?: number;
    mode?: 'cooling' | 'heating' | 'off';
    brightness?: number;
  };
  settings?: {
    autoRecord?: boolean;
    notifyOnMotion?: boolean;
    autoClearSeconds?: number;
    sensitivity?: 'low' | 'medium' | 'high';
    defaultBrightness?: number;
    autoOffMinutes?: number;
    defaultTemp?: number;
    defaultMode?: 'cooling' | 'heating';
  };
}

export interface SecurityEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  room: string;
  event: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: {
    deviceId: string;
    state: string;
    value?: number | boolean;
  };
  action: {
    deviceId: string;
    state: string;
    value?: number | boolean;
  };
  active: boolean;
}

interface SmartHomeContextType {
  devices: Device[];
  securityEvents: SecurityEvent[];
  automationRules: AutomationRule[];
  toggleDevice: (deviceId: string) => void;
  updateDeviceData: (deviceId: string, data: Partial<Device['data']>) => void;
  updateDeviceSettings: (deviceId: string, settings: Partial<Device['settings']>) => void;
  addSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void;
  toggleAutomationRule: (ruleId: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'active'>) => void;
  removeAutomationRule: (ruleId: string) => void;
  clearSecurityEvents: () => void;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

// Sample devices for our simulation
const initialDevices: Device[] = [
  {
    id: 'light-1',
    name: 'Living Room Ceiling Light',
    type: 'light',
    room: 'Living Room',
    isOn: false,
    data: {
      brightness: 80,
    },
    settings: {
      defaultBrightness: 80,
      autoOffMinutes: 0
    }
  },
  {
    id: 'light-2',
    name: 'Kitchen Light',
    type: 'light',
    room: 'Kitchen',
    isOn: false,
    data: {
      brightness: 100,
    },
    settings: {
      defaultBrightness: 100,
      autoOffMinutes: 0
    }
  },
  {
    id: 'light-3',
    name: 'Bedroom Light',
    type: 'light',
    room: 'Bedroom',
    isOn: false,
    data: {
      brightness: 60,
    },
    settings: {
      defaultBrightness: 60,
      autoOffMinutes: 0
    }
  },
  {
    id: 'ac-1',
    name: 'Living Room AC',
    type: 'ac',
    room: 'Living Room',
    isOn: false,
    data: {
      temperature: 23,
      mode: 'cooling',
    },
    settings: {
      defaultTemp: 23,
      defaultMode: 'cooling'
    }
  },
  {
    id: 'motion-1',
    name: 'Entry Motion Sensor',
    type: 'motion',
    room: 'Entry',
    isOn: true,
    data: {
      motion: false,
    },
    settings: {
      sensitivity: 'medium',
      autoClearSeconds: 30
    }
  },
  {
    id: 'camera-1',
    name: 'Front Door Camera',
    type: 'camera',
    room: 'Outside',
    isOn: true,
    data: {
      recording: true,
    },
    settings: {
      autoRecord: false,
      notifyOnMotion: true
    }
  },
  {
    id: 'lock-1',
    name: 'Front Door Lock',
    type: 'lock',
    room: 'Entry',
    isOn: true,
    data: {
      locked: true,
    }
  },
  {
    id: 'thermostat-1',
    name: 'Main Thermostat',
    type: 'thermostat',
    room: 'Living Room',
    isOn: true,
    data: {
      temperature: 22,
      targetTemp: 22,
      mode: 'cooling',
    },
    settings: {
      defaultTemp: 22,
      defaultMode: 'cooling'
    }
  },
  {
    id: 'plug-1',
    name: 'TV Smart Plug',
    type: 'plug',
    room: 'Living Room',
    isOn: false,
  },
  {
    id: 'sensor-1',
    name: 'Living Room Environmental Sensor',
    type: 'sensor',
    room: 'Living Room',
    isOn: true,
    data: {
      temperature: 23,
      humidity: 45,
    }
  }
];

// Sample automation rules
const initialAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Turn off lights when no motion',
    condition: {
      deviceId: 'motion-1',
      state: 'motion',
      value: false,
    },
    action: {
      deviceId: 'light-1',
      state: 'isOn',
      value: false,
    },
    active: true,
  },
  {
    id: 'rule-2',
    name: 'Turn on lights when motion detected',
    condition: {
      deviceId: 'motion-1',
      state: 'motion',
      value: true,
    },
    action: {
      deviceId: 'light-1',
      state: 'isOn',
      value: true,
    },
    active: false,
  },
];

export const SmartHomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);

  // Function to toggle device on/off
  const toggleDevice = useCallback((deviceId: string) => {
    setDevices(prevDevices => prevDevices.map(device => {
      if (device.id === deviceId) {
        return { ...device, isOn: !device.isOn };
      }
      return device;
    }));
  }, []);

  // Function to update device data
  const updateDeviceData = useCallback((deviceId: string, data: Partial<Device['data']>) => {
    setDevices(prevDevices => prevDevices.map(device => {
      if (device.id === deviceId) {
        return { 
          ...device, 
          data: { ...device.data, ...data } 
        };
      }
      return device;
    }));
  }, []);

  // Function to update device settings
  const updateDeviceSettings = useCallback((deviceId: string, settings: Partial<Device['settings']>) => {
    setDevices(prevDevices => prevDevices.map(device => {
      if (device.id === deviceId) {
        return { 
          ...device, 
          settings: { ...device.settings, ...settings } 
        };
      }
      return device;
    }));
  }, []);

  // Function to add security event
  const addSecurityEvent = useCallback((event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date(),
    };
    
    setSecurityEvents(prev => [newEvent, ...prev]);
    
    // Show a toast notification for high and medium priority events
    if (event.priority === 'high') {
      toast.error(`Alert: ${event.event}`, {
        description: `${event.deviceName} in ${event.room}`,
      });
    } else if (event.priority === 'medium') {
      toast.warning(`Notice: ${event.event}`, {
        description: `${event.deviceName} in ${event.room}`,
      });
    }
  }, []);

  // Function to add automation rule
  const addAutomationRule = useCallback((rule: Omit<AutomationRule, 'id' | 'active'>) => {
    const newRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      active: true,
    };
    
    setAutomationRules(prev => [...prev, newRule]);
  }, []);

  // Function to remove automation rule
  const removeAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, []);

  // Function to toggle automation rule
  const toggleAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules(prevRules => prevRules.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, active: !rule.active };
      }
      return rule;
    }));
  }, []);

  // Function to clear security events
  const clearSecurityEvents = useCallback(() => {
    setSecurityEvents([]);
  }, []);

  // Function to simulate random events
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to trigger a random event
      if (Math.random() < 0.1) {
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        
        if (randomDevice.type === 'motion' && randomDevice.isOn) {
          // Simulate motion detection
          const motionDetected = Math.random() > 0.5;
          updateDeviceData(randomDevice.id, { motion: motionDetected });
          
          if (motionDetected) {
            addSecurityEvent({
              deviceId: randomDevice.id,
              deviceName: randomDevice.name,
              deviceType: randomDevice.type,
              room: randomDevice.room,
              event: 'Motion detected',
              priority: 'medium',
            });
          }
        } else if (randomDevice.type === 'sensor' && randomDevice.isOn) {
          // Simulate temperature/humidity change
          if (randomDevice.data) {
            const tempChange = Math.random() > 0.5 ? 0.5 : -0.5;
            const humidityChange = Math.random() > 0.5 ? 1 : -1;
            
            updateDeviceData(randomDevice.id, { 
              temperature: randomDevice.data.temperature ? 
                parseFloat((randomDevice.data.temperature + tempChange).toFixed(1)) : 
                22,
              humidity: randomDevice.data.humidity ? 
                Math.min(Math.max((randomDevice.data.humidity + humidityChange), 30), 70) : 
                45
            });
          }
        }
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [devices, updateDeviceData, addSecurityEvent]);

  // Check automation rules when device states change
  useEffect(() => {
    automationRules.forEach(rule => {
      if (rule.active) {
        const triggerDevice = devices.find(d => d.id === rule.condition.deviceId);
        const targetDevice = devices.find(d => d.id === rule.action.deviceId);
        
        if (triggerDevice && targetDevice) {
          // Check if condition is met
          let conditionMet = false;
          
          if (rule.condition.state === 'isOn') {
            conditionMet = triggerDevice.isOn === rule.condition.value;
          } else if (triggerDevice.data && rule.condition.state in triggerDevice.data) {
            const stateKey = rule.condition.state as keyof typeof triggerDevice.data;
            conditionMet = triggerDevice.data[stateKey] === rule.condition.value;
          }
          
          if (conditionMet) {
            // Execute the action
            if (rule.action.state === 'isOn' && targetDevice.isOn !== rule.action.value) {
              toggleDevice(targetDevice.id);
              
              addSecurityEvent({
                deviceId: targetDevice.id,
                deviceName: targetDevice.name,
                deviceType: targetDevice.type,
                room: targetDevice.room,
                event: `Automated: ${rule.action.value ? 'Turned ON' : 'Turned OFF'} by rule "${rule.name}"`,
                priority: 'low',
              });
            } else if (targetDevice.data && rule.action.state in targetDevice.data) {
              updateDeviceData(targetDevice.id, {
                [rule.action.state]: rule.action.value
              });
              
              addSecurityEvent({
                deviceId: targetDevice.id,
                deviceName: targetDevice.name,
                deviceType: targetDevice.type,
                room: targetDevice.room,
                event: `Automated: ${rule.action.state} changed to ${rule.action.value} by rule "${rule.name}"`,
                priority: 'low',
              });
            }
          }
        }
      }
    });
  }, [devices, automationRules, toggleDevice, updateDeviceData, addSecurityEvent]);

  // Auto-clear motion after configured seconds
  useEffect(() => {
    const motionSensors = devices.filter(d => 
      d.type === 'motion' && 
      d.isOn && 
      d.data?.motion === true && 
      d.settings?.autoClearSeconds
    );
    
    motionSensors.forEach(sensor => {
      const clearTime = sensor.settings?.autoClearSeconds || 30;
      
      const timer = setTimeout(() => {
        updateDeviceData(sensor.id, { motion: false });
      }, clearTime * 1000);
      
      return () => clearTimeout(timer);
    });
  }, [devices, updateDeviceData]);
  
  // Auto-off lights based on settings
  useEffect(() => {
    const lightsWithAutoOff = devices.filter(d => 
      d.type === 'light' && 
      d.isOn && 
      d.settings?.autoOffMinutes && 
      d.settings.autoOffMinutes > 0
    );
    
    const timers: { [key: string]: NodeJS.Timeout } = {};
    
    lightsWithAutoOff.forEach(light => {
      const offTime = light.settings?.autoOffMinutes || 0;
      
      if (offTime > 0) {
        timers[light.id] = setTimeout(() => {
          toggleDevice(light.id);
          
          addSecurityEvent({
            deviceId: light.id,
            deviceName: light.name,
            deviceType: light.type,
            room: light.room,
            event: 'Auto-off timer completed',
            priority: 'low',
          });
        }, offTime * 60 * 1000);
      }
    });
    
    return () => {
      // Clear all timers on cleanup
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [devices, toggleDevice, addSecurityEvent]);

  return (
    <SmartHomeContext.Provider value={{
      devices,
      securityEvents,
      automationRules,
      toggleDevice,
      updateDeviceData,
      updateDeviceSettings,
      addSecurityEvent,
      toggleAutomationRule,
      addAutomationRule,
      removeAutomationRule,
      clearSecurityEvents,
    }}>
      {children}
    </SmartHomeContext.Provider>
  );
};

export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (context === undefined) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
};
