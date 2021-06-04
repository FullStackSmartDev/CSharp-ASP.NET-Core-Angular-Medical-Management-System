using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_TemplateExpression_ExpressionReferenceTable_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExpressionReferenceTable",
                columns: table => new
                {
                    ReferenceTableId = table.Column<Guid>(nullable: false),
                    ExpressionId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpressionReferenceTable", x => new { x.ExpressionId, x.ReferenceTableId });
                    table.ForeignKey(
                        name: "FK_ExpressionReferenceTable_Expression_ExpressionId",
                        column: x => x.ExpressionId,
                        principalTable: "Expression",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExpressionReferenceTable_ReferenceTable_ReferenceTableId",
                        column: x => x.ReferenceTableId,
                        principalTable: "ReferenceTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TemplateExpression",
                columns: table => new
                {
                    TemplateId = table.Column<Guid>(nullable: false),
                    ExpressionId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateExpression", x => new { x.TemplateId, x.ExpressionId });
                    table.ForeignKey(
                        name: "FK_TemplateExpression_Expression_ExpressionId",
                        column: x => x.ExpressionId,
                        principalTable: "Expression",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TemplateExpression_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExpressionReferenceTable_ReferenceTableId",
                table: "ExpressionReferenceTable",
                column: "ReferenceTableId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplateExpression_ExpressionId",
                table: "TemplateExpression",
                column: "ExpressionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExpressionReferenceTable");

            migrationBuilder.DropTable(
                name: "TemplateExpression");
        }
    }
}
