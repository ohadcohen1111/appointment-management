import { Appointment } from "../types/appointment.types";
import { formatDateTime } from "../utils";
import "./AppointmentsTable.css";

interface AppointmentsTableProps {
    appointments: Appointment[];
    setSelectedAppointment: (appointment: Appointment) => void;
    setShowViewModal: (value: boolean) => void;
    handleEdit: (e: React.MouseEvent, appointment: Appointment) => void;
    handleDelete: (id: number) => void;
}

const AppointmentsTable = ({ appointments, setSelectedAppointment, setShowViewModal, handleEdit, handleDelete }: AppointmentsTableProps) => {
    return (
        <table className="appointments-table">
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Appointment Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {appointments.map((appointment) => (
                    <tr
                        key={appointment.id}
                        onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowViewModal(true);
                        }}
                        className="table-row"
                    >
                        <td className="name-column">{appointment.customerName}</td>
                        <td className="time-column">{formatDateTime(appointment.appointmentTime.toString())}</td>
                        <td onClick={e => e.stopPropagation()} className="actions-cell">
                            {appointment.isOwner && (
                                <div className="action-buttons">
                                    <button className="edit-btn" onClick={(e) => handleEdit(e, appointment)}>
                                        Edit
                                    </button>
                                    <button className="delete-btn" onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(appointment.id);
                                    }}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AppointmentsTable;