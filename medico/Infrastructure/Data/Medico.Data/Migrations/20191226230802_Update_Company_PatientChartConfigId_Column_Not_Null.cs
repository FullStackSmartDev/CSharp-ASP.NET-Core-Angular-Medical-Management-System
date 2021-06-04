using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Update_Company_PatientChartConfigId_Column_Not_Null : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE Company
                                   ALTER COLUMN PatientChartConfigId UNIQUEIDENTIFIER NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE Company
                                   ALTER COLUMN PatientChartConfigId UNIQUEIDENTIFIER NULL");
        }
    }
}
