using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace appointment_management_server.Migrations
{
    /// <inheritdoc />
    public partial class AddDeleteAppointmentProcedure : Migration
    {
        /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"
                CREATE PROCEDURE DeleteAppointment
                    @AppointmentId int,
                    @UserId int,
                    @Success bit OUTPUT
                AS
                BEGIN
                    SET NOCOUNT ON;
                    SET @Success = 0;
                    
                    DECLARE @OwnerId int;
                    SELECT @OwnerId = UserId FROM Appointments WHERE Id = @AppointmentId;
                    
                    IF @OwnerId IS NULL
                        RETURN;
                        
                    IF @OwnerId != @UserId
                        RETURN;
                        
                    DELETE FROM Appointments WHERE Id = @AppointmentId;
                    SET @Success = 1;
                END";
            
            migrationBuilder.Sql(sp);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS DeleteAppointment");
        }
    }
}
