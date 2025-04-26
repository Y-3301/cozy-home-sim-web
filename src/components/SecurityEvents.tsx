
import React from 'react';
import { useSmartHome, SecurityEvent } from '@/contexts/SmartHomeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SecurityEvents() {
  const { securityEvents, clearSecurityEvents } = useSmartHome();

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const getPriorityColor = (priority: SecurityEvent['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Security Events</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearSecurityEvents}
          disabled={securityEvents.length === 0}
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        {securityEvents.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No security events recorded
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {securityEvents.map((event) => (
              <div 
                key={event.id} 
                className="p-3 bg-gray-50 rounded-md border border-gray-100 animate-fade-in"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{event.event}</span>
                  <Badge className={getPriorityColor(event.priority)}>
                    {event.priority}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">{event.deviceName}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">{event.room}</span>
                  <span className="text-xs text-gray-400">{formatTime(event.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
