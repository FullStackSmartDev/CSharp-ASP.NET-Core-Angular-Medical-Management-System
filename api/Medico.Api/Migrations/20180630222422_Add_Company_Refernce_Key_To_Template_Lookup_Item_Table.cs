using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Company_Refernce_Key_To_Template_Lookup_Item_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "TemplateLookupItem",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "TemplateLookupItem",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_TemplateLookupItem_CompanyId",
                table: "TemplateLookupItem",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_TemplateLookupItem_Company_CompanyId",
                table: "TemplateLookupItem",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TemplateLookupItem_Company_CompanyId",
                table: "TemplateLookupItem");

            migrationBuilder.DropIndex(
                name: "IX_TemplateLookupItem_CompanyId",
                table: "TemplateLookupItem");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "TemplateLookupItem");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "TemplateLookupItem");
        }
    }
}
