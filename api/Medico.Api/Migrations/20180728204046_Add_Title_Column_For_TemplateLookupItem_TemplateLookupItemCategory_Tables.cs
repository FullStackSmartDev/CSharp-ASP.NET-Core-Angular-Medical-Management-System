using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Title_Column_For_TemplateLookupItem_TemplateLookupItemCategory_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "TemplateLookupItemCategory",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "TemplateLookupItem",
                maxLength: 200,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "TemplateLookupItemCategory");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "TemplateLookupItem");
        }
    }
}
