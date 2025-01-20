namespace AppointmentManagement.DTOs
{
    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class RegisterDto : LoginDto
    {
        public string FirstName { get; set; } = string.Empty;
    }
}