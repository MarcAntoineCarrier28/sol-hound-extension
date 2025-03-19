import React from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { baseURL } from '@/data/const';

const LoginStatus: React.FC = () => {
  const { authStatus, loading } = useAuthStatus();

  const handleLoginClick = () => {
    window.open(baseURL + '/sign-in', '_blank');
  };

  const handleGetPremiumClick = () => {
    window.open(baseURL + '/#pricing', '_blank');
  };

  const handleLogoutClick = () => {
    window.open(baseURL + '/sign-out', '_blank');
  };

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
};

export default LoginStatus;
