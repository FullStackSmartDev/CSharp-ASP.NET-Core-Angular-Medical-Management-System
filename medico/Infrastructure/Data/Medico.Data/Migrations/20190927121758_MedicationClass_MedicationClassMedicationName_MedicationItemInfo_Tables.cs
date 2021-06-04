using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicationClass_MedicationClassMedicationName_MedicationItemInfo_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicationClass",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    ClassName = table.Column<string>(maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationClass", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MedicationClassMedicationName",
                columns: table => new
                {
                    MedicationClassId = table.Column<Guid>(nullable: false),
                    MedicationNameId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationClassMedicationName", x => new { x.MedicationClassId, x.MedicationNameId });
                    table.ForeignKey(
                        name: "FK_MedicationClassMedicationName_MedicationClass_MedicationClassId",
                        column: x => x.MedicationClassId,
                        principalTable: "MedicationClass",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationClassMedicationName_MedicationName_MedicationNameId",
                        column: x => x.MedicationNameId,
                        principalTable: "MedicationName",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicationItemInfo",
                columns: table => new
                {
                    MedicationNameId = table.Column<Guid>(nullable: false),
                    Route = table.Column<string>(maxLength: 2000, nullable: false),
                    Strength = table.Column<string>(maxLength: 100, nullable: false),
                    Unit = table.Column<string>(maxLength: 100, nullable: false),
                    DosageForm = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationItemInfo", x => new { x.MedicationNameId, x.DosageForm, x.Route, x.Strength, x.Unit });
                    table.ForeignKey(
                        name: "FK_MedicationItemInfo_MedicationName_MedicationNameId",
                        column: x => x.MedicationNameId,
                        principalTable: "MedicationName",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationClassMedicationName_MedicationNameId",
                table: "MedicationClassMedicationName",
                column: "MedicationNameId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicationClassMedicationName");

            migrationBuilder.DropTable(
                name: "MedicationItemInfo");

            migrationBuilder.DropTable(
                name: "MedicationClass");
        }
    }
}
