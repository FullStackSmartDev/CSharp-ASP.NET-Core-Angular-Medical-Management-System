using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Alter_Table_Template_Add_Column_TemplateOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TemplateOrder",
                table: "Template",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TemplateOrder",
                table: "Template");
        }
    }
}
