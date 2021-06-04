using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Drop_CategoryName_And_SelectableListName_From_CategorySelectableList_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW IF EXISTS CategorySelectableList
                                   GO
                                   CREATE VIEW CategorySelectableList AS
                                   SELECT sl.Id, sl.Title, sl.IsActive, sl.LibrarySelectableListId, sl.CompanyId, sl.IsPredefined, c.Title AS Category FROM SelectableList AS sl
                                   JOIN SelectableListCategory AS c ON c.Id = sl.CategoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
