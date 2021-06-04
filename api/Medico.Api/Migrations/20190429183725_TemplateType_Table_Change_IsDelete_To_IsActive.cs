using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class TemplateType_Table_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM TemplateType WHERE IsDelete = 1");

            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "TemplateType",
                newName: "IsActive");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "TemplateType",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.Sql(@"UPDATE TemplateType SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "TemplateType",
                newName: "IsDelete");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "TemplateType",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.Sql(@"UPDATE TemplateType SET IsDelete = 0");
        }
    }
}
