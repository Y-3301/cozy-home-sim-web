
import { SmartHomeProvider } from "@/contexts/SmartHomeContext";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <SmartHomeProvider>
      <Dashboard />
    </SmartHomeProvider>
  );
};

export default Index;
