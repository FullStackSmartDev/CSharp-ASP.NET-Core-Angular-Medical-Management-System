using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_DetailedTemplateHtml_DefaultTemplateHtml_Columns_To_Template_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultTemplateHtml",
                table: "Template",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DetailedTemplateHtml",
                table: "Template",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultTemplateHtml",
                table: "Template");

            migrationBuilder.DropColumn(
                name: "DetailedTemplateHtml",
                table: "Template");
        }
    }
}
