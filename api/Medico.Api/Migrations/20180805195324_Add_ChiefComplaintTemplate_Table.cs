using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_ChiefComplaintTemplate_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChiefComplaintTemplate",
                columns: table => new
                {
                    ChiefComplaintId = table.Column<Guid>(nullable: false),
                    TemplateId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiefComplaintTemplate", x => new { x.ChiefComplaintId, x.TemplateId });
                    table.ForeignKey(
                        name: "FK_ChiefComplaintTemplate_ChiefComplaint_ChiefComplaintId",
                        column: x => x.ChiefComplaintId,
                        principalTable: "ChiefComplaint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiefComplaintTemplate_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiefComplaintTemplate");
        }
    }
}
