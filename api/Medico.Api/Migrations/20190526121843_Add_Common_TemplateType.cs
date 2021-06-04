using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Common_TemplateType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                        INSERT INTO TemplateType(Id, IsActive, CompanyId, Name, Title)
                        VALUES ('f286a05d-e8f7-42ee-8dba-602c7a0990f1', 1, null, 'common', 'Common')");
        }
    }
}
