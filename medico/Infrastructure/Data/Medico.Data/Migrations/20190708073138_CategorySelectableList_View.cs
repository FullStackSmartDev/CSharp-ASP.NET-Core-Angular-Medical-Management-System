using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class CategorySelectableList_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder
                .Sql(@"CREATE VIEW CategorySelectableList AS
                       SELECT sl.Id, sl.Title, sl.IsActive, sl.Name AS SelectableListName, c.Name AS CategoryName, sl.CompanyId, c.Title AS Category FROM SelectableList AS sl
                       JOIN SelectableListCategory AS c ON c.Id = sl.CategoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW CategorySelectableList");
        }
    }
}
