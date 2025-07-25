import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import { 
  createCallThunk, 
  joinCallThunk, 
  leaveCallThunk, 
  endCallThunk,
  updateCallSettings,
  clearError
} from '../../features/call/callSlice';
import * as callApi from '../../services/api/call/callApi';

export const useCall = () => {
  const dispatch = useDispatch<AppDispatch>();
  const call = useSelector((state: RootState) => state.call);

  const createCall = async (workspaceId: string, callData: callApi.CreateCallData) => {
    const result = await dispatch(createCallThunk({ workspaceId, callData }));
    return result;
  };

  const joinCall = async (workspaceId: string, callId: string, joinData?: callApi.JoinCallData) => {
    const result = await dispatch(joinCallThunk({ workspaceId, callId, joinData }));
    return result;
  };

  const leaveCall = async (workspaceId: string, callId: string) => {
    const result = await dispatch(leaveCallThunk({ workspaceId, callId }));
    return result;
  };

  const endCall = async (workspaceId: string, callId: string) => {
    const result = await dispatch(endCallThunk({ workspaceId, callId }));
    return result;
  };

  const updateSettings = (settings: Partial<callApi.CallSettings>) => {
    dispatch(updateCallSettings(settings));
  };

  const clearCallError = () => {
    dispatch(clearError());
  };

  return {
    ...call,
    createCall,
    joinCall,
    leaveCall,
    endCall,
    updateSettings,
    clearCallError,
  };
};