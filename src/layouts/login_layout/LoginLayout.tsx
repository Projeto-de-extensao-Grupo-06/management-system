import { Outlet } from 'react-router';
import AuthLayout from './AuthLayout';

export default function LoginLayout() {
  return (
    <AuthLayout title="FAÇA SEU LOGIN">
      <Outlet />
    </AuthLayout>
  );
}