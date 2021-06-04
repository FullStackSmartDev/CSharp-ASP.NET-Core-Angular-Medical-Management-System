using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class IcdCodeKeywordsView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW IcdCodeKeywordsView AS
                                   SELECT ic.Id AS IcdCodeId, Code AS IcdCodeName, Name AS IcdCodeDescription, string_agg(concat(k.Value, ''), ', ') AS Keywords FROM [IcdCode] AS ic
                                   JOIN [KeywordIcdCode] AS kic ON kic.IcdCodeId = ic.Id
                                   JOIN [Keyword] AS k ON k.Id = kic.KeywordId
                                   group by ic.Id, Code, Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW IcdCodeKeywordsView");
        }
    }
}
