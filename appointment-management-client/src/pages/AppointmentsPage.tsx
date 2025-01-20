import { useEffect, useState } from "react";
import { Appointment } from "../types/appointment.types";
import { appointmentService } from "../services/appointment.service";
import { AppointmentModal } from "../components/AppointmentModal";
import { AppointmentFormModal } from "../components/AppointmentFormModal";
import AppointmentsTable from "../components/AppointmentsTable";
import AppointmentFilter from "../components/AppointmentFilter";
import { authService } from '../services/auth.service';
import { useNavigate } from "react-router-dom";
import './AppointmentsPage.css';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await appointmentService.getAll();
                setAppointments(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleDelete = async (id: number) => {
        try {

            await appointmentService.delete(id);
            setAppointments(prevAppointments =>
                prevAppointments.filter(appointment => appointment.id !== id)
            );

        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment');
        }
    };

    const handleEdit = async (e: React.MouseEvent, appointment: Appointment) => {
        e.preventDefault();
        setSelectedAppointment(appointment);
        setShowFormModal(true);
    };

    const handleSubmit = async (appointmentTime: Date) => {
        try {
            if (selectedAppointment) {
                // edit mode
                const result = await appointmentService.update(selectedAppointment.id, { appointmentTime });
                if (result.ok) {
                    setAppointments(prevAppointments =>
                        prevAppointments.map(app =>
                            app.id === selectedAppointment.id
                                ? { ...app, appointmentTime: new Date(appointmentTime.toString()) }
                                : app
                        )
                    );
                }
            } else {
                // create mode
                const newAppointment = await appointmentService.create({ appointmentTime });
                setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
            }
            setShowFormModal(false);
            setSelectedAppointment(null);
        } catch (error) {
            console.error('Failed to save appointment:', error);
        }
    };

    const handleFilter = async (startDate: string, endDate: string, searchTerm: string) => {
        try {
            setIsLoading(true);
            const data = await appointmentService.getAll({
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                searchTerm: searchTerm || undefined
            });
            setAppointments(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        try {
            authService.logout();
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data || 'Logout failed');
        }
    }

    return (
        <div className="appointments-page">
            {error && (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            )}

            <div className="header">
                <h1>Appointments</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="controls">
                <AppointmentFilter onFilter={handleFilter} />
                <button className="add-button" onClick={() => setShowFormModal(true)}>
                    Add Appointment
                </button>
            </div>

            {isLoading && !appointments && <div className="loading-container">
                <div className="loader"></div>
                <p>Loading appointments...</p>
            </div>}

            <AppointmentsTable
                appointments={appointments}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                setSelectedAppointment={setSelectedAppointment}
                setShowViewModal={setShowViewModal}
            />

            {showFormModal && (
                <AppointmentFormModal
                    appointment={selectedAppointment || undefined}
                    onClose={() => {
                        setShowFormModal(false);
                        setSelectedAppointment(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}

            {showViewModal && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedAppointment(null);
                    }}
                />
            )}
        </div>
    );
};

export default AppointmentsPage;