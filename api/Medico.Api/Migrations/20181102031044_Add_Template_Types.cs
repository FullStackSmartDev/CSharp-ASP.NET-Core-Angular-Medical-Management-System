using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Template_Types : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.Sql(@"INSERT INTO TemplateType (Id, Title, Name)
                                   VALUES ('99120823-5cfe-ebbb-2eee-0236c94c20bc', 'Procedure', 'procedure'), ('41cad8e2-4a71-9684-232b-99d3f178ca98', 'Plan', 'plan')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM TemplateType WHERE Id IN ('99120823-5cfe-ebbb-2eee-0236c94c20bc', '41cad8e2-4a71-9684-232b-99d3f178ca98')");
        }
    }
}
