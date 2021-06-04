using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Data_Update_Script_Table_Template_Adjust_TemplateOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                    DECLARE @Cursor CURSOR;
                    DECLARE @Id uniqueidentifier;
                    BEGIN
                        SET @Cursor = CURSOR FOR
                        SELECT Id FROM TemplateType

                        OPEN @Cursor 
                        FETCH NEXT FROM @Cursor 
                        INTO @Id

                        WHILE @@FETCH_STATUS = 0
                        BEGIN
                            DECLARE @rowNumber INT 
                            SET @rowNumber = 0
                            UPDATE Template
                            SET @rowNumber = TemplateOrder = @rowNumber + 1 
                            WHERE TemplateTypeId = @Id AND IsDelete = 0

                            FETCH NEXT FROM @Cursor 
                            INTO @Id 
                        END

                        CLOSE @Cursor
                        DEALLOCATE @Cursor
                    END ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE Template
                                   SET TemplateOrder = NULL");
        }
    }
}
