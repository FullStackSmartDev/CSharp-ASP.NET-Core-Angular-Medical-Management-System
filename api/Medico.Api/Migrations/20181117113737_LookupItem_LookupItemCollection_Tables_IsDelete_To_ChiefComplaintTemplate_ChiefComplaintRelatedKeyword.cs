using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class LookupItem_LookupItemCollection_Tables_IsDelete_To_ChiefComplaintTemplate_ChiefComplaintRelatedKeyword : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "ChiefComplaintTemplate",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "ChiefComplaintRelatedKeyword",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "AppUserPermissionGroup",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "ChiefComplaintTemplate");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "ChiefComplaintRelatedKeyword");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "AppUserPermissionGroup");
        }
    }
}
