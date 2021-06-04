using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicoApplicationUserView_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW MedicoApplicationUserView AS
                SELECT aspr.Id as Role, aspr.Name as RoleName, mu.Id, mu.IsActive, mu.CompanyId, mu.FirstName, mu.NamePrefix, mu.NameSuffix, mu.MiddleName, mu.LastName, mu.Email, mu.Address, mu.SecondaryAddress, mu.City, mu.State, mu.Zip, mu.PrimaryPhone, mu.SecondaryPhone, mu.EmployeeType, mu.Ssn, mu.Gender, mu.DateOfBirth FROM MedicoApplicationUser AS mu
                JOIN AspNetUsers AS aspu ON aspu.Email = mu.Email
                JOIN AspNetUserRoles aspur ON aspur.UserId = aspu.Id
                JOIN AspNetRoles AS aspr ON aspr.Id = aspur.RoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW MedicoApplicationUserView");
        }
    }
}
