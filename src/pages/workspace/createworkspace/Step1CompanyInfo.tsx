import { useState } from 'react';

interface WorkspaceData {
  name: string;
  description: string;
  image: string | null;
  userName: string;
  userPhoto: File | null;
  inviteEmails: string[];
}

interface Props {
  nextStep: () => void;
  workspaceData: WorkspaceData;
  updateWorkspaceData: (data: Partial<WorkspaceData>) => void;
}

export default function Step1CompanyInfo({ nextStep, workspaceData, updateWorkspaceData }: Props) {
  const [name, setName] = useState(workspaceData.name);
  const [description, setDescription] = useState(workspaceData.description);

  const handleNext = () => {
    updateWorkspaceData({ name: name.trim(), description: description.trim() });
    nextStep();
  };
  return (
    <div className="text-left w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">let's set up your workspace</h2>
      <h3 className="text-lg font-bold mb-1 mt-6">what is your company name or team?</h3>
      <p className="text-gray-500 mb-6 text-sm">
        this will be the name of your workspace choose<br />
        something your team will recognize
      </p>
      
      {/* Workspace Name */}
      <div className="relative w-full mb-4">
        <input
          type="text"
          placeholder="EX: Acme Marketing Team"
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
          {50 - name.length}
        </span>
      </div>

      {/* Workspace Description */}
      <div className="relative w-full mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          placeholder="Describe what your team does..."
          maxLength={200}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <span className="absolute right-2 bottom-2 text-gray-400 text-xs">
          {200 - description.length}
        </span>
      </div>
      
      <button
        onClick={handleNext}
        disabled={!name.trim()}
        className={`px-8 py-2 rounded-md transition text-sm font-semibold ${
          name.trim()
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        next  
      </button>
    </div>
  );
}
