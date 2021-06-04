using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_Column_ZipCodeType_To_Patient_PatientInsurance_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ZipCodeType",
                table: "PatientInsurance",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.Sql("UPDATE PatientInsurance SET ZipCodeType = 2");

            migrationBuilder.AddColumn<int>(
                name: "ZipCodeType",
                table: "Patient",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.Sql("UPDATE Patient SET ZipCodeType = 2");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ZipCodeType",
                table: "PatientInsurance");

            migrationBuilder.DropColumn(
                name: "ZipCodeType",
                table: "Patient");
        }
    }
}
