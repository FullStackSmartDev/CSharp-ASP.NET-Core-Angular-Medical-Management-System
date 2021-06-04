using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Fill_TemplateType_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"INSERT INTO TemplateType (Id, Title, Name)
                                   VALUES ('ae28dec4-856f-4a27-87c6-7c76dced86a6', 'ROS', 'ros'), ('6c8bf707-35c4-4fee-abca-76de9aee8c5e', 'Physical Exam', 'physicalExam'), ('feaa07cc-3ca9-45c0-bd9e-bae00508e5e7','HPI', 'hpi')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM TemplateType");
        }
    }
}
