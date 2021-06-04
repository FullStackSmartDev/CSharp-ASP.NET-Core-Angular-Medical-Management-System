using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class TemplateLookupItemTrackerTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TemplateLookupItemTracker",
                columns: table => new
                {
                    TemplateId = table.Column<Guid>(nullable: false),
                    TemplateLookupItemId = table.Column<Guid>(nullable: false),
                    NumberOfLookupItemsInTemplate = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateLookupItemTracker", x => new { x.TemplateId, x.TemplateLookupItemId });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TemplateLookupItemTracker");
        }
    }
}
