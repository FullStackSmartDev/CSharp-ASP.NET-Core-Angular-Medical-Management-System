using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Update_Patient_Demographic_Address_Fields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"update PatientDemographic
                                    set 
                                        PatientDemographic.Email = CONCAT(p.FirstName, '@mail.com'),
                                        PatientDemographic.PrimaryAddress = CONCAT(p.FirstName, ' primary address'),
                                        PatientDemographic.City = CONCAT(p.FirstName, ' city'),
                                        PatientDemographic.State = 3, -- Arizona
                                        PatientDemographic.PrimaryPhone = '(111) 111-1111'
                                   from PatientDemographic as p");
        }
    }
}
