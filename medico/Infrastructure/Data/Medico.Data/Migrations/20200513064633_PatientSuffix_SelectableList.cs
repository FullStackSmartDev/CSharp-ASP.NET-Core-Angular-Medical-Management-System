using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class PatientSuffix_SelectableList : Migration
    {
        private const string LibrarySelectableListId = "bfd97704-472f-4ecd-9f8d-53ee1c4125e1";
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            const string libraryCategoryId = "bb8ea100-080b-4a60-93e2-986548d51c75";
            const string jsonValues =
                "[{\"id\":\"eab9388a-6ca3-76db-a625-2e0ba82282ae\",\"value\":\"None\",\"description\":\"None\",\"isDefault\":true},{\"id\":\"3ffc5fd2-396d-ef86-81c8-8bbbbdbcb9b3\",\"value\":\"Sr\",\"description\":\"Sr\"},{\"id\":\"52d219f6-6bb2-e5af-b2ef-d575bbcf3b97\",\"value\":\"Jr\",\"description\":\"Jr\"},{\"id\":\"2d57d6b5-4953-6297-68b7-451f85ad7409\",\"value\":\"II\",\"description\":\"II\"},{\"id\":\"7ab89a90-de66-3c64-840b-a8738bddac13\",\"value\":\"III\",\"description\":\"III\"}]";
            const string title = "Patient Suffix";
            const int version = 1;

            migrationBuilder.InsertData(
                table: "SelectableList",
                columns: new[]
                {
                    "Id", "CategoryId", "CompanyId", "IsActive", "IsPredefined", "JsonValues",
                    "LibrarySelectableListId", "Title", "Version"
                },
                values: new object[]
                {
                    new Guid(LibrarySelectableListId), new Guid(libraryCategoryId), null, true, true, jsonValues, null,
                    title, version
                });

            migrationBuilder.Sql($@"
                DECLARE @Id UNIQUEIDENTIFIER = '{LibrarySelectableListId}'
                DECLARE @JsonValues NVARCHAR(MAX) = '{jsonValues}'
                DECLARE @LibraryCategoryId UNIQUEIDENTIFIER = '{libraryCategoryId}'
                DECLARE @Title NVARCHAR(2000) = '{title}'
                DECLARE @Version INT = {version}

                INSERT INTO SelectableList(Id, IsPredefined, LibrarySelectableListId, Version, CompanyId, JsonValues, CategoryId, Title, IsActive)
                SELECT NEWID(), 1, @Id, @Version, c.Id, @JsonValues, (SELECT TOP 1 Id FROM SelectableListCategory where CompanyId = c.id AND LibrarySelectableListCategoryId = @LibraryCategoryId), @Title, @Version
                FROM Company AS c
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($@"
                DELETE FROM SelectableList WHERE LibrarySelectableListId = '{LibrarySelectableListId}'
            ");
            
            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("bfd97704-472f-4ecd-9f8d-53ee1c4125e1"));
        }
    }
}