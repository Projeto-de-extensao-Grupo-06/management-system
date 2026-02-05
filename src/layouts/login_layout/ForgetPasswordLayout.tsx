import { Outlet } from 'react-router';
import AuthLayout from './AuthLayout';

export default function ForgetPasswordLayout() {
  return (
    <AuthLayout title="REDEFINIÇÃO DE SENHA">
      <Outlet />
    </AuthLayout>
  );
}