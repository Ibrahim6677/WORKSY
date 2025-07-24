import { useState } from 'react';
import { 
  createWorkspaceInvites, 
  generateWorkspaceInviteLink, 
  getWorkspaceInvites
} from '../../services/api/invites/invitesApi';
import { type CreateInvitePayload } from '../../services/api/invites/invitesApi';
import type { InviteResponse } from '../../services/api/invites/invitesApi';

interface UseInvitesReturn {
  // State
  invites: InviteResponse[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendInvites: (workspaceId: string, payload: CreateInvitePayload) => Promise<InviteResponse[]>;
  generateInviteLink: (workspaceId: string, role?: 'admin' | 'member') => Promise<string>;
  loadInvites: (workspaceId: string) => Promise<void>;
  copyInviteLink: (workspaceId: string, role?: 'admin' | 'member') => Promise<string>;
  clearError: () => void;
}

export const useInvites = (): UseInvitesReturn => {
  const [invites, setInvites] = useState<InviteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const sendInvites = async (workspaceId: string, payload: CreateInvitePayload): Promise<InviteResponse[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newInvites = await createWorkspaceInvites(workspaceId, payload);
      setInvites(prev => [...prev, ...newInvites]);
      return newInvites;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send invites';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteLink = async (workspaceId: string, role: 'admin' | 'member' = 'member'): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const inviteLink = await generateWorkspaceInviteLink(workspaceId, role);
      return inviteLink;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate invite link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInvites = async (workspaceId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const workspaceInvites = await getWorkspaceInvites(workspaceId);
      setInvites(workspaceInvites);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load invites';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = async (workspaceId: string, role: 'admin' | 'member' = 'member'): Promise<string> => {
    try {
      const inviteLink = await generateInviteLink(workspaceId, role);
      
      // Copy to clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      return inviteLink;
    } catch (err: any) {
      throw new Error('Failed to copy invite link');
    }
  };

  return {
    invites,
    isLoading,
    error,
    sendInvites,
    generateInviteLink,
    loadInvites,
    copyInviteLink,
    clearError
  };
};
