using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Replace_Diagnosis_To_DocumentType_MedicalRecord_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Diagnosis",
                table: "MedicalRecord",
                newName: "DocumentType");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DocumentType",
                table: "MedicalRecord",
                newName: "Diagnosis");
        }
    }
}
