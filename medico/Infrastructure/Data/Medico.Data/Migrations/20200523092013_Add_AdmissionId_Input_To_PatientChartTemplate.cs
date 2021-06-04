using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_AdmissionId_Input_To_PatientChartTemplate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE PatientChartDocumentNode
                SET PatientChartDocumentNodeJsonString = REPLACE(PatientChartDocumentNodeJsonString, '<patient-chart-template', '<patient-chart-template [admissionId]=''admissionId''');
                
                UPDATE Admission
                SET AdmissionData = REPLACE(AdmissionData, '<patient-chart-template', '<patient-chart-template [admissionId]=''admissionId''');
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE PatientChartDocumentNode
                SET PatientChartDocumentNodeJsonString = REPLACE(PatientChartDocumentNodeJsonString, '<patient-chart-template [admissionId]=''admissionId''', '<patient-chart-template');
                
                UPDATE Admission
                SET AdmissionData = REPLACE(AdmissionData, '<patient-chart-template [admissionId]=''admissionId''', '<patient-chart-template');");
        }
    }
}
