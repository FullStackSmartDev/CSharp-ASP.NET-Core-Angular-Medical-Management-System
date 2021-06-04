using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Patient_PatientInsurance_Appointment_Admission_SignatureInfo_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PatientInsurance",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    CaseNumber = table.Column<string>(maxLength: 100, nullable: true),
                    RqId = table.Column<string>(maxLength: 100, nullable: true),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    Gender = table.Column<int>(nullable: false),
                    DateOfBirth = table.Column<DateTime>(nullable: false),
                    Ssn = table.Column<string>(maxLength: 100, nullable: false),
                    Zip = table.Column<string>(nullable: false),
                    PrimaryAddress = table.Column<string>(maxLength: 2000, nullable: false),
                    SecondaryAddress = table.Column<string>(maxLength: 2000, nullable: true),
                    City = table.Column<string>(maxLength: 100, nullable: false),
                    PrimaryPhone = table.Column<string>(maxLength: 100, nullable: false),
                    SecondaryPhone = table.Column<string>(maxLength: 100, nullable: true),
                    Email = table.Column<string>(maxLength: 100, nullable: false),
                    State = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientInsurance", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(nullable: true),
                    Gender = table.Column<int>(nullable: false),
                    DateOfBirth = table.Column<DateTime>(nullable: false),
                    MaritalStatus = table.Column<int>(nullable: false),
                    Ssn = table.Column<string>(maxLength: 100, nullable: false),
                    PrimaryAddress = table.Column<string>(maxLength: 2000, nullable: false),
                    SecondaryAddress = table.Column<string>(maxLength: 2000, nullable: true),
                    City = table.Column<string>(maxLength: 100, nullable: false),
                    PrimaryPhone = table.Column<string>(maxLength: 100, nullable: false),
                    SecondaryPhone = table.Column<string>(maxLength: 100, nullable: true),
                    Email = table.Column<string>(maxLength: 100, nullable: false),
                    Zip = table.Column<string>(nullable: false),
                    State = table.Column<int>(nullable: false),
                    PatientInsuranceId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patient_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patient_PatientInsurance_PatientInsuranceId",
                        column: x => x.PatientInsuranceId,
                        principalTable: "PatientInsurance",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    LocationId = table.Column<Guid>(nullable: false),
                    PhysicianId = table.Column<Guid>(nullable: false),
                    NurseId = table.Column<Guid>(nullable: false),
                    RoomId = table.Column<Guid>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    AdmissionId = table.Column<Guid>(nullable: true),
                    Allegations = table.Column<string>(maxLength: 2000, nullable: true),
                    AppointmentStatus = table.Column<string>(maxLength: 100, nullable: false),
                    MedicoApplicationUserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointment_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointment_Location_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointment_MedicoApplicationUser_MedicoApplicationUserId",
                        column: x => x.MedicoApplicationUserId,
                        principalTable: "MedicoApplicationUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointment_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointment_Room_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Room",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Admission",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    AppointmentId = table.Column<Guid>(nullable: false),
                    SignatureInfoId = table.Column<Guid>(nullable: true),
                    AdmissionData = table.Column<string>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Admission_Appointment_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Admission_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SignatureInfo",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PhysicianId = table.Column<Guid>(nullable: false),
                    AdmissionId = table.Column<Guid>(nullable: false),
                    SignDate = table.Column<DateTime>(nullable: false),
                    IsUnsigned = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignatureInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SignatureInfo_Admission_AdmissionId",
                        column: x => x.AdmissionId,
                        principalTable: "Admission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SignatureInfo_MedicoApplicationUser_PhysicianId",
                        column: x => x.PhysicianId,
                        principalTable: "MedicoApplicationUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admission_AppointmentId",
                table: "Admission",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Admission_PatientId",
                table: "Admission",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_CompanyId",
                table: "Appointment",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_LocationId",
                table: "Appointment",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_MedicoApplicationUserId",
                table: "Appointment",
                column: "MedicoApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_PatientId",
                table: "Appointment",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_RoomId",
                table: "Appointment",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_CompanyId",
                table: "Patient",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_PatientInsuranceId",
                table: "Patient",
                column: "PatientInsuranceId",
                unique: true,
                filter: "[PatientInsuranceId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SignatureInfo_AdmissionId",
                table: "SignatureInfo",
                column: "AdmissionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SignatureInfo_PhysicianId",
                table: "SignatureInfo",
                column: "PhysicianId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SignatureInfo");

            migrationBuilder.DropTable(
                name: "Admission");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "Patient");

            migrationBuilder.DropTable(
                name: "PatientInsurance");
        }
    }
}