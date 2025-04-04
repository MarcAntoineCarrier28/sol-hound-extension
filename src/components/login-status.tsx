import React, { memo, useCallback } from 'react';
import { AuthStatus, setStoredAuthStatus } from '@/utils/auth-storage';
import { baseURL } from '@/data/const';

interface LoginStatusProps {
  authStatus: AuthStatus;
  loading: boolean;
}

const LoginStatus: React.FC<LoginStatusProps> = memo(({ authStatus, loading }) => {
  const handleLoginClick = useCallback(() => {
    window.open(baseURL + '/sign-in', '_blank');
  }, []);

  const handleLogoutClick = useCallback(async () => {
    // First, clear the local auth status immediately so content scripts will know
    await setStoredAuthStatus({ session: null, subscription: null });
    
    // Then open the sign-out page to complete the server-side logout
    window.open(baseURL + '/sign-out', '_blank');
  }, []);

  if (loading) return <p className="text-gray-300">Loading...</p>;

  if (!authStatus.session) {
    return (
      <button 
        className="bg-purple-700 text-white border-none rounded py-2 px-4 font-medium cursor-pointer transition-colors hover:bg-purple-600"
        onClick={handleLoginClick}
      >
        Login
      </button>
    );
  }

  return (
    <div className="text-center">
      <p className="mb-1">
        Welcome <strong className="font-semibold">{authStatus.session.user.email}</strong>
      </p>
      {authStatus.subscription && (
        <div className="text-purple-300 text-sm mb-2">Thank you for being a Pro member</div>
      )}
      <button 
        className="bg-transparent text-white border border-white/40 rounded py-1.5 px-4 text-sm cursor-pointer transition-colors mt-2 hover:bg-white/10" 
        onClick={handleLogoutClick}
      >
        Logout
      </button>
    </div>
  );
});

LoginStatus.displayName = 'LoginStatus';

export default LoginStatus;
