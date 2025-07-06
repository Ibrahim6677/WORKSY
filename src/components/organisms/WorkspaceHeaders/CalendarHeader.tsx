import { InputSearch } from "../../atoms/input/Input";

const CalendarHeader = () => {
  return (
    <div className="flex items-center justify-between text-inter px-12 py-6 bg-[#FAFAFA] border-b border-[#EFEFFD]">
      {/* Left: Workspace and Channel */}
      <div className="flex items-center gap-2">
        <span className="text-[#727272] text-inter text-lg font-bold">Calendar</span>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <InputSearch
            type="text"
            placeholder="Search"
            className=""
          />
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
