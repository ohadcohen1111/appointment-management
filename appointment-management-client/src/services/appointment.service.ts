import axios from 'axios';
import { CreateAppointmentDto, UpdateAppointmentDto, GetAppointmentsParams, Appointment } from '../types/appointment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5259/api';

// add token to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const appointmentService = {
  getAll: async (params?: GetAppointmentsParams) => {
    const { data } = await axios.get(`${API_URL}/appointments`, {
      params: {
        startDate: params?.startDate?.toISOString(),
        endDate: params?.endDate?.toISOString(),
        searchTerm: params?.searchTerm
      }
    });
    
    const newData = data.map((appointment: Appointment) => ({
      ...appointment,
      createdAt: new Date(appointment.createdAt + 'Z'),
      appointmentTime: new Date(appointment.appointmentTime + 'Z')
    }));

    return newData;
  },

  getById: async (id: number) => {
    const { data } = await axios.get(`${API_URL}/appointments/${id}`);
    return data;
  },

  create: async (appointment: CreateAppointmentDto) => {
    const { data } = await axios.post(`${API_URL}/appointments`, appointment);
    return data;
  },

  update: async (id: number, appointment: UpdateAppointmentDto) => {
    const response = await axios.put(`${API_URL}/appointments/${id}`, appointment);
    return { status: response.status, ok: response.status === 204 };
  },

  delete: async (id: number) => {
    const response = await axios.delete(`${API_URL}/appointments/${id}`);
    return { status: response.status, ok: response.status === 204 };
  }
};