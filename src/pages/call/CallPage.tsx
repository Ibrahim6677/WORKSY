import { Suspense, lazy, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingPage from "../loadingPage";
import { useWorkspaceParams } from "../../hooks/useWorkspace/useWorkspaceParams";

const CallLayout = lazy(() => import("../../layouts/CallLayout/CallLayout"));
const CallControls = lazy(() => import("../../components/organisms/CallControls/CallControls"));
const CallSidebar = lazy(() => import("../../components/organisms/Sidebar/CallSidebar"));

const dummyUsers = [
  { id: 1, name: "Cassie Jung" },
  { id: 2, name: "Alice Wong" },
  { id: 3, name: "Theresa Webb" },
  { id: 4, name: "Christian Wong" },
  { id: 5, name: "Linda Kay" },
];

const dummyMembers = [
  "George Alan",
  "Safiya Fareena",
  "Robert Allen",
  "Scott Franklin",
  "Scott Franklin",
  "Scott Franklin",
  "Scott Franklin",
  "Muhammed",
];

const dummyMessages = [
  { id: 1, user: "Linda Kay", text: "Good afternoon, everyone." },
  { id: 2, user: "Scott Franklin", text: "We will start this meeting now." },
  { id: 3, user: "Scott Franklin", text: "Can you guys hear my voice?" },
  { id: 4, user: "Muhammed", text: "absolutely!" },
];

const CallPage = () => {
  const [isInCall, setIsInCall] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useWorkspaceParams();
  
  // If no workspace ID, default to a fallback
  const wsId = workspaceId || 'default';
  
  // Check if this is a DM call or channel call
  const isDMCall = location.pathname.includes('/dms/');
  const channelId = location.pathname.split('/')[4]; // Get channel or conversation ID
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showChatSidebar, setShowChatSidebar] = useState(false);

  // حالة المايك لكل مستخدم
  const [userMics, setUserMics] = useState<Record<number, boolean>>(
    dummyUsers.reduce((acc, user) => ({ ...acc, [user.id]: true }), {})
  );

  // دالة تبديل حالة المايك لمستخدم معين
  const toggleUserMic = (userId: number) => {
    setUserMics((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };
  
  if (!isInCall) {
    setTimeout(() => {
      // Redirect based on call type
      if (isDMCall) {
        navigate(`/workspace/${wsId}/dms/${channelId}`);
      } else {
        navigate(`/workspace/${wsId}/channels/${channelId}`);
      }
    }, 3000);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-bold text-gray-700">
        {!isInCall && (
          <div className="animate-pulse bg-white p-6 rounded-lg shadow-lg mb-4">
            <p>Call ended. Redirecting to chat...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <CallLayout>
        <div className="flex w-full h-[92vh]">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col items-center justify-between px-2 py-4">
            {/* شبكة الفيديو باستخدام grid */}
            <div className="w-full flex flex-col gap-4 mb-4">
              {/* Main Speaker - Large Video */}
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[600px] h-[400px] bg-gray-300 rounded-2xl flex flex-col items-center justify-center font-bold text-xl text-gray-700 shadow-lg relative overflow-hidden">
                  {/* Profile Image */}
                  <div className="w-32 h-32 rounded-full bg-gray-400 mb-4 flex items-center justify-center">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt={dummyUsers[0].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-white bg-black bg-opacity-30 px-3 py-1 rounded-lg">
                    {dummyUsers[0].name}
                  </span>
                  {/* Recording Indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">Recording</span>
                  </div>
                  {/* Mic Status */}
                  <div className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13.5727 6.42725H7.50248H7.22656V10.681L9.70982 13.4155H11.3653L13.5727 10.9848V6.42725Z" fill="white" fillOpacity="0.8" />
                      <path d="M10.3996 13.0125C12.1527 13.0125 13.5727 11.5691 13.5727 9.78709V5.3522C13.5727 3.57018 12.1527 2.12683 10.3996 2.12683C8.6465 2.12683 7.22656 3.57018 7.22656 5.3522V9.78709C7.22656 11.5691 8.6465 13.0125 10.3996 13.0125Z" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* باقي المستخدمين في شبكة grid */}
              <div className="w-full grid grid-cols-4 gap-3 justify-items-center">
                {dummyUsers.slice(1, 5).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-full max-w-[140px] h-[90px] bg-gray-200 rounded-xl flex flex-col items-center justify-center font-bold text-sm text-gray-700 shadow relative overflow-hidden"
                  >
                    {/* Profile Image for small videos */}
                    <div className="w-12 h-12 rounded-full bg-gray-400 mb-1 flex items-center justify-center">
                      <img 
                        src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${40 + index}.jpg`}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-center px-1">{user.name}</span>
                    
                    {/* Corner indicators */}
                    <div className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 rounded-full">
                      <button onClick={() => toggleUserMic(user.id)}>
                        {userMics[user.id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" fill="none">
                            <path d="M13.5727 6.42725H7.50248H7.22656V10.681L9.70982 13.4155H11.3653L13.5727 10.9848V6.42725Z" fill="white" fillOpacity="0.8" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M16 6.3V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.0697 2.83997L3.92969 18.99" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Controls */}
            <CallControls
              isMicOn={isMicOn}
              isCamOn={isCamOn}
              onToggleMic={() => setIsMicOn((prev) => !prev)}
              onToggleCam={() => setIsCamOn((prev) => !prev)}
              onEndCall={() => setIsInCall(false)}
              onToggleChat={() => setShowChatSidebar((prev) => !prev)}
            />
          </div>
          {/* Sidebar: Members + Chat (يمين) */}
          <CallSidebar
            showChatSidebar={showChatSidebar}
            setShowChatSidebar={setShowChatSidebar}
            dummyMembers={dummyMembers}
            dummyMessages={dummyMessages}
          />
        </div>
      </CallLayout>
    </Suspense>
  );
};

export default CallPage;
