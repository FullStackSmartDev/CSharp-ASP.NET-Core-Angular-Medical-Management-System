using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Patient_History_Data_Structure_Table_Changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyHistory_IcdCode_IcdCodeId",
                table: "FamilyHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistory_IcdCode_IcdCodeId",
                table: "MedicalHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_SurgicalHistory_CptCode_CptCodeId",
                table: "SurgicalHistory");

            migrationBuilder.DropIndex(
                name: "IX_SurgicalHistory_CptCodeId",
                table: "SurgicalHistory");

            migrationBuilder.DropIndex(
                name: "IX_MedicalHistory_IcdCodeId",
                table: "MedicalHistory");

            migrationBuilder.DropIndex(
                name: "IX_FamilyHistory_IcdCodeId",
                table: "FamilyHistory");

            migrationBuilder.DropColumn(
                name: "CptCodeId",
                table: "SurgicalHistory");

            migrationBuilder.DropColumn(
                name: "IcdCodeId",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "IcdCodeId",
                table: "FamilyHistory");

            migrationBuilder.AlterColumn<string>(
                name: "Use",
                table: "TobaccoHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "TobaccoHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusLengthType",
                table: "TobaccoHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "TobaccoHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "TobaccoHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "TobaccoHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "TobaccoHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "SurgicalHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Diagnosis",
                table: "SurgicalHistory",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "WorkersCompensationClaimDetails",
                table: "OccupationalHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OccupationalType",
                table: "OccupationalHistory",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 400);

            migrationBuilder.AlterColumn<string>(
                name: "EmploymentStatus",
                table: "OccupationalHistory",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "DisabilityClaimDetails",
                table: "OccupationalHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "OccupationalHistory",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Units",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Route",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "MedicationStatus",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Medication",
                table: "MedicationHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "DoseSchedule",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "MedicationHistory",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "MedicalHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Diagnosis",
                table: "MedicalHistory",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "FamilyStatus",
                table: "FamilyHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "FamilyMember",
                table: "FamilyHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "Diagnosis",
                table: "FamilyHistory",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "FamilyHistory",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "EducationHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Degree",
                table: "EducationHistory",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "Use",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusLengthType",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Route",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "DrugHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "DrugHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Diagnosis",
                table: "Allergy",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Use",
                table: "AlcoholHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "AlcoholHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusLengthType",
                table: "AlcoholHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "AlcoholHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "AlcoholHistory",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "AlcoholHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "AlcoholHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var cptCodeId = Guid.NewGuid();
            var icdCodeId = Guid.NewGuid();

            migrationBuilder.Sql($@"INSERT INTO CptCode(Id, IsDelete, Code, Name, Description)
                                    VALUES ('{cptCodeId}', 0, 'CptCode', 'CptName', 'CptDescription')");

            migrationBuilder.Sql($@"INSERT INTO IcdCode(Id, IsDelete, Code, Name, Description)
                                    VALUES ('{icdCodeId}', 0, 'CptCode', 'CptName', 'CptDescription')");

            migrationBuilder.DropColumn(
                name: "Diagnosis",
                table: "SurgicalHistory");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "OccupationalHistory");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "MedicationHistory");

            migrationBuilder.DropColumn(
                name: "Diagnosis",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "Diagnosis",
                table: "FamilyHistory");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "FamilyHistory");

            migrationBuilder.DropColumn(
                name: "Diagnosis",
                table: "Allergy");

            migrationBuilder.AlterColumn<string>(
                name: "Use",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusLengthType",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "TobaccoHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "SurgicalHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CptCodeId",
                table: "SurgicalHistory",
                nullable: false,
                defaultValue: cptCodeId);

            migrationBuilder.AlterColumn<string>(
                name: "WorkersCompensationClaimDetails",
                table: "OccupationalHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OccupationalType",
                table: "OccupationalHistory",
                maxLength: 400,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<string>(
                name: "EmploymentStatus",
                table: "OccupationalHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "DisabilityClaimDetails",
                table: "OccupationalHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Units",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Route",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MedicationStatus",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Medication",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DoseSchedule",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "MedicalHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IcdCodeId",
                table: "MedicalHistory",
                nullable: false,
                defaultValue: icdCodeId);

            migrationBuilder.AlterColumn<string>(
                name: "FamilyStatus",
                table: "FamilyHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FamilyMember",
                table: "FamilyHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IcdCodeId",
                table: "FamilyHistory",
                nullable: false,
                defaultValue: icdCodeId);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "EducationHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Degree",
                table: "EducationHistory",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<string>(
                name: "Use",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusLengthType",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Route",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "DrugHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Use",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StatusLengthType",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "AlcoholHistory",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurgicalHistory_CptCodeId",
                table: "SurgicalHistory",
                column: "CptCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalHistory_IcdCodeId",
                table: "MedicalHistory",
                column: "IcdCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyHistory_IcdCodeId",
                table: "FamilyHistory",
                column: "IcdCodeId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_SurgicalHistory_CptCode_CptCodeId",
                table: "SurgicalHistory",
                column: "CptCodeId",
                principalTable: "CptCode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
