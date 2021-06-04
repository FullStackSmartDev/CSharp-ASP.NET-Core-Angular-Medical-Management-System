using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class TemplateLookupItemCategory_Table_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM TemplateLookupItemCategory WHERE IsDelete = 1");

            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "TemplateLookupItemCategory",
                newName: "IsActive");

            migrationBuilder.Sql(@"UPDATE TemplateLookupItemCategory SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "TemplateLookupItemCategory",
                newName: "IsDelete");

            migrationBuilder.Sql(@"UPDATE TemplateLookupItemCategory SET IsDelete = 0");
        }
    }
}
