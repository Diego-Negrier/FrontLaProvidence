// components/context/AuthRedirect.tsx

import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated , user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || user?.pk === 1000) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    return <>{children}</>;
};

export default AuthRedirect;