using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicationItemInfoView_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW MedicationItemInfoView AS
                                    SELECT MedicationNameId, STRING_AGG(Route, ';') AS Routes,
                                    STRING_AGG(Strength, ';') AS Strength,
                                    STRING_AGG(Unit, ';') AS Units,
                                    STRING_AGG(DosageForm, ';') AS DosageForms FROM MedicationItemInfo
                                    GROUP BY MedicationNameId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW MedicationItemInfoView");
        }
    }
}
