using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Replace_CptCode_To_IcdCode_For_Medical_Family_History : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyHistory_CptCode_CptCodeId",
                table: "FamilyHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistory_CptCode_CptCodeId",
                table: "MedicalHistory");

            migrationBuilder.RenameColumn(
                name: "CptCodeId",
                table: "MedicalHistory",
                newName: "IcdCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalHistory_CptCodeId",
                table: "MedicalHistory",
                newName: "IX_MedicalHistory_IcdCodeId");

            migrationBuilder.RenameColumn(
                name: "CptCodeId",
                table: "FamilyHistory",
                newName: "IcdCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_FamilyHistory_CptCodeId",
                table: "FamilyHistory",
                newName: "IX_FamilyHistory_IcdCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyHistory_IcdCode_IcdCodeId",
                table: "FamilyHistory",
                column: "IcdCodeId",
                principalTable: "IcdCode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalHistory_IcdCode_IcdCodeId",
                table: "MedicalHistory",
                column: "IcdCodeId",
                principalTable: "IcdCode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyHistory_IcdCode_IcdCodeId",
                table: "FamilyHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistory_IcdCode_IcdCodeId",
                table: "MedicalHistory");

            migrationBuilder.RenameColumn(
                name: "IcdCodeId",
                table: "MedicalHistory",
                newName: "CptCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalHistory_IcdCodeId",
                table: "MedicalHistory",
                newName: "IX_MedicalHistory_CptCodeId");

            migrationBuilder.RenameColumn(
                name: "IcdCodeId",
                table: "FamilyHistory",
                newName: "CptCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_FamilyHistory_IcdCodeId",
                table: "FamilyHistory",
                newName: "IX_FamilyHistory_CptCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyHistory_CptCode_CptCodeId",
                table: "FamilyHistory",
                column: "CptCodeId",
                principalTable: "CptCode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalHistory_CptCode_CptCodeId",
                table: "MedicalHistory",
                column: "CptCodeId",
                principalTable: "CptCode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
