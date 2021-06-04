using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Ssn_MaritalStatus_Columns_PatientDemographic_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaritalStatus",
                table: "PatientDemographic",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Ssn",
                table: "PatientDemographic",
                maxLength: 100,
                nullable: false,
                defaultValue: "000-00-0000");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaritalStatus",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "Ssn",
                table: "PatientDemographic");
        }
    }
}
