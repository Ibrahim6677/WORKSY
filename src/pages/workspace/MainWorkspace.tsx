import { BottomLink } from "../../components/atoms/Bottom/BottomLink";

const workspaces = [
  { id: 1, name: "codie", members: 12, color: "bg-blue-400" },
  { id: 2, name: "bread fast", members: 50, color: "bg-neutral-600" },
  { id: 3, name: "bread fast", members: 20, color: "bg-pink-300" }
];

export default function WorkspaceList() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize">your workspaces</h2>
        <BottomLink to="/create-workspace" variant="filled">
          Create Workspace
        </BottomLink>
      </div>

      <div className="space-y-4">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className="bg-purple-100 flex items-center justify-between p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-md ${ws.color}`} />
              <div>
                <p className="text-sm font-semibold">{ws.name}</p>
                <p className="text-xs text-gray-500">{ws.members} members</p>
              </div>
            </div>
            <BottomLink to="/workspace/channels/chat" variant="filled">
              Enter Workspace
            </BottomLink>
          </div>
        ))}
      </div>
    </div>
  );
}
