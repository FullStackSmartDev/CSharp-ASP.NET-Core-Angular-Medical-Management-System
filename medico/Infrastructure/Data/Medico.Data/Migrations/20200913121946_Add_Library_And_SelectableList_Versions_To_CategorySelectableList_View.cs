using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_Library_And_SelectableList_Versions_To_CategorySelectableList_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW IF EXISTS CategorySelectableList
                                   GO
                                   CREATE VIEW CategorySelectableList AS
                                   SELECT sl.Id, sl.Title, sl.IsActive, sl.LibrarySelectableListId, sl.CompanyId, sl.IsPredefined, sl.Version, lsl.Version AS LibrarySelectableListVersion, c.Title AS Category FROM SelectableList AS sl
                                   JOIN SelectableListCategory AS c ON c.Id = sl.CategoryId
                                   LEFT JOIN SelectableList AS lsl ON lsl.Id = sl.LibrarySelectableListId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
