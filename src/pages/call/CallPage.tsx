import { useState } from "react";
import CallLayout from "../../layouts/CallLayout/CallLayout";
import CallControls from "../../components/organisms/CallControls/CallControls";
import { useNavigate } from "react-router-dom";
import CallSidebar from "../../components/organisms/Sidebar/CallSidebar";

const dummyUsers = [
  { id: 1, name: "Cassie Jung" },
  { id: 2, name: "Alice Wong" },
  { id: 3, name: "Theresa Webb" },
  { id: 4, name: "Christian Wong" },
  { id: 5, name: "Linda Kay" },
  { id: 6, name: "Linda Kay" },
  { id: 7, name: "Linda Kay" },
  { id: 8, name: "Linda Kay" },
  { id: 9, name: "Linda Kay" },
  { id: 10, name: "Linda Kay" },
  { id: 11, name: "Linda Kay" },
  { id: 12, name: "Linda Kay" },
  { id: 13, name: "Linda Kay" },
  { id: 14, name: "Linda Kay" },
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
  const navigate = useNavigate();
  if (!isInCall) {
    setTimeout(() => {
      navigate("/workspace/channels/chat");
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
    <CallLayout>
      <div className="flex w-full h-[92vh]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col items-center justify-between px-2 py-4">
          {/* شبكة الفيديو باستخدام grid */}
          <div className="w-full grid grid-cols-1 gap-4 mb-4">
            {/* Main Speaker */}
            <div className="w-full flex justify-center">
              <div className="w-[420px] h-[260px] bg-gray-300 rounded-2xl flex flex-col items-center justify-center font-bold text-xl text-gray-700 shadow-lg relative">
                <span>{dummyUsers[0].name}</span>
              </div>
            </div>
            {/* باقي المستخدمين في شبكة grid */}
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {dummyUsers.slice(1, 8).map((user) => (
                <div
                  key={user.id}
                  className="w-36 h-24 bg-gray-200 rounded-xl flex flex-col items-center justify-center font-bold text-base text-gray-700 shadow relative"
                >
                  <span>{user.name}</span>
                  <button
                    className="absolute bottom-2 right-2"
                    onClick={() => toggleUserMic(user.id)}
                  >
                    {userMics[user.id] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13.5727 6.42725H7.50248H7.22656V10.681L9.70982 13.4155H11.3653L13.5727 10.9848V6.42725Z" fill="white" fillOpacity="0.8" />
                        <path d="M10.3996 13.0125C12.1527 13.0125 13.5727 11.5691 13.5727 9.78709V5.3522C13.5727 3.57018 12.1527 2.12683 10.3996 2.12683C8.6465 2.12683 7.22656 3.57018 7.22656 5.3522V9.78709C7.22656 11.5691 8.6465 13.0125 10.3996 13.0125Z" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.33008 8.29529V9.66607C4.33008 13.0688 7.05097 15.8346 10.3985 15.8346C13.7461 15.8346 16.467 13.0688 16.467 9.66607V8.29529" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.3984 15.8346V18.2536" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M16 6.3V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.03906 14.19C9.76906 15 10.8291 15.5 11.9991 15.5C14.2091 15.5 15.9991 13.71 15.9991 11.5V11" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.7793 16.95C8.1493 18.22 9.9793 19 11.9993 19C16.2193 19 19.6493 15.57 19.6493 11.35V9.65002" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.34961 9.65002V11.35C4.34961 12.41 4.55961 13.41 4.94961 14.33" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.0697 2.83997L3.92969 18.99" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 3V6" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19V22" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
              {dummyUsers.length - 1 > 7 && (
                <div className="w-36 h-24 bg-gray-200 rounded-xl flex flex-col items-center justify-center font-bold text-base text-gray-700 shadow relative">
                  <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D1C4E9] text-[#6629DE] text-xl font-bold">+{dummyUsers.length - 8}</span>
                </div>
              )}
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
  );
};

export default CallPage;
