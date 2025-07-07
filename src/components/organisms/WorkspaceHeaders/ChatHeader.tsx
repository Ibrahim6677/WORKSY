import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputSearch } from "../../atoms/input/Input";

type WorkspaceHeaderProps = {
  onOpenThreadSidebar?: () => void;
};

const WorkspaceHeader = ({ onOpenThreadSidebar }: WorkspaceHeaderProps) => {
  const [inCall, setInCall] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isInCallPage = location.pathname.includes('/workspace/channels/call');
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      {/* Left: Workspace and Channel */}
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-black inline-block"></span>
        <span className="text-sm text-gray-900 font-semibold">Codie</span>
        <span className="mx-1 text-gray-400 text-xs">/</span>
        <span className="text-sm text-gray-700">General</span>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Call Icon */}
        {
          !inCall && !isInCallPage && (
            <>
            <button
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-gray-100 transition"
              title="Start call"
              onClick={() => { setInCall(true); navigate('/workspace/channels/call'); }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.155 11.7557V14.8784C14.155 15.6572 13.4783 16.2886 12.6437 16.2886H4.55374C3.71906 16.2886 3.04242 15.6572 3.04242 14.8784V7.12196C3.04242 6.34309 3.71906 5.7117 4.55374 5.7117H12.6437C13.4783 5.7117 14.155 6.34309 14.155 7.12196V9.48913L18.408 7.38788C18.6537 7.30721 18.9112 7.47737 18.9112 7.72047L18.9576 13.557C18.9576 13.8205 18.6593 13.9909 18.408 13.8711L14.155 11.7557ZM15.3641 7.60311V7.12196C15.3641 5.72001 14.1461 4.5835 12.6437 4.5835H4.55374C3.05132 4.5835 1.83337 5.72001 1.83337 7.12196V14.8784C1.83337 16.2803 3.05132 17.4168 4.55374 17.4168H12.6437C14.1461 17.4168 15.3641 16.2803 15.3641 14.8784V13.5986L17.8581 14.8758C18.914 15.379 20.1667 14.6633 20.1667 13.557L20.1202 7.72047C20.1202 6.69944 19.0389 5.98478 18.0068 6.32362L15.3641 7.60311Z"
                  fill="black"
                />
              </svg>
            </button>
            <button
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-gray-100 transition"
              title="Start call"
              onClick={() => setInCall(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M19.3789 16.0703C18.6966 15.3828 17.044 14.3795 16.2422 13.9751C15.198 13.4492 15.1121 13.4062 14.2914 14.016C13.744 14.4229 13.38 14.7864 12.7394 14.6498C12.0987 14.5131 10.7065 13.7427 9.4875 12.5275C8.26848 11.3124 7.45336 9.87979 7.31629 9.24127C7.17922 8.60276 7.54875 8.24311 7.9518 7.6944C8.51985 6.92096 8.47688 6.79206 7.99133 5.74792C7.61277 4.93581 6.58024 3.2987 5.89016 2.61979C5.15195 1.89061 5.15196 2.01952 4.67629 2.21717C4.28903 2.38007 3.91751 2.57813 3.56641 2.80885C2.87891 3.26561 2.49735 3.64502 2.23051 4.21522C1.96367 4.78542 1.84379 6.12217 3.2218 8.62553C4.59981 11.1289 5.5666 12.4089 7.56766 14.4044C9.56871 16.3999 11.1074 17.4728 13.3568 18.7344C16.1395 20.2928 17.2068 19.989 17.7788 19.7226C18.3507 19.4562 18.7318 19.0781 19.1894 18.3906C19.4207 18.0401 19.6192 17.669 19.7824 17.282C19.9805 16.8081 20.1094 16.8081 19.3789 16.0703Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
            </>
          )
        }
        {/* Threads Button */}
        <button
          className="border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-100 transition"
          onClick={onOpenThreadSidebar}
        >
          Threads
        </button>
        {/* Search Input */}
        <div className="relative">
          <InputSearch
            type="text"
            placeholder="Search"
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

export default WorkspaceHeader;
