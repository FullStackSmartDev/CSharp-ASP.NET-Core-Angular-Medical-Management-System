using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class ExtraField_Table_IsActive_ShowInList_Columns_Aadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "ExtraField");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ExtraField",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowInList",
                table: "ExtraField",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ExtraField");

            migrationBuilder.DropColumn(
                name: "ShowInList",
                table: "ExtraField");

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "ExtraField",
                nullable: false,
                defaultValue: false);
        }
    }
}
