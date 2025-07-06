import calender from "../../assets/images/solar_calendar-outline.svg";
import hdCalls from "../../assets/images/si_mic-line.svg";
import workspace from "../../assets/images/carbon_workspace.svg";
import channel from "../../assets/images/channel.svg";
import files from "../../assets/images/files.svg";

const Collaboration = () => {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 relative rounded-2xl bg-white py-12 overflow-hidden">
      {/* Background Shape */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 986 752"
          fill="none"
          className="absolute bottom-10 -right-6 w-full max-w-[700px] h-auto"
        >
          <path
            d="M846.247 49.7987C803.85 95.0596 780.368 151.291 758.111 206.464C735.855 261.638 713.447 318.045 672.613 364.408C631.796 410.77 568.436 446.162 501.667 442.256C370.884 434.59 285.083 308.441 162.916 275.017C123.594 264.252 77.6031 265.632 44.8148 287.441C-1.05856 317.942 -6.41689 379.945 19.5181 424.941C45.4531 469.938 95.0891 500.704 145.716 524.774C184.602 543.263 225.234 558.933 267.06 571.591C319.77 587.525 376.897 599.949 416.387 634.387C466.443 678.047 456.18 712.22 428.7 744H986V0H909.186C885.62 13.8485 864.27 30.5606 846.247 49.7987Z"
            fill="#6629DE"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 px-4">
          Worksy Delivers Complete Team{" "}
          <span className="text-[#6629DE]">Collaboration</span>
        </h1>

        {/* Top 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 md:mb-8 px-4 sm:px-6 lg:px-8">
          <Card
            icon={calender}
            title="calendar"
            description="Schedule meetings and sync with Google Calendar or Outlook never miss a deadline"
          />
          <Card
            icon={hdCalls}
            title="HD calls"
            description="Voice & Video Calls Face-to-face meetings without the meeting fatigue Jump into high quality calls instantly"
          />
          <Card
            icon={workspace}
            title="workspace"
            description="Organized Workspaces Structure that scales with your team Create dedicated spaces for projects, departments, or topics."
          />
        </div>

        {/* Bottom 2 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8">
          <Card
            icon={channel}
            title="channel"
            description="Open conversations that keep everyone aligned Create transparent spaces where teams can collaborate openly, share updates, and stay connected on shared projects."
            wide
          />
          <Card
            icon={files}
            title="secure files"
            description="File Sharing & Storage Share anything, find everything, instantly Drag, drop, and access all your files in one place. No more hunting through email attachments or outdated versions."
            wide
          />
        </div>
      </div>
    </div>
  );
};

// Card Component
type CardProps = {
  icon: string;
  title: string;
  description: string;
  bg?: string;
  wide?: boolean;
};

const Card = ({
  icon,
  title,
  description,
  bg = "bg-white",
  wide = false,
}: CardProps) => {
  return (
    <div
      className={`${
        wide ? "col-span-1 lg:col-span-1" : "col-span-1"
      } min-h-[240px] rounded-2xl ${bg} p-6 shadow-md hover:shadow-lg transition-shadow duration-300
      transform hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-300 bg-white/80 backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#6629DE]/10">
          <img src={icon} alt={`${title} icon`} className="w-6 h-6" />
        </div>
        <h2 className="text-[#6629DE] text-lg sm:text-xl font-bold capitalize">{title}</h2>
      </div>
      <p className="text-base sm:text-lg text-black/80 leading-relaxed">{description}</p>
    </div>
  );
};

export default Collaboration;
