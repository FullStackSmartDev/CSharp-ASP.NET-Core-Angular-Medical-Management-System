using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Fulltext_search_index_IcdCode_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF FULLTEXTSERVICEPROPERTY('IsFullTextInstalled') = 1
                                    BEGIN
                                        CREATE FULLTEXT CATALOG IcdCodeCatalog
                                        CREATE FULLTEXT INDEX ON IcdCode
                                        (
                                            Name LANGUAGE 1033
                                        )
	                                    KEY INDEX PK_IcdCode ON IcdCodeCatalog WITH CHANGE_TRACKING AUTO
                                    END", true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP FULLTEXT INDEX ON IcdCode
                                   DROP FULLTEXT CATALOG IcdCodeCatalog", true);
        }
    }
}
