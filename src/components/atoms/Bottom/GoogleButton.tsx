import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useNavigate } from 'react-router-dom';

const GoogleButton = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log('🎉 Google login initiated');
      
      if (credentialResponse?.credential) {
        await loginWithGoogle(credentialResponse.credential);
        console.log('✅ Login successful, redirecting...');
        navigate('/workspace');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error('❌ Google OAuth error')}
        theme="outline"
        size="large"
        text="signin_with"
        width="100%"
      />
    </div>
  );
};

export default GoogleButton;