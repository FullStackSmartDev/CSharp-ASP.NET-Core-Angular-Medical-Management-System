using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class SelectableList_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SelectableList",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    JsonValues = table.Column<string>(nullable: false),
                    CategoryId = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(maxLength: 2000, nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelectableList", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SelectableList_SelectableListCategory_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "SelectableListCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SelectableList_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SelectableList_CategoryId",
                table: "SelectableList",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SelectableList_CompanyId",
                table: "SelectableList",
                column: "CompanyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelectableList");
        }
    }
}
