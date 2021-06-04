using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Change_Names_Add_Titles_To_TemplateLookupItem_TemplateLookupItemCategory_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE TemplateLookupItemCategory SET Name='reviewOfSystems', Title='Review Of Systems' WHERE Name='ReviewOfSystems';
                                   UPDATE TemplateLookupItemCategory SET Name='social', Title='Social' WHERE Name='Social';
                                   UPDATE TemplateLookupItemCategory SET Name='medication', Title='Medication' WHERE Name='Medication';
                                   UPDATE TemplateLookupItemCategory SET Name='documentation', Title='Documentation' WHERE Name='Documentation';
                                   UPDATE TemplateLookupItemCategory SET Name='physicalExam', Title='Physical Exam' WHERE Name='PhysicalExam';");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE TemplateLookupItemCategory SET Name='ReviewOfSystems', Title=null WHERE Name='ReviewOfSystems';
                                   UPDATE TemplateLookupItemCategory SET Name='Social', Title=null WHERE Name='Social';
                                   UPDATE TemplateLookupItemCategory SET Name='Medication', Title=null WHERE Name='Medication';
                                   UPDATE TemplateLookupItemCategory SET Name='Documentation', Title=null WHERE Name='Documentation';
                                   UPDATE TemplateLookupItemCategory SET Name='PhysicalExam', Title=null WHERE Name='PhysicalExam';");
        }
    }
}
