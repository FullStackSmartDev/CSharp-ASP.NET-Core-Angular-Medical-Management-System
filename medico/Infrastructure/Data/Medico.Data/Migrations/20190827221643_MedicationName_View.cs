using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicationName_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW MedicationName AS 
                                    SELECT NEWID() AS Id, NonProprietaryName AS Name FROM Medication
                                    GROUP BY NonProprietaryName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW MedicationName");
        }
    }
}
