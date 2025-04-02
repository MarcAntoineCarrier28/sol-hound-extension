import React, { memo, useCallback } from 'react';
import { AuthStatus } from '@/utils/auth-storage';
import { baseURL } from '@/data/const';

interface LoginStatusProps {
  authStatus: AuthStatus;
  loading: boolean;
}

const LoginStatus: React.FC<LoginStatusProps> = memo(({ authStatus, loading }) => {
  const handleLoginClick = useCallback(() => {
    window.open(baseURL + '/sign-in', '_blank');
  }, []);

  const handleLogoutClick = useCallback(() => {
    window.open(baseURL + '/sign-out', '_blank');
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!authStatus.session) {
    return <button className='btn-primary' onClick={handleLoginClick}>Login</button>;
  }

  return (
    <div>
      <p>
        Welcome <strong>{authStatus.session.user.email}</strong>
      </p>
      {authStatus.subscription &&
        <div>Thank you for being a Pro member</div>
      }
      <button className='btn-secondary' style={{ marginTop: '8px' }} onClick={handleLogoutClick}>Logout</button>
    </div>
  );
});

LoginStatus.displayName = 'LoginStatus';

export default LoginStatus;
