using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Patient_History_Data_Structure_Table_Changes_Dose_Column_Null : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Dose",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(int),
                oldMaxLength: 100);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Dose",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(int),
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
