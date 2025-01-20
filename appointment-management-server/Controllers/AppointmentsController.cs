using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AppointmentManagement.Data;
using AppointmentManagement.DTOs;
using AppointmentManagement.Models;
using System.Data;
using Microsoft.Data.SqlClient;
namespace AppointmentManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(AppDbContext context, ILogger<AppointmentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? searchTerm)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

                var query = _context.Appointments
                    .Include(a => a.User)
                    .AsQueryable();

                if (startDate.HasValue)
                    query = query.Where(a => a.AppointmentTime >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(a => a.AppointmentTime <= endDate.Value);

                if (!string.IsNullOrWhiteSpace(searchTerm))
                    query = query.Where(a => a.User != null && a.User.FirstName.Contains(searchTerm));

                var appointments = await query
                    .Select(a => new AppointmentDto
                    {
                        Id = a.Id,
                        CustomerName = a.User != null ? a.User.FirstName : "Unknown",
                        AppointmentTime = a.AppointmentTime,
                        CreatedAt = a.CreatedAt,
                        IsOwner = a.UserId == userId
                    })
                    .OrderBy(a => a.AppointmentTime)
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointments");
                return StatusCode(500, "Error retrieving appointments");
            }
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto createDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

                var appointment = new Appointment
                {
                    UserId = userId,
                    AppointmentTime = createDto.AppointmentTime,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                var user = await _context.Users.FindAsync(userId);

                return Ok(new AppointmentDto
                {
                    Id = appointment.Id,
                    CustomerName = user?.FirstName ?? "",
                    AppointmentTime = appointment.AppointmentTime,
                    CreatedAt = appointment.CreatedAt,
                    IsOwner = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                return StatusCode(500, "Error creating appointment");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, UpdateAppointmentDto updateDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var appointment = await _context.Appointments.FindAsync(id);

                if (appointment == null)
                    return NotFound();

                if (appointment.UserId != userId)
                    return Forbid();

                appointment.AppointmentTime = updateDto.AppointmentTime;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment {AppointmentId}", id);
                return StatusCode(500, "Error updating appointment");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

                var successParameter = new SqlParameter
                {
                    ParameterName = "@Success",
                    SqlDbType = SqlDbType.Bit,
                    Direction = ParameterDirection.Output
                };

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC DeleteAppointment @AppointmentId, @UserId, @Success OUT",
                    new SqlParameter("@AppointmentId", id),
                    new SqlParameter("@UserId", userId),
                    successParameter);

                if (!(bool)successParameter.Value)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment {AppointmentId}", id);
                return StatusCode(500, "Error deleting appointment");
            }
        }
    }
}