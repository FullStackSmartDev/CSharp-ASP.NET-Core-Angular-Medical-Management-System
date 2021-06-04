using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_ReportTitle_Column_To_Template_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReportTitle",
                table: "Template",
                maxLength: 2000,
                defaultValue: "");

            //update Report Title with Template Name values
            migrationBuilder.Sql(@"
                UPDATE Template
                SET Template.ReportTitle = TemplateCopy.Title
                FROM Template AS TemplateCopy");

            //make Report Title as a required column
            migrationBuilder.Sql(@"ALTER TABLE Template ALTER COLUMN ReportTitle NVARCHAR(2000) NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReportTitle",
                table: "Template");
        }
    }
}
