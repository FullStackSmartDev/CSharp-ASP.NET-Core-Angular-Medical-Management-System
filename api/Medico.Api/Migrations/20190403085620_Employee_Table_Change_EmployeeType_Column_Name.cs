using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Employee_Table_Change_EmployeeType_Column_Name : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmployeeType",
                table: "Employee",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"UPDATE Employee 
                                   SET Employee.EmployeeType = ne.ExmployeeType 
                                   FROM Employee as ne");

            migrationBuilder.DropColumn(
                name: "ExmployeeType",
                table: "Employee");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExmployeeType",
                table: "Employee",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"UPDATE Employee
                                   SET Employee.ExmployeeType = ne.EmployeeType 
                                   FROM Employee as ne");

            migrationBuilder.DropColumn(
                name: "EmployeeType",
                table: "Employee");
        }
    }
}
