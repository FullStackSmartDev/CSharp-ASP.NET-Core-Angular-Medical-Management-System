using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Fulltext_search_index_MedicationName_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF FULLTEXTSERVICEPROPERTY('IsFullTextInstalled') = 1
                                    BEGIN
                                        CREATE FULLTEXT CATALOG MedicationNameCatalog
                                        CREATE FULLTEXT INDEX ON MedicationName
                                        (
                                            Name LANGUAGE 1033
                                        )
                                    KEY INDEX PK_MedicationName ON MedicationNameCatalog WITH CHANGE_TRACKING AUTO
                                    END", true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP FULLTEXT INDEX ON MedicationName
                                   DROP FULLTEXT CATALOG MedicationNameCatalog", true);
        }
    }
}
