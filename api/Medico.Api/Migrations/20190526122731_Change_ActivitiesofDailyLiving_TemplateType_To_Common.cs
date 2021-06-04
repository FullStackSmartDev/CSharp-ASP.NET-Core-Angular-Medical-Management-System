using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Change_ActivitiesofDailyLiving_TemplateType_To_Common : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                        UPDATE Template
                        SET TemplateTypeId = 'F286A05D-E8F7-42EE-8DBA-602C7A0990F1'
                        WHERE Id = 'BA70F59D-B7B3-FB37-64EE-2E8F03819B32'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                        UPDATE Template
                        SET TemplateTypeId = 'F286A05D-E8F7-42EE-8DBA-602C7A0990F1'
                        WHERE Id = '6C8BF707-35C4-4FEE-ABCA-76DE9AEE8C5E'");
        }
    }
}
