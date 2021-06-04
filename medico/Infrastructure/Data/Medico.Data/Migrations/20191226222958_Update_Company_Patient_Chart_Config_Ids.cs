using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Update_Company_Patient_Chart_Config_Ids : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE Company 
                                   SET PatientChartConfigId = pcc.Id
                                   FROM Company AS c JOIN PatientChartConfig AS pcc ON pcc.CompanyId = c.Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE Company
                                   SET PatientChartConfigId = null");
        }
    }
}
