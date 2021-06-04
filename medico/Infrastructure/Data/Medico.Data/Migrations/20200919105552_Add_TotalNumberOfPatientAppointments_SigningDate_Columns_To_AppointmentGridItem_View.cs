using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_TotalNumberOfPatientAppointments_SigningDate_Columns_To_AppointmentGridItem_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW AppointmentGridItem");

            migrationBuilder.Sql(@"CREATE VIEW AppointmentGridItem AS
                                    SELECT 
										(SELECT TOP 1 SortedAppointments.StartDate
											FROM (SELECT TOP 2147483647 Appointment.StartDate, Appointment.PatientId
												  FROM Appointment  ORDER BY Appointment.StartDate DESC) AS SortedAppointments
												  WHERE SortedAppointments.StartDate < a.StartDate AND SortedAppointments.PatientId = p.Id) AS PreviousAppointmentDate,
									si.SignDate AS SigningDate,
									PatientAppointments.TotalNumberOfPatientAppointments,
									a.PatientChartDocumentId,
									a.AdmissionId, 
									a.Id, 
									DATEADD(dd, DATEDIFF(dd, 0, StartDate), 0) Date,
									a.CompanyId, 
									a.Allegations,
									a.AllegationsNotes,
									a.StartDate,
									a.EndDate,
									a.AppointmentStatus,
									l.Name AS LocationName,
									l.Id AS LocationId,
									r.Id AS RoomId,
									r.Name AS RoomName,
									p.Id AS PatientId,
									p.FirstName AS PatientFirstName,
									p.LastName AS PatientLastName,
									p.DateOfBirth AS PatientDateOfBirth,
									d.Id AS PhysicianId, 
									d.FirstName AS PhysicianFirstName,
									d.LastName AS PhysicianLastName, 
									n.Id AS NurseId,
									n.FirstName AS NurseFirstName,
									n.LastName AS NurseLastName FROM Appointment AS a
									JOIN Location AS l ON l.Id = a.LocationId 
									JOIN Patient AS p ON p.Id = a.PatientId 
									JOIN MedicoApplicationUser AS d ON d.Id = a.PhysicianId
									JOIN MedicoApplicationUser AS n ON n.Id = a.NurseId 
									JOIN Room AS r on r.Id = a.RoomId
									JOIN (SELECT PatientId, COUNT(PatientId) AS TotalNumberOfPatientAppointments 
											FROM Appointment 
											GROUP BY PatientId) AS PatientAppointments ON a.PatientId = PatientAppointments.PatientId
									LEFT JOIN SignatureInfo AS si ON si.AdmissionId = a.AdmissionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW AppointmentGridItem");

            migrationBuilder.Sql(@"CREATE VIEW AppointmentGridItem AS
                                   SELECT a.PatientChartDocumentId, a.AdmissionId, a.Id, DATEADD(dd, DATEDIFF(dd, 0, StartDate), 0) Date, a.CompanyId, a.Allegations, a.AllegationsNotes, a.StartDate, a.EndDate, a.AppointmentStatus, l.Name AS LocationName, l.Id AS LocationId, r.Id AS RoomId, r.Name AS RoomName, p.Id AS PatientId, p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.DateOfBirth AS PatientDateOfBirth, d.Id AS PhysicianId, d.FirstName AS PhysicianFirstName, d.LastName AS PhysicianLastName, n.Id AS NurseId, n.FirstName AS NurseFirstName, n.LastName AS NurseLastName FROM Appointment AS a 
                                   JOIN Location AS l ON l.Id = a.LocationId 
                                   JOIN Patient AS p ON p.Id = a.PatientId 
                                   JOIN MedicoApplicationUser AS d ON d.Id = a.PhysicianId
                                   JOIN MedicoApplicationUser AS n ON n.Id = a.NurseId 
                                   JOIN Room AS r on r.Id = a.RoomId");
        }
    }
}
