using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_CreateDate_Column_To_VisionVitalSigns_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreateDate",
                table: "VisionVitalSigns",
                nullable: false,
                defaultValue: new DateTime(2019, 11, 2, 15, 51, 31, 443, DateTimeKind.Utc).AddTicks(3883));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "VisionVitalSigns");
        }
    }
}
