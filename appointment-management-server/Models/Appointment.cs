namespace AppointmentManagement.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime AppointmentTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}