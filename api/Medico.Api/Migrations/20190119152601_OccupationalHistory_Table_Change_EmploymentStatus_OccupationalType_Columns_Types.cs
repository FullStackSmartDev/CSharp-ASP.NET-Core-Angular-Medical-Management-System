using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class OccupationalHistory_Table_Change_EmploymentStatus_OccupationalType_Columns_Types : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "OccupationalType",
                table: "OccupationalHistory",
                maxLength: 400,
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "EmploymentStatus",
                table: "OccupationalHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "OccupationalType",
                table: "OccupationalHistory",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 400);

            migrationBuilder.AlterColumn<int>(
                name: "EmploymentStatus",
                table: "OccupationalHistory",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 200);
        }
    }
}
