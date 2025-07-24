import { useState } from 'react';
import { BottomLink } from '../../../components/atoms/Bottom/BottomLink';
import { useInvites } from '../../../hooks/useInvites/useInvites';
import { Copy, Mail } from 'lucide-react';
import InviteLinkModal from '../../../components/atoms/InviteLinkModal/InviteLinkModal';

interface WorkspaceData {
  id?: string; // Add workspace ID
  name: string;
  description: string;
  image: string | null;
  userName: string;
  userPhoto: File | null;
  inviteEmails: string[];
}

interface Props {
  prevStep: () => void;
  workspaceData: WorkspaceData;
  updateWorkspaceData: (data: Partial<WorkspaceData>) => void;
  onSubmit: () => void;
}

export default function Step3InviteTeam({ prevStep, workspaceData, updateWorkspaceData, onSubmit }: Props) {
  const [emailInput, setEmailInput] = useState(workspaceData.inviteEmails.join(', '));
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  
  const { sendInvites, generateInviteLink, error, clearError } = useInvites();

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    
    // Parse emails from the input
    const emails = value
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    updateWorkspaceData({ inviteEmails: emails });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    clearError();
    
    try {
      // First create the workspace (this should set workspaceData.id)
      await onSubmit();
      
      // Then send invites if workspace was created and we have emails
      if (workspaceData.id && workspaceData.inviteEmails.length > 0) {
        await sendInvites(workspaceData.id, {
          emails: workspaceData.inviteEmails,
          role: 'member'
        });
      }
    } catch (err: any) {
      console.error('Error creating workspace or sending invites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!workspaceData.id) {
      alert('يجب إنشاء الـ workspace أولاً');
      return;
    }

    try {
      const inviteLink = await generateInviteLink(workspaceData.id, 'member');
      setGeneratedInviteLink(inviteLink);
      setShowInviteModal(true);
    } catch (err: any) {
      alert('فشل في توليد الرابط: ' + err.message);
    }
  };
  return (
    <div className="text-left w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">let's set up your workspace</h2>
      <h3 className="text-lg font-bold mb-1 mt-6">invite your team</h3>
      <div className="flex items-center gap-2 mb-6 mt-2">
        <span className="text-xs text-gray-500">EX.Sara@gmail.com</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
          <Mail className="w-4 h-4" />
          Add From Google
        </span>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <textarea
        placeholder="EX.Sara@gmail.com"
        rows={4}
        value={emailInput}
        onChange={handleEmailInputChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6 resize-none"
      />
      
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={prevStep}
          className="border px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm"
        >
          back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-purple-600 text-white px-8 py-2 rounded-md hover:bg-purple-700 transition text-sm font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Workspace'}
        </button>
        <BottomLink
          to="/workspace"
          variant="outline"
          className="ml-2 text-gray-500 text-sm hover:underline bg-transparent border-none shadow-none"
        >
          skip this step
        </BottomLink>
        
        {/* Copy Invite Link Button */}
        <button 
          onClick={handleCopyInviteLink}
          disabled={!workspaceData.id}
          className={`ml-auto flex items-center gap-1 border border-purple-200 text-purple-700 px-3 py-1 rounded text-xs transition ${
            !workspaceData.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
          }`}
        >
          <Copy className="w-4 h-4" />
          copy link invite
        </button>
      </div>
      
      {/* Instructions for invite link */}
      {!workspaceData.id && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            💡 <strong>نصيحة:</strong> بعد إنشاء الـ workspace، يمكنك نسخ رابط الدعوة لمشاركته مع أعضاء الفريق
          </p>
        </div>
      )}
      
      {/* Invite Link Modal */}
      <InviteLinkModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        inviteLink={generatedInviteLink}
        workspaceName={workspaceData.name}
      />
    </div>
  );
}
