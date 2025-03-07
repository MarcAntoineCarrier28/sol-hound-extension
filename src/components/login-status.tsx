import React from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { baseURL } from '@/data/const';

const LoginStatus: React.FC = () => {
  const { authStatus, loading } = useAuthStatus();

  const handleLoginClick = () => {
    window.open(baseURL + '/sign-in', '_blank');
  };

  if (loading) return <p>Loading...</p>;

  if (!authStatus.session) {
    return <button onClick={handleLoginClick}>Login</button>;
  }

  return (
    <div>
      <p>
        Logged in as: <strong>{authStatus.session.user.email}</strong>
      </p>
      <p>
        Subscription status: <strong>{authStatus.subscription}</strong>
      </p>
    </div>
  );
};

export default LoginStatus;
