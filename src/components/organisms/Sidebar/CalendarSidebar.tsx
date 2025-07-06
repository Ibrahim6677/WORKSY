import { Calendar as SmallCalendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState } from "react";
import { format, isSameDay, addMonths, subMonths, isSameMonth } from "date-fns";

// Event data mirroring ScheduleCalendar
const events = [
  { date: new Date(2020, 2, 12), title: "New Project" },
  { date: new Date(2020, 2, 13), title: "New Project" },
  { date: new Date(2020, 2, 14), title: "New Project" },
  { date: new Date(2020, 2, 15), title: "New Project" },
  { date: new Date(2020, 2, 16), title: "New Project" },
  { date: new Date(2020, 2, 17), title: "New Project" },
];

export default function CalendarSidebar() {
  const [date, setDate] = useState(new Date(2020, 2, 1)); // March 2020

  // Custom header for calendar
  const handlePrevMonth = () => setDate((d) => subMonths(d, 1));
  const handleNextMonth = () => setDate((d) => addMonths(d, 1));

  const dayContentRenderer = (day: Date) => {
    const hasEvent = events.some((event) => isSameDay(event.date, day));
    const isCurrentMonth = isSameMonth(day, date);
    return (
      <span className="relative block w-full text-center">
        <span
          className={
            `text-[15px] font-medium block ` +
            (isCurrentMonth ? "text-[#23272F]" : "text-[#E5E7EB]")
          }
        >
          {format(day, "d")}
        </span>
        {hasEvent && (
          <span
            className="calendar-dot"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-2px",
              width: "6px",
              height: "6px",
              background: "#6629DE",
              borderRadius: "50%",
              zIndex: 2,
              display: "inline-block",
            }}
          ></span>
        )}
      </span>
    );
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-8 bg-[#FAFAFA] min-h-screen flex flex-col gap-6">
      {/* Custom Calendar Header */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="text-[20px] font-bold text-[#23272F]">
          {format(date, "MMMM, yyyy")}
        </div>
        <div className="flex items-center bg-[#F5F5F7] rounded-xl p-1 gap-1">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "#fff", boxShadow: "none", border: "none" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16L7 10L13 4"
                stroke="#AFB8CF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(90deg, #6629DE 0%, #7F56D9 100%)",
              boxShadow: "0 2px 6px #E0E7FF",
              border: "none",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 4L13 10L7 16"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="rounded-3xl bg-white mb-2">
        <SmallCalendar
          date={date}
          onChange={(newDate) => setDate(newDate)}
          dayContentRenderer={dayContentRenderer}
          weekdayDisplayFormat="EEE"
          className="w-full"
        />
        <style>{`
          .rdrWeekDays span {
            color: #7C3AED !important;
            font-weight: 500 !important;
            font-size: 15px !important;
            text-align: center !important;
          }
          .rdrMonthAndYearWrapper, .rdrMonthPicker, .rdrYearPicker {
            display: none !important;
          }
          .rdrMonth {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .rdrCalendarWrapper {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .rdrDayNumber span {
            width: 100%;
            display: block;
            text-align: center;
          }
          .rdrDayNumber {
            position: relative;
          }
          .calendar-dot {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -6px;
            width: 6px;
            height: 6px;
            background: #6629DE;
            border-radius: 50%;
            z-index: 2;
          }
        `}</style>
      </div>
      {/* Schedule Meeting Button */}
      <button className="flex items-center gap-3 w-full justify-center py-3 bg-[#6629DE] text-white rounded-2xl hover:bg-[#5A1EB8] transition mb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-[#D0BDF5] rounded-lg shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <line
              x1="12"
              y1="6"
              x2="12"
              y2="18"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="6"
              y1="12"
              x2="18"
              y2="12"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="font-medium text-inter text-[15px]">
          Schedule Meeting
        </span>
      </button>
      <div className="flex flex-col gap-4">
        <h3 className="text-md font-semibold mb-1 flex justify-around">
          Your Best Month <span>Active Project</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Your Best Month */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <p className="text-sm font-semibold">March</p>
              <p className="text-xs text-gray-400">205 file via mail</p>
            </div>
            <div className="flex items-center justify-center w-8 h-12 bg-[#D0BDF5] rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#6B21A8"
                viewBox="0 0 24 36"
                width="20"
                height="20"
              >
                <circle cx="12" cy="6" r="3" />
                <circle cx="12" cy="18" r="3" />
                <circle cx="12" cy="30" r="3" />
              </svg>
            </div>
          </div>
          {/* Active Project */}
          <div className="flex items-center justify-between p-4 bg-[#6629DE] rounded-lg text-white">
            <div>
              <p className="text-sm font-semibold">March</p>
              <p className="text-xs text-[#D0BDF5]">205 file via mail</p>
            </div>
            <div className="flex items-center justify-center w-8 h-12 bg-purple-400 bg-opacity-30 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#EDE9FE"
                viewBox="0 0 24 36"
                width="20"
                height="20"
              >
                <circle cx="12" cy="6" r="3" />
                <circle cx="12" cy="18" r="3" />
                <circle cx="12" cy="30" r="3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Reminders */}
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[#23272F]">
            Reminders
          </span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 60 60"
              fill="none"
            >
              <g filter="url(#filter0_d_2418_21613)">
                <rect
                  x="12"
                  y="9.27466"
                  width="24"
                  height="24"
                  rx="5.64706"
                  fill="#D0BDF5"
                />
                <path
                  d="M29.316 24.8155L28.4266 23.9526V20.6078C28.4266 18.5541 27.2958 16.8349 25.3238 16.38V15.9251C25.3238 15.3698 24.8618 14.9216 24.2895 14.9216C23.7172 14.9216 23.2553 15.3698 23.2553 15.9251V16.38C21.2764 16.8349 20.1525 18.5474 20.1525 20.6078V23.9526L19.263 24.8155C18.8286 25.237 19.132 25.9595 19.7457 25.9595H28.8265C29.447 25.9595 29.7504 25.237 29.316 24.8155ZM27.0476 24.6215H21.5315V20.6078C21.5315 18.9488 22.5727 17.5975 24.2895 17.5975C26.0064 17.5975 27.0476 18.9488 27.0476 20.6078V24.6215ZM24.2895 27.9663C25.048 27.9663 25.6685 27.3643 25.6685 26.6284H22.9105C22.9105 26.9833 23.0558 27.3236 23.3144 27.5745C23.573 27.8254 23.9238 27.9663 24.2895 27.9663Z"
                  fill="#6629DE"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_2418_21613"
                  x="0.705882"
                  y="0.80407"
                  width="46.5882"
                  height="46.5882"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2.82353" />
                  <feGaussianBlur stdDeviation="5.64706" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.32 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2418_21613"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2418_21613"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
        </div>

        {/* Reminders */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((r) => (
            <div key={r} className="flex items-center gap-3 py-2 bg-[#FDFDFD]">
              {/* Icon */}
              <div className="w-9 h-9 bg-[#FCADBD] flex items-center justify-center rounded-full shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6508 13.7747C10.8522 13.7747 10.1734 13.4951 9.61437 12.9361C9.05535 12.3771 8.77583 11.6983 8.77583 10.8997V5.14966C8.77583 4.35105 9.05535 3.67223 9.61437 3.1132C10.1734 2.55417 10.8522 2.27466 11.6508 2.27466C12.4494 2.27466 13.1283 2.55417 13.6873 3.1132C14.2463 3.67223 14.5258 4.35105 14.5258 5.14966V10.8997C14.5258 11.6983 14.2463 12.3771 13.6873 12.9361C13.1283 13.4951 12.4494 13.7747 11.6508 13.7747ZM11.6508 20.483C11.3793 20.483 11.1519 20.391 10.9685 20.207C10.7845 20.0236 10.6925 19.7962 10.6925 19.5247V17.5122C9.20708 17.3205 7.94528 16.7056 6.90708 15.6674C5.86889 14.6292 5.23799 13.3833 5.01437 11.9299C4.96646 11.6583 5.03833 11.4188 5.23 11.2111C5.42167 11.0035 5.67722 10.8997 5.99667 10.8997C6.22028 10.8997 6.41993 10.9834 6.59562 11.1507C6.77132 11.3188 6.88312 11.5226 6.93104 11.7622C7.13868 12.8802 7.68174 13.8146 8.56021 14.5653C9.43868 15.316 10.4689 15.6913 11.6508 15.6913C12.8328 15.6913 13.863 15.316 14.7415 14.5653C15.6199 13.8146 16.163 12.8802 16.3706 11.7622C16.4185 11.5226 16.5345 11.3188 16.7185 11.1507C16.9019 10.9834 17.1053 10.8997 17.329 10.8997C17.6324 10.8997 17.88 11.0035 18.0717 11.2111C18.2633 11.4188 18.3352 11.6583 18.2873 11.9299C18.0637 13.3833 17.4328 14.6292 16.3946 15.6674C15.3564 16.7056 14.0946 17.3205 12.6092 17.5122V19.5247C12.6092 19.7962 12.5175 20.0236 12.3341 20.207C12.1501 20.391 11.9224 20.483 11.6508 20.483Z"
                    fill="#F25D5A"
                  />
                </svg>
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#23272F]">
                  Your Subscription
                </div>
                <a
                  href="#"
                  className="text-xs font-medium text-[#6629DE] hover:underline"
                >
                  Review Now
                </a>
              </div>
              {/* Time */}
              <span className="text-xs text-[#AFB8CF]">6:38 PM</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
