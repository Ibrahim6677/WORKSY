import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchWorkspaces } from "../../features/workspace/workspaceSlice";
import { BottomLink } from "../../components/atoms/Bottom/BottomLink";

export default function WorkspaceList() {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaces, loading, error } = useSelector((state: RootState) => state.workspace);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading workspaces</p>
          <p>{error}</p>
          <button 
            onClick={() => dispatch(fetchWorkspaces())}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Workspaces</h2>
          <p className="text-gray-600">Choose a workspace to start collaborating with your team</p>
        </div>
        <BottomLink to="/workspace/create" variant="filled">
          ➕ Create New Workspace
        </BottomLink>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-300 text-8xl mb-6">🏢</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Workspaces Found</h3>
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
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="bg-white border border-gray-200 flex items-center justify-between p-6 rounded-xl hover:shadow-md transition-all duration-200 hover:border-purple-300"
            >
              <div className="flex items-center gap-4">
                {/* صورة الـ workspace أو أيقونة افتراضية */}
                {ws.image ? (
                  <img 
                    src={ws.image} 
                    alt={ws.name}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-800">{ws.name}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {ws.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(ws.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {ws.role && (
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    ws.role === 'owner' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {ws.role === 'owner' ? '👑 Owner' : '👤 Member'}
                  </span>
                )}
                <BottomLink to={`/workspace/${ws.id}/channels`} variant="filled">
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
