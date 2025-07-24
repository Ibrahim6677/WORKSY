import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  setHours,
  setMinutes,
} from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const colorMap = {
  green: { bg: "#D1FAE5", text: "#065F46" },
  red: { bg: "#FECACA", text: "#991B1B" },
  yellow: { bg: "#FEF3C7", text: "#92400E" },
  blue: { bg: "#DBEAFE", text: "#1E3A8A" },
};

type ResourceColor = keyof typeof colorMap;

interface CustomEventProps {
  event: {
    title: string;
    start: Date;
    end: Date;
    resource: ResourceColor;
  };
}

const CustomEvent = ({ event }: CustomEventProps) => {
  const color = colorMap[event.resource] || colorMap.green;
  return (
    <div
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderLeft: `4px solid ${color.text}`,
        borderRadius: '12px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '1.3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100%',
        minHeight: '60px',
        padding: '10px 16px',
        boxShadow: 'none',
        border: 'none',
        margin: '2px 0',
        gap: 2,
      }}
    >
      <div style={{ fontWeight: 600 }}>{event.title}</div>
      <div style={{ fontSize: '13px', opacity: 1 }}>{'Design Brief Case'}</div>
    </div>
  );
};

interface ScheduleCalendarProps {
  date: Date;
  googleEvents?: any[];
  onCreateEvent?: (eventData: any) => Promise<void>;
}

export default function ScheduleCalendar({ date, googleEvents = [], onCreateEvent }: ScheduleCalendarProps) {
  // Convert Google Events to calendar format
  const formatGoogleEvents = (events: any[]) => {
    return events.map((event: any) => ({
      title: event.summary || 'Google Event',
      start: new Date(event.start?.dateTime || event.start?.date),
      end: new Date(event.end?.dateTime || event.end?.date),
      resource: 'blue' as ResourceColor, // Google events in blue
      isGoogleEvent: true,
      googleEventId: event.id,
    }));
  };

  const localEvents: {
    title: string;
    start: Date;
    end: Date;
    resource: ResourceColor;
    isGoogleEvent?: boolean;
    googleEventId?: string;
  }[] = [
    // Monday 12
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 12), 0), 9),
      end: setHours(setMinutes(new Date(2020, 2, 12), 30), 9),
      resource: "green" as ResourceColor,
    },
    // Tuesday 13
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 13), 0), 9),
      end: setHours(setMinutes(new Date(2020, 2, 13), 30), 9),
      resource: "green" as ResourceColor,
    },
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 13), 0), 8),
      end: setHours(setMinutes(new Date(2020, 2, 13), 30), 8),
      resource: "red" as ResourceColor,
    },
    // Wednesday 14
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 14), 0), 9),
      end: setHours(setMinutes(new Date(2020, 2, 14), 30), 9),
      resource: "yellow" as ResourceColor,
    },
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 14), 0), 11),
      end: setHours(setMinutes(new Date(2020, 2, 14), 30), 11),
      resource: "blue" as ResourceColor,
    },
    // Thursday 15
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 15), 0), 9),
      end: setHours(setMinutes(new Date(2020, 2, 15), 30), 9),
      resource: "yellow" as ResourceColor,
    },
    // Friday 16
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 16), 0), 9),
      end: setHours(setMinutes(new Date(2020, 2, 16), 30), 9),
      resource: "blue" as ResourceColor,
    },
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 16), 0), 11),
      end: setHours(setMinutes(new Date(2020, 2, 16), 30), 11),
      resource: "blue" as ResourceColor,
    },
    // Saturday 17
    {
      title: "New Project",
      start: setHours(setMinutes(new Date(2020, 2, 17), 0), 9),
      end: setHours(setMinutes(new Date(2020, 2, 17), 30), 9),
      resource: "green" as ResourceColor,
    },
  ];

  // Combine local events with Google events
  const allEvents = [
    ...localEvents,
    ...formatGoogleEvents(googleEvents)
  ];

  return (
    <div className="w-full bg-white rounded-none shadow-none p-0 relative">
      <style>{`
        .rbc-event-label, .rbc-slot-label {
          display: none !important;
        }
        .rbc-event {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .rbc-row-segment {
          padding: 0 2px !important;
        }
        .rbc-time-content {
          border-top: none !important;
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid #F3F3F3 !important;
        }
        .rbc-time-header, .rbc-header {
          background: #fff !important;
          border-bottom: 1px solid #F3F3F3 !important;
        }
        .rbc-header {
          color: #1A1A1B !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          text-align: center !important;
          padding: 12px 0 !important;
        }
        .rbc-label {
          color: #AFB8CF !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          text-align: right !important;
          padding-right: 8px !important;
        }
        .rbc-time-gutter {
          background: #fff !important;
        }
        .rbc-time-view .rbc-allday-cell {
          display: none !important;
        }
        .rbc-time-slot {
          min-height: 44px !important;
        }
      `}</style>
      <Calendar
        date={date}
        onNavigate={() => {}}
        localizer={localizer}
        events={allEvents}
        defaultView="week"
        views={["week"]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%", background: "#fff", borderRadius: 0, boxShadow: "none", margin: 0 }}
        components={{
          event: CustomEvent,
          header: (props: any) => (
            <div className="text-[#1A1A1B] text-[15px] font-semibold text-center py-2 bg-white">
              {props.label}
            </div>
          ),
          timeGutterHeader: () => (
            <div className="text-[#AFB8CF] text-xs font-normal text-center py-2 bg-white">&nbsp;</div>
          ),
        }}
        eventPropGetter={(event) => {
          const color =
            colorMap[event.resource as ResourceColor] || colorMap.green;
          return {
            style: {
              backgroundColor: color.bg,
              border: "none",
              borderRadius: "12px",
              padding: "0px",
              color: color.text,
              boxShadow: "none",
              minHeight: 40,
            },
          };
        }}
        toolbar={false}
        min={setHours(setMinutes(new Date(2020, 2, 12), 0), 8)}
        max={setHours(setMinutes(new Date(2020, 2, 12), 0), 18)}
      />
    </div>
  );
}
