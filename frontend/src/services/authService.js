import api from './api';

export const authService = {
    /** Register a new user */
    register: async (name, email, password, password_confirmation) => {
        const { data } = await api.post('/register', { name, email, password, password_confirmation });
        localStorage.setItem('mindrest_token', data.token);
        localStorage.setItem('mindrest_user', JSON.stringify(data.user));
        return data;
    },

    /** Login */
    login: async (email, password) => {
        const { data } = await api.post('/login', { email, password });
        localStorage.setItem('mindrest_token', data.token);
        localStorage.setItem('mindrest_user', JSON.stringify(data.user));
        return data;
    },

    /** Logout */
    logout: async () => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('mindrest_token');
            localStorage.removeItem('mindrest_user');
        }
    },

    /** Get current user from localStorage */
    getUser: () => {
        const user = localStorage.getItem('mindrest_user');
        return user ? JSON.parse(user) : null;
    },

    /** Check if logged in */
    isAuthenticated: () => !!localStorage.getItem('mindrest_token'),
};
