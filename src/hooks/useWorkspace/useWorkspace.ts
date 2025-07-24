import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';

export const useWorkspace = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkspace, workspaces, loading, error } = useSelector(
    (state: RootState) => state.workspace
  );

  return {
    currentWorkspace,
    workspaces,
    loading,
    error,
  };
};