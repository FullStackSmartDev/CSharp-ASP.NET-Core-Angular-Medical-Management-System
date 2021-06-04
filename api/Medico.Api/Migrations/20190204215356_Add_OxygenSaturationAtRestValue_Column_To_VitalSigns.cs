using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_OxygenSaturationAtRestValue_Column_To_VitalSigns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "OxygenSaturationAtRestValue",
                table: "VitalSigns",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OxygenSaturationAtRestValue",
                table: "VitalSigns");
        }
    }
}
