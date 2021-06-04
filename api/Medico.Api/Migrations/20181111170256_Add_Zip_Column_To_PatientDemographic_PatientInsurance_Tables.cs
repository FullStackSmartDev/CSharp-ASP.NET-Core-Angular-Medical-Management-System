using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Zip_Column_To_PatientDemographic_PatientInsurance_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE PatientInsurance 
                                   ADD Zip nvarchar(50) NULL
                                   GO

                                   ALTER TABLE PatientDemographic 
                                   ADD Zip nvarchar(50) NULL
                                   GO

                                   UPDATE PatientInsurance
                                   SET Zip = '(00000)-(00000)'
                                   WHERE Zip IS NULL
                                   GO

                                   UPDATE PatientDemographic
                                   SET Zip = '(00000)-(00000)'
                                   WHERE Zip IS NULL
                                   GO

                                   ALTER TABLE PatientInsurance
                                   ALTER COLUMN Zip nvarchar(50) NOT NULL
                                   GO

                                   ALTER TABLE PatientDemographic
                                   ALTER COLUMN Zip nvarchar(50) NOT NULL;
                                   GO");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE PatientInsurance
                                   DROP COLUMN Zip nvarchar(50)
                                   GO

                                   ALTER TABLE PatientDemographic
                                   DROP COLUMN Zip nvarchar(50)
                                   GO");
        }
    }
}
