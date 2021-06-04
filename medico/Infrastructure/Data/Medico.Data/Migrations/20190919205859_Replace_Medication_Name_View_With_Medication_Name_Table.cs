using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Replace_Medication_Name_View_With_Medication_Name_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@" DROP VIEW MedicationName
                                    GO

                                    SELECT * INTO MedicationName from (
                                        SELECT NEWID() AS Id, NonProprietaryName AS Name FROM Medication
                                        WHERE NonProprietaryName IS NOT NULL
	                                    GROUP BY NonProprietaryName
                                    ) MedicationNameSource
                                    GO

                                    ALTER TABLE MedicationName ALTER COLUMN Id uniqueidentifier NOT NULL
                                    GO

                                    ALTER TABLE MedicationName ADD CONSTRAINT DF_Id DEFAULT NEWID() FOR Id
                                    GO

                                    ALTER TABLE MedicationName ADD CONSTRAINT PK_MedicationName PRIMARY KEY NONCLUSTERED (Id);
                                    GO");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@" DROP TABLE MedicationName
                                    GO

                                    CREATE VIEW MedicationName AS 
                                        SELECT NEWID() AS Id, NonProprietaryName AS Name FROM Medication
                                        GROUP BY NonProprietaryName
                                    GO");
        }
    }
}
