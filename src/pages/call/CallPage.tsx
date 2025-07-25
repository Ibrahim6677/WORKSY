import { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaceParams } from "../../hooks/useWorkspace/useWorkspaceParams";
import { useCall } from "../../hooks/useCall/useCall";
import LoadingPage from "../loadingPage";

const CallLayout = lazy(() => import("../../layouts/CallLayout/CallLayout"));

const CallPage = () => {
  const { currentCall, isInCall, endCall } = useCall();
  const navigate = useNavigate();
  const { workspaceId } = useWorkspaceParams();
  
  const wsId = workspaceId || 'default';
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showChatSidebar, setShowChatSidebar] = useState(false);

  const handleEndCall = async () => {
    if (currentCall) {
      await endCall(wsId, currentCall.id);
      // Redirect after ending call
      navigate(`/workspace/${wsId}/channels/general`);
    }
  };

  // إذا مفيش مكالمة، ارجع للدردشة
  if (!isInCall || !currentCall) {
    navigate(`/workspace/${wsId}/channels/general`);
    return null;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <CallLayout showHeader={true}>
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white relative">
          {/* Call Info */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-xl font-semibold">{currentCall.title}</h2>
            <p className="text-gray-300 text-sm">
              {currentCall.type === 'audio' ? 'Voice Call' : 'Video Call'}
            </p>
          </div>

          {/* Main Video/Audio Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            {/* Microphone Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full transition ${
                isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>

            {/* Camera Toggle */}
            {currentCall.type === 'video' && (
              <button
                onClick={() => setIsCamOn(!isCamOn)}
                className={`p-4 rounded-full transition ${
                  isCamOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </button>
            )}

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
              </svg>
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChatSidebar(!showChatSidebar)}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
          </div>

          {/* Call Duration */}
          <div className="absolute top-8 right-8 text-gray-300">
            <span className="text-sm">00:00</span>
          </div>
        </div>
      </CallLayout>
    </Suspense>
  );
};

export default CallPage;