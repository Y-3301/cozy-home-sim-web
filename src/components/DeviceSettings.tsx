
import React, { useState } from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

export function DeviceSettings() {
  const { devices, updateDeviceSettings, automationRules, addAutomationRule, removeAutomationRule } = useSmartHome();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [newRuleName, setNewRuleName] = useState('');
  const [triggerDeviceId, setTriggerDeviceId] = useState('');
  const [actionDeviceId, setActionDeviceId] = useState('');
  const [triggerState, setTriggerState] = useState('isOn');
  const [triggerValue, setTriggerValue] = useState('true');
  const [actionState, setActionState] = useState('isOn');
  const [actionValue, setActionValue] = useState('true');

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  const handleAddRule = () => {
    if (!newRuleName || !triggerDeviceId || !actionDeviceId) {
      toast.error('Please fill all required fields');
      return;
    }

    // Parse values into appropriate types
    let parsedTriggerValue: boolean | number = triggerValue === 'true' ? true : 
                                               triggerValue === 'false' ? false : 
                                               parseFloat(triggerValue);
                                               
    let parsedActionValue: boolean | number = actionValue === 'true' ? true : 
                                             actionValue === 'false' ? false : 
                                             parseFloat(actionValue);

    addAutomationRule({
      name: newRuleName,
      condition: {
        deviceId: triggerDeviceId,
        state: triggerState,
        value: parsedTriggerValue
      },
      action: {
        deviceId: actionDeviceId,
        state: actionState,
        value: parsedActionValue
      }
    });

    // Reset form
    setNewRuleName('');
    toast.success('Automation rule added');
  };

  const renderDeviceSpecificSettings = () => {
    if (!selectedDevice) return null;

    switch(selectedDevice.type) {
      case 'camera':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-record on motion</Label>
              <Switch 
                checked={selectedDevice.settings?.autoRecord || false}
                onCheckedChange={(checked) => 
                  updateDeviceSettings(selectedDevice.id, { autoRecord: checked })
                } 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Motion notification</Label>
              <Switch 
                checked={selectedDevice.settings?.notifyOnMotion || false}
                onCheckedChange={(checked) => 
                  updateDeviceSettings(selectedDevice.id, { notifyOnMotion: checked })
                } 
              />
            </div>
          </div>
        );
        
      case 'motion':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-clear after</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number" 
                  className="w-20" 
                  value={selectedDevice.settings?.autoClearSeconds || 30}
                  onChange={(e) => 
                    updateDeviceSettings(selectedDevice.id, { 
                      autoClearSeconds: parseInt(e.target.value) || 30 
                    })
                  }
                />
                <span>seconds</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Sensitivity</Label>
              <Select 
                value={selectedDevice.settings?.sensitivity || 'medium'}
                onValueChange={(value) => 
                  updateDeviceSettings(selectedDevice.id, { sensitivity: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'light':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Default brightness</Label>
              <Input 
                type="number" 
                className="w-20" 
                value={selectedDevice.settings?.defaultBrightness || 80}
                onChange={(e) => 
                  updateDeviceSettings(selectedDevice.id, { 
                    defaultBrightness: parseInt(e.target.value) || 80 
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto-off after (minutes)</Label>
              <Input 
                type="number" 
                className="w-20" 
                value={selectedDevice.settings?.autoOffMinutes || 0}
                onChange={(e) => 
                  updateDeviceSettings(selectedDevice.id, { 
                    autoOffMinutes: parseInt(e.target.value) || 0 
                  })
                }
              />
            </div>
          </div>
        );

      case 'thermostat':
      case 'ac':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Default temperature</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number" 
                  className="w-20" 
                  value={selectedDevice.settings?.defaultTemp || 22}
                  onChange={(e) => 
                    updateDeviceSettings(selectedDevice.id, { 
                      defaultTemp: parseFloat(e.target.value) || 22 
                    })
                  }
                />
                <span>°C</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Default mode</Label>
              <Select 
                value={selectedDevice.settings?.defaultMode || 'cooling'}
                onValueChange={(value) => 
                  updateDeviceSettings(selectedDevice.id, { defaultMode: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cooling">Cooling</SelectItem>
                  <SelectItem value="heating">Heating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500 text-sm">
            No custom settings available for this device type
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Device Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a device to configure" />
            </SelectTrigger>
            <SelectContent>
              {devices.map(device => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name} ({device.room})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDeviceId && (
            <div className="mt-4 space-y-4">
              {renderDeviceSpecificSettings()}
            </div>
          )}

          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                <span>Add Custom Automation Rule</span>
                <Settings className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input 
                  id="ruleName" 
                  placeholder="E.g., Turn on lights when motion detected"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>When this device:</Label>
                  <Select value={triggerDeviceId} onValueChange={setTriggerDeviceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map(device => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.room})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>State/property:</Label>
                  <Select value={triggerState} onValueChange={setTriggerState}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isOn">Power state</SelectItem>
                      <SelectItem value="motion">Motion detection</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="brightness">Brightness</SelectItem>
                      <SelectItem value="locked">Lock state</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Is equal to:</Label>
                  <Input 
                    placeholder="Value (true/false/number)" 
                    value={triggerValue}
                    onChange={e => setTriggerValue(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Then do this:</Label>
                  <Select value={actionDeviceId} onValueChange={setActionDeviceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map(device => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.room})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>State/property:</Label>
                  <Select value={actionState} onValueChange={setActionState}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isOn">Power state</SelectItem>
                      <SelectItem value="brightness">Brightness</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="locked">Lock state</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Set to value:</Label>
                  <Input 
                    placeholder="Value (true/false/number)" 
                    value={actionValue}
                    onChange={e => setActionValue(e.target.value)}
                  />
                </div>
              </div>
              
              <Button className="w-full" onClick={handleAddRule}>Add Rule</Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
