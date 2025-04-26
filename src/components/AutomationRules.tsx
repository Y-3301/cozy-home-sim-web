
import React from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function AutomationRules() {
  const { automationRules, toggleAutomationRule, devices } = useSmartHome();

  // Helper function to get device name from ID
  const getDeviceName = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    return device ? device.name : 'Unknown Device';
  };

  // Function to render condition in plain language
  const renderCondition = (rule: typeof automationRules[0]) => {
    const triggerDevice = getDeviceName(rule.condition.deviceId);
    
    if (rule.condition.state === 'isOn') {
      return `When ${triggerDevice} is ${rule.condition.value ? 'ON' : 'OFF'}`;
    } else if (rule.condition.state === 'motion') {
      return `When ${triggerDevice} ${rule.condition.value ? 'detects motion' : 'detects no motion'}`;
    } else if (rule.condition.state === 'locked') {
      return `When ${triggerDevice} is ${rule.condition.value ? 'locked' : 'unlocked'}`;
    } else {
      return `When ${triggerDevice} ${rule.condition.state} is ${rule.condition.value}`;
    }
  };

  // Function to render action in plain language
  const renderAction = (rule: typeof automationRules[0]) => {
    const actionDevice = getDeviceName(rule.action.deviceId);
    
    if (rule.action.state === 'isOn') {
      return `Turn ${actionDevice} ${rule.action.value ? 'ON' : 'OFF'}`;
    } else if (rule.action.state === 'locked') {
      return `${rule.action.value ? 'Lock' : 'Unlock'} ${actionDevice}`;
    } else {
      return `Set ${actionDevice} ${rule.action.state} to ${rule.action.value}`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Automation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        {automationRules.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No automation rules configured
          </div>
        ) : (
          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div 
                key={rule.id} 
                className={`p-3 rounded-md border ${rule.active ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{renderCondition(rule)}</p>
                    <p className="text-sm text-gray-500">{renderAction(rule)}</p>
                  </div>
                  <Switch 
                    checked={rule.active} 
                    onCheckedChange={() => toggleAutomationRule(rule.id)} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
