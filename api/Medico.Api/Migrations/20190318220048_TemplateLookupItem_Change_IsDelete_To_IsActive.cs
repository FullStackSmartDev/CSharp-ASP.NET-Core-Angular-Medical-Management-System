using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class TemplateLookupItem_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM TemplateLookupItem WHERE IsDelete = 1");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "TemplateLookupItem");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "TemplateLookupItem", 
                nullable: false,
                defaultValue: true);

            migrationBuilder.Sql(@"UPDATE TemplateLookupItem SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "TemplateLookupItem");

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "TemplateLookupItem",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql(@"UPDATE TemplateLookupItem SET IsDelete = 0");
        }
    }
}
