using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Template_Table_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM Template WHERE IsDelete = 1");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Template");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Template",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql(@"UPDATE Template SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Template");

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Template",
                nullable: true);

            migrationBuilder.Sql(@"UPDATE Template SET IsDelete = 0");
        }
    }
}
