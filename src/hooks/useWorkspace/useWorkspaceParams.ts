import { useParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface UseWorkspaceParamsReturn {
  workspaceId: string | undefined;
  channelId: string | undefined;
  conversationId: string | undefined;
  fileId: string | undefined;
  
  // Navigation helpers
  navigateToWorkspace: (workspaceId: string) => void;
  navigateToChannel: (workspaceId: string, channelId: string) => void;
  navigateToChannelCall: (workspaceId: string, channelId: string) => void;
  navigateToDirectMessage: (workspaceId: string, conversationId: string) => void;
  navigateToFile: (workspaceId: string, fileId: string) => void;
  navigateToSettings: (workspaceId: string, section?: string) => void;
  
  // URL builders
  buildWorkspaceUrl: (workspaceId: string) => string;
  buildChannelUrl: (workspaceId: string, channelId: string) => string;
  buildDirectMessageUrl: (workspaceId: string, conversationId: string) => string;
}

export const useWorkspaceParams = (): UseWorkspaceParamsReturn => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    workspaceId,
    channelId,
    conversationId,
    fileId
  } = params;

  // Navigation helpers
  const navigateToWorkspace = useCallback((wsId: string) => {
    navigate(`/workspace/${wsId}`);
  }, [navigate]);

  const navigateToChannel = useCallback((wsId: string, chId: string) => {
    navigate(`/workspace/${wsId}/channels/${chId}`);
  }, [navigate]);

  const navigateToChannelCall = useCallback((wsId: string, chId: string) => {
    navigate(`/workspace/${wsId}/channels/${chId}/call`);
  }, [navigate]);

  const navigateToDirectMessage = useCallback((wsId: string, convId: string) => {
    navigate(`/workspace/${wsId}/dms/${convId}`);
  }, [navigate]);

  const navigateToFile = useCallback((wsId: string, fId: string) => {
    navigate(`/workspace/${wsId}/files/${fId}`);
  }, [navigate]);

  const navigateToSettings = useCallback((wsId: string, section: string = 'profile') => {
    navigate(`/workspace/${wsId}/settings/${section}`);
  }, [navigate]);

  // URL builders
  const buildWorkspaceUrl = useCallback((wsId: string) => {
    return `/workspace/${wsId}`;
  }, []);

  const buildChannelUrl = useCallback((wsId: string, chId: string) => {
    return `/workspace/${wsId}/channels/${chId}`;
  }, []);

  const buildDirectMessageUrl = useCallback((wsId: string, convId: string) => {
    return `/workspace/${wsId}/dms/${convId}`;
  }, []);

  return {
    workspaceId,
    channelId,
    conversationId,
    fileId,
    navigateToWorkspace,
    navigateToChannel,
    navigateToChannelCall,
    navigateToDirectMessage,
    navigateToFile,
    navigateToSettings,
    buildWorkspaceUrl,
    buildChannelUrl,
    buildDirectMessageUrl
  };
};
