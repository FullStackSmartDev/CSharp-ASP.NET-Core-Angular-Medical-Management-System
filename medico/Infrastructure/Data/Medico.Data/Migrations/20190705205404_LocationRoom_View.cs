using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class LocationRoom_View : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder
                .Sql(@"CREATE VIEW LocationRoom AS
                       SELECT r.Id, r.IsActive, r.Name, l.Name AS Location FROM Room AS r
                       JOIN Location AS l ON l.Id = r.LocationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW LocationRoom");
        }
    }
}
