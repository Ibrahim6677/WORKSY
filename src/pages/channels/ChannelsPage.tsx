import { useOutletContext } from "react-router-dom";
import ChannelsHeader from "../../components/organisms/WorkspaceHeaders/ChannelsHeader"
import MainChannels from "./MainChannels"

interface ChannelsLayoutContext {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

const ChannelsPage = () => {
  const context = useOutletContext<ChannelsLayoutContext>();
  
  // إذا لم يكن السياق متوفراً، استخدم قيم افتراضية
  const sidebarOpen = context?.sidebarOpen ?? true;
  const setSidebarOpen = context?.setSidebarOpen ?? (() => {});

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <ChannelsHeader 
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      <MainChannels />
    </>
  )
}

export default ChannelsPage