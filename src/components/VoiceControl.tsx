
import React, { useState, useEffect } from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function VoiceControl() {
  const { devices, toggleDevice, updateDeviceData } = useSmartHome();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition if browser supports it
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);
        processVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Voice recognition error', {
          description: event.error
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }
    
    if (!isListening) {
      recognition.start();
      setIsListening(true);
      setTranscript('');
      toast.info('Listening for voice commands...');
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    // Handle "turn on/off device in room" pattern
    const turnOnOffPattern = /turn (on|off) (.*?) in (.*)/i;
    const matchTurnOnOff = command.match(turnOnOffPattern);
    
    if (matchTurnOnOff) {
      const action = matchTurnOnOff[1]; // "on" or "off"
      const deviceType = matchTurnOnOff[2]; // device type like "light", "tv", etc.
      const room = matchTurnOnOff[3]; // room name like "living room", "kitchen", etc.
      
      // Find matching device
      const matchedDevices = devices.filter(device => {
        const matchesDeviceType = device.type.toLowerCase().includes(deviceType) || 
                                  device.name.toLowerCase().includes(deviceType);
        const matchesRoom = device.room.toLowerCase().includes(room);
        return matchesDeviceType && matchesRoom;
      });
      
      if (matchedDevices.length > 0) {
        // Toggle the first matching device
        const device = matchedDevices[0];
        const newState = action === 'on';
        
        if (device.isOn !== newState) {
          toggleDevice(device.id);
          toast.success(`${action === 'on' ? 'Turned on' : 'Turned off'} ${device.name} in ${device.room}`);
        } else {
          toast.info(`${device.name} is already ${action === 'on' ? 'on' : 'off'}`);
        }
      } else {
        toast.error(`No matching device found for "${deviceType}" in "${room}"`);
      }
      return;
    }
    
    // Handle "set device to value" pattern (for temperature, brightness, etc.)
    const setValuePattern = /set (.*?) to (\d+)/i;
    const matchSetValue = command.match(setValuePattern);
    
    if (matchSetValue) {
      const deviceDesc = matchSetValue[1]; // device description
      const value = parseInt(matchSetValue[2]); // numeric value
      
      // Find matching device
      const matchedDevices = devices.filter(device => 
        device.name.toLowerCase().includes(deviceDesc.toLowerCase()) || 
        device.type.toLowerCase().includes(deviceDesc.toLowerCase()) ||
        device.room.toLowerCase().includes(deviceDesc.toLowerCase())
      );
      
      if (matchedDevices.length > 0) {
        const device = matchedDevices[0];
        
        // Determine what to set based on device type
        if (device.type === 'light' && device.data) {
          updateDeviceData(device.id, { brightness: Math.min(100, Math.max(10, value)) });
          toast.success(`Set ${device.name} brightness to ${value}%`);
        } else if ((device.type === 'ac' || device.type === 'thermostat') && device.data) {
          updateDeviceData(device.id, { temperature: Math.min(30, Math.max(16, value)) });
          toast.success(`Set ${device.name} temperature to ${value}°C`);
        } else {
          toast.error(`Cannot set value for ${device.name}`);
        }
      } else {
        toast.error(`No matching device found for "${deviceDesc}"`);
      }
      return;
    }
    
    // If no pattern matched
    toast.info(`Unrecognized command: "${command}"`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Voice Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            className="w-full"
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Voice Control
              </>
            )}
          </Button>
          
          {isListening && (
            <div className="text-center animate-pulse">
              <p className="text-sm text-muted-foreground">Listening...</p>
            </div>
          )}
          
          {transcript && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Heard: "{transcript}"</p>
            </div>
          )}
          
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Example commands:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• "Turn on lights in living room"</li>
              <li>• "Turn off camera in outside"</li>
              <li>• "Set thermostat to 22"</li>
              <li>• "Set living room light to 80"</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add types for the Web Speech API if not defined
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
