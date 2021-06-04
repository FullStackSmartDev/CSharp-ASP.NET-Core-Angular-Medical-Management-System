using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_InitialDetailedTemplateHtml_Column_To_Template_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "DetailedTemplateHtml",
                table: "Template",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InitialDetailedTemplateHtml",
                table: "Template",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InitialDetailedTemplateHtml",
                table: "Template");

            migrationBuilder.AlterColumn<string>(
                name: "DetailedTemplateHtml",
                table: "Template",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
