using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class EntityExtraFieldMap_and_ExtraField_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "Employee",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EntityExtraFieldMap",
                columns: table => new
                {
                    EntityId = table.Column<Guid>(nullable: false),
                    ExtraFieldId = table.Column<Guid>(nullable: false),
                    Value = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntityExtraFieldMap", x => new { x.EntityId, x.ExtraFieldId });
                });

            migrationBuilder.CreateTable(
                name: "ExtraField",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    RelatedEntityName = table.Column<string>(maxLength: 200, nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 200, nullable: false),
                    Title = table.Column<string>(maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExtraField", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employee_LocationId",
                table: "Employee",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_Location_LocationId",
                table: "Employee",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employee_Location_LocationId",
                table: "Employee");

            migrationBuilder.DropTable(
                name: "EntityExtraFieldMap");

            migrationBuilder.DropTable(
                name: "ExtraField");

            migrationBuilder.DropIndex(
                name: "IX_Employee_LocationId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Employee");
        }
    }
}
