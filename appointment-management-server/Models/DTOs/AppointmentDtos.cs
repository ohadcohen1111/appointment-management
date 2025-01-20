// Models/DTOs/AppointmentDtos.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppointmentManagement.DTOs
{
    [NotMapped]
    public class AppointmentDto
    {
        [Key]
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime AppointmentTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsOwner { get; set; }
    }

    public class CreateAppointmentDto
    {
        [Required]
        public DateTime AppointmentTime { get; set; }
    }

    public class UpdateAppointmentDto
    {
        [Required]
        public DateTime AppointmentTime { get; set; }
    }
}