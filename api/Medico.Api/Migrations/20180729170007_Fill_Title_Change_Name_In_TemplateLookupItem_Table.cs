using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Fill_Title_Change_Name_In_TemplateLookupItem_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@" DROP FUNCTION IF EXISTS Split_On_Upper_Case 
                                    GO
                                    Create Function Split_On_Upper_Case(@Temp VarChar(1000))
                                    Returns VarChar(1000)
                                    AS
                                        Begin
                                            Declare @KeepValues as varchar(50)
                                            Set @KeepValues = '%[^ ][A-Z]%'
                                            While PatIndex(@KeepValues collate Latin1_General_Bin, @Temp) > 0
                                            Set @Temp = Stuff(@Temp, PatIndex(@KeepValues collate Latin1_General_Bin, @Temp) + 1, 0, ' ')
                                            Return @Temp
                                        End
                                    GO
                                    UPDATE TemplateLookupItem
                                    SET
                                        Title = dbo.Split_On_Upper_Case(Name),
                                        Name = STUFF(Name,1,1,LOWER(LEFT(Name,1)))
                                        FROM TemplateLookupItem
                                    GO");
        }

        protected override void Down(MigrationBuilder migrationBuilder){ }
    }
}
