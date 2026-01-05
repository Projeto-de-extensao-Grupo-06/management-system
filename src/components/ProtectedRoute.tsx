import { Outlet } from 'react-router';
import Unauthorized from '../pages/shared/Unauthorized';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    console.log('ProtectedRoute: isAuthenticated =', isAuthenticated);

    if (!isAuthenticated) {
        return <Unauthorized />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
