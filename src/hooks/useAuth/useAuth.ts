// src/hooks/useAuth/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import { loginWithGoogleThunk } from '../../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const loginWithGoogle = async (googleCredential: string) => {
    const result = await dispatch(loginWithGoogleThunk(googleCredential));
    
    if (loginWithGoogleThunk.fulfilled.match(result)) {
      return result;
    } else {
      throw new Error('Google login failed');
    }
  };

  return {
    ...auth,
    loginWithGoogle,
  };
};
