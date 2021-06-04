using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class SelectableListTrackItem_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SelectableListTrackItem",
                columns: table => new
                {
                    TemplateId = table.Column<Guid>(nullable: false),
                    SelectableListId = table.Column<Guid>(nullable: false),
                    NumberOfSelectableListsInTemplate = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelectableListTrackItem", x => new { x.TemplateId, x.SelectableListId });
                    table.ForeignKey(
                        name: "FK_SelectableListTrackItem_SelectableList_SelectableListId",
                        column: x => x.SelectableListId,
                        principalTable: "SelectableList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SelectableListTrackItem_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SelectableListTrackItem_SelectableListId",
                table: "SelectableListTrackItem",
                column: "SelectableListId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelectableListTrackItem");
        }
    }
}
