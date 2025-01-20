import React, { useState, useEffect } from 'react';
import { Appointment } from '../types/appointment.types';
import './AppointmentFormModal.css';

interface AppointmentFormModal {
    appointment?: Appointment;
    onClose: () => void;
    onSubmit: (appointmentTime: Date) => void;
}

export const AppointmentFormModal = ({ appointment, onClose, onSubmit }: AppointmentFormModal) => {
    const [appointmentTime, setAppointmentTime] = useState<string>('');

    useEffect(() => {
        if (appointment) {
            const date = new Date(appointment.appointmentTime);
            setAppointmentTime(date.toISOString().slice(0, 16));
        }
    }, [appointment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (appointmentTime) {
            onSubmit(new Date(appointmentTime));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    {appointment ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-group">
                        <label htmlFor="appointmentTime">Appointment Time</label>
                        <input
                            id="appointmentTime"
                            type="datetime-local"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="submit-btn">
                            {appointment ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};