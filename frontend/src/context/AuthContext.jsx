import { createContext, useState, useEffect } from 'react';
import { getMe, logout } from '../api/admin';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data } = await getMe();
            setAdmin(data.admin);
        } catch {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = (adminData) => {
        setAdmin(adminData);
    };

    const logoutAdmin = async () => {
        try {
            await logout();
        } catch {
            // Always clear client state even if server logout request fails
        }
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
