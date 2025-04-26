
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { FloorPlan } from '@/components/FloorPlan';
import { RoomSelector } from '@/components/RoomSelector';
import { RoomGrid } from '@/components/RoomGrid';
import { SecurityEvents } from '@/components/SecurityEvents';
import { AutomationRules } from '@/components/AutomationRules';
import { VoiceControl } from '@/components/VoiceControl';
import { DeviceSettings } from '@/components/DeviceSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const [selectedRoom, setSelectedRoom] = useState<string>('All Rooms');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Smart Home Dashboard</h2>
        
        <FloorPlan />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="md:w-2/3">
                <RoomSelector selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
              </div>
              <div className="md:w-1/3">
                <VoiceControl />
              </div>
            </div>
            <RoomGrid selectedRoom={selectedRoom} />
          </div>
          
          <div>
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="events" className="flex-1">Security</TabsTrigger>
                <TabsTrigger value="automations" className="flex-1">Automation</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="events">
                <SecurityEvents />
              </TabsContent>
              <TabsContent value="automations">
                <AutomationRules />
              </TabsContent>
              <TabsContent value="settings">
                <DeviceSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
