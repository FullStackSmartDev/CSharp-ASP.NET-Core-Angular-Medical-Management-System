using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_CaseNumber_RqId_Columns_To_PatientInsurance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RelationshipCode",
                table: "PatientInsurance",
                newName: "RqId");

            migrationBuilder.RenameColumn(
                name: "DependentCode",
                table: "PatientInsurance",
                newName: "CaseNumber");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RqId",
                table: "PatientInsurance",
                newName: "RelationshipCode");

            migrationBuilder.RenameColumn(
                name: "CaseNumber",
                table: "PatientInsurance",
                newName: "DependentCode");
        }
    }
}
