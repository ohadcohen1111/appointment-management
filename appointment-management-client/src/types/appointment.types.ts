export interface Appointment {
    id: number;
    customerName: string;
    appointmentTime: Date;
    createdAt: Date;
    isOwner: boolean;
  }
  
  export interface CreateAppointmentDto {
    appointmentTime: Date;
  }
  
  export interface UpdateAppointmentDto {
    appointmentTime: Date;
  }
  
  export interface GetAppointmentsParams {
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
  }