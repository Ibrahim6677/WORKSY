import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ إضافة useLocation
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchWorkspaces } from "../../features/workspace/workspaceSlice";
import { BottomLink } from "../../components/atoms/Bottom/BottomLink";
import LoadingPage from "../loadingPage";

export default function WorkspaceList() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation(); // ✅ للحصول على الـ state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // ✅ إضافة error handling
  const { 
    workspaces = [], 
    loading = false, 
    error = null 
  } = useSelector((state: RootState) => state.workspace || {});

  useEffect(() => {
    console.log('🚀 Fetching workspaces...');
    dispatch(fetchWorkspaces());
    
    // ✅ عرض رسالة النجاح إذا وجدت
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // إخفاء الرسالة بعد 5 ثوانِ
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [dispatch, location.state]);

  // ✅ Loading state
  if (loading) {
    return <LoadingPage />;
  }

  // ✅ Error state
  if (error) {
    console.error('❌ Workspace error:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-300 text-8xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Failed to Load Workspaces
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {error || 'Something went wrong while loading your workspaces.'}
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => dispatch(fetchWorkspaces())}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <BottomLink to="/workspace/create" variant="filled">
              Create New Workspace
            </BottomLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ✅ رسالة النجاح */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="text-green-600">🎉</div>
            <p className="text-green-700 font-medium">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-400 hover:text-green-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Workspaces</h2>
          <p className="text-gray-600">Choose a workspace to start collaborating with your team</p>
        </div>
        <BottomLink to="/workspace/create" variant="filled">
          🚀 Create New Workspace
        </BottomLink>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-300 text-8xl mb-6">🏢</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Workspaces Available</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Start your collaborative journey by creating your first workspace. 
            You can invite your team and start collaborating immediately!
          </p>
          <BottomLink to="/workspace/create" variant="filled">
            🚀 Create New Workspace
          </BottomLink>
        </div>
      ) : (
        <div className="space-y-4">
          {workspaces.map((ws: any, index: number) => (
            <div
              key={ws?.id || `workspace-${index}`}
              className="bg-white border border-gray-200 flex items-center justify-between p-6 rounded-xl hover:shadow-md transition-all duration-200 hover:border-purple-300"
            >
              <div className="flex items-center gap-4">
                {ws?.image ? (
                  <img 
                    src={ws.image} 
                    alt={ws?.name || 'Workspace'}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {ws?.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {ws?.name || 'Unnamed Workspace'}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {ws?.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {ws?.createdAt ? new Date(ws.createdAt).toLocaleDateString('en-US') : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {ws?.role && (
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    ws.role === 'owner' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {ws.role === 'owner' ? '👑 Owner' : '👤 Member'}
                  </span>
                )}
                <BottomLink to={`/workspace/${ws?.id || 'demo'}/channels`} variant="filled">
                  Enter Workspace
                </BottomLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
