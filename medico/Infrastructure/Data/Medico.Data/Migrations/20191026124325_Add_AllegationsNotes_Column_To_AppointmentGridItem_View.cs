using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_AllegationsNotes_Column_To_AppointmentGridItem_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW AppointmentGridItem");

            migrationBuilder.Sql(@"CREATE VIEW AppointmentGridItem AS
                                   SELECT a.Id, a.CompanyId, a.Allegations, a.AllegationsNotes, a.StartDate, a.EndDate, a.AppointmentStatus, l.Name AS LocationName, l.Id AS LocationId, r.Id AS RoomId, r.Name AS RoomName, p.Id AS PatientId, p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.DateOfBirth AS PatientDateOfBirth, d.Id AS PhysicianId, d.FirstName AS PhysicianFirstName, d.LastName AS PhysicianLastName, n.Id AS NurseId, n.FirstName AS NurseFirstName, n.LastName AS NurseLastName FROM Appointment AS a 
                                   JOIN Location AS l ON l.Id = a.LocationId 
                                   JOIN Patient AS p ON p.Id = a.PatientId 
                                   JOIN MedicoApplicationUser AS d ON d.Id = a.PhysicianId
                                   JOIN MedicoApplicationUser AS n ON n.Id = a.NurseId 
                                   JOIN Room AS r on r.Id = a.RoomId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW AppointmentGridItem");

            migrationBuilder.Sql(@"CREATE VIEW AppointmentGridItem AS
                                   SELECT a.Id, a.CompanyId, a.Allegations, a.StartDate, a.EndDate, a.AppointmentStatus, l.Name AS LocationName, l.Id AS LocationId, r.Id AS RoomId, r.Name AS RoomName, p.Id AS PatientId, p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.DateOfBirth AS PatientDateOfBirth, d.Id AS PhysicianId, d.FirstName AS PhysicianFirstName, d.LastName AS PhysicianLastName, n.Id AS NurseId, n.FirstName AS NurseFirstName, n.LastName AS NurseLastName FROM Appointment AS a 
                                   JOIN Location AS l ON l.Id = a.LocationId 
                                   JOIN Patient AS p ON p.Id = a.PatientId 
                                   JOIN MedicoApplicationUser AS d ON d.Id = a.PhysicianId
                                   JOIN MedicoApplicationUser AS n ON n.Id = a.NurseId 
                                   JOIN Room AS r on r.Id = a.RoomId");
        }
    }
}
