import axios from 'axios';
import { LoginDto, RegisterDto } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5259/api';

export const authService = {
    login: async (credentials: LoginDto) => {
        const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    register: async (userData: RegisterDto) => {
        const { data } = await axios.post(`${API_URL}/auth/register`, userData);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};