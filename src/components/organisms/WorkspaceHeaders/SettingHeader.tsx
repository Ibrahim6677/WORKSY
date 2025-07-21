import { GoArrowLeft, GoArrowRight } from "react-icons/go";

type SettingHeaderProps = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const SettingHeader = ({ sidebarOpen, onToggleSidebar }: SettingHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-12 py-6 bg-[#FBFBFB] border-b border-[#EFEFFD]">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="text-2xl p-1 rounded hover:bg-gray-200 text-[#6629DE] transition"
          title={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {sidebarOpen ? <GoArrowLeft /> : <GoArrowRight />}
        </button>
        <h3 className="text-[#727272] text-inter text-lg font-bold">Settings</h3>
      </div>
    </div>
  );
}

export default SettingHeader;