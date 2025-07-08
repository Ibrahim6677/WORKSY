import React, { Suspense, lazy } from "react";
import { useState } from "react";
import { addDays, subDays, format } from "date-fns";
import ScheduleCalendar from "./ScheduleCalendar";
import CalendarSidebar from "../../components/organisms/Sidebar/CalendarSidebar";
import CalendarHeader from "../../components/organisms/WorkspaceHeaders/CalendarHeader";
import LoadingPage from "../loadingPage";

const ScheduleCalendarComponent = lazy(() => import("./ScheduleCalendar"));
const CalendarSidebarComponent = lazy(() => import("../../components/organisms/Sidebar/CalendarSidebar"));
const CalendarHeaderComponent = lazy(() => import("../../components/organisms/WorkspaceHeaders/CalendarHeader"));

export default function CalendarPage() {
  // Start with the date from the design
  const [date, setDate] = useState(new Date(2020, 2, 12)); 

  const handlePrevWeek = () => {
    setDate((currentDate) => subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setDate((currentDate) => addDays(currentDate, 7));
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl text-[#1A1A1B] font-semibold">
              Schedule Meeting{" "}
              <span className="text-[#AFB8CF] text-sm px-2">|</span>{" "}
              <span className="text-[#6629DE] text-sm font-medium">
                {format(date, "MMMM, yyyy")}
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevWeek}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F7]"
                style={{ boxShadow: 'none', border: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16L7 10L13 4" stroke="#AFB8CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={handleNextWeek}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F7]"
                style={{ boxShadow: 'none', border: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 4L13 10L7 16" stroke="#6629DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <ScheduleCalendarComponent date={date} />
        </div>
        <CalendarSidebarComponent />
      </div>
    </Suspense>
  );
}
