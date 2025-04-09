
import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';

const Auth: React.FC = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export default Auth;
