import { Appointment } from '../types/appointment.types';
import { format } from 'date-fns';
import './AppointmentModal.css';

interface AppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentModal = ({ appointment, onClose }: AppointmentModalProps) => {
  if (!appointment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Appointment Details</h2>
        <div className="appointment-details">
          <div className="detail-group">
            <label>Customer Name</label>
            <span>{appointment.customerName}</span>
          </div>
          
          <div className="detail-group">
            <label>Appointment Time</label>
            <span>{format(new Date(appointment.appointmentTime), "EEE, MMM d, yyyy 'at' HH:mm")}</span>
          </div>
          
          <div className="detail-group">
            <label>Created At</label>
            <span>{format(new Date(appointment.createdAt), "EEE, MMM d, yyyy 'at' HH:mm")}</span>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};