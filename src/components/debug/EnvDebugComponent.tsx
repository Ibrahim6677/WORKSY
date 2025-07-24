import React from 'react';

const EnvDebugComponent: React.FC = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Environment Variables Debug:</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>VITE_GOOGLE_CLIENT_ID:</strong> 
          <span className={clientId ? 'text-green-600' : 'text-red-600'}>
            {clientId ? `${clientId.substring(0, 20)}...` : 'NOT SET'}
          </span>
        </div>
        <div>
          <strong>VITE_GOOGLE_CLIENT_SECRET:</strong> 
          <span className={clientSecret ? 'text-green-600' : 'text-red-600'}>
            {clientSecret ? 'SET' : 'NOT SET'}
          </span>
        </div>
        <div>
          <strong>VITE_GOOGLE_REDIRECT_URI:</strong> 
          <span className={redirectUri ? 'text-green-600' : 'text-red-600'}>
            {redirectUri || 'NOT SET'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnvDebugComponent;
