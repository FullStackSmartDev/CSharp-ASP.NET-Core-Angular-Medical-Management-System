using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Fulltext_search_index_Medication_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF FULLTEXTSERVICEPROPERTY('IsFullTextInstalled') = 1
                                    BEGIN
                                        CREATE FULLTEXT CATALOG MedicationCatalog
                                        CREATE FULLTEXT INDEX ON Medication
                                        (
                                            NonProprietaryName LANGUAGE 1033
                                        )
	                                    KEY INDEX PK_Medication ON MedicationCatalog WITH CHANGE_TRACKING AUTO
                                    END", true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP FULLTEXT INDEX ON Medication
                                   DROP FULLTEXT CATALOG MedicationCatalog", true);
        }
    }
}
