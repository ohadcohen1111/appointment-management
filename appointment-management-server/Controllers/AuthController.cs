using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentManagement.Data;
using AppointmentManagement.DTOs;
using AppointmentManagement.Models;
using AppointmentManagement.Services;

namespace AppointmentManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly PasswordService _passwordService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            AppDbContext context,
            TokenService tokenService,
            PasswordService passwordService,
            ILogger<AuthController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordService = passwordService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            _logger.LogInformation("Received registration request for username: {Username}", registerDto.Username);

            if (string.IsNullOrWhiteSpace(registerDto.Username) ||
                string.IsNullOrWhiteSpace(registerDto.Password) ||
                string.IsNullOrWhiteSpace(registerDto.FirstName))
            {
                _logger.LogWarning("Invalid registration data: Missing required fields");
                return BadRequest("All fields are required");
            }

            if (await _context.Users.AnyAsync(x => x.Username == registerDto.Username))
            {
                _logger.LogWarning("Registration failed: Username {Username} already exists", registerDto.Username);
                return BadRequest("Username is already taken");
            }

            var user = new User
            {
                Username = registerDto.Username,
                FirstName = registerDto.FirstName,
                PasswordHash = _passwordService.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {Username} registered successfully", user.Username);
            return StatusCode(201, new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            _logger.LogInformation("Received login request for username: {Username}", loginDto.Username);

            var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == loginDto.Username);

            if (user == null || !_passwordService.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Login failed for username: {Username}", loginDto.Username);
                return Unauthorized("Invalid credentials");
            }

            var token = _tokenService.CreateToken(user);
            _logger.LogInformation("User {Username} logged in successfully", user.Username);

            return Ok(new LoginResponseDto { Token = token });
        }
    }
}