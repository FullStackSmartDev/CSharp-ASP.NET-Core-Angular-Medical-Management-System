﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Library_Support : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelectableListTrackItem");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Template");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "SelectableListCategory");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "SelectableList");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "TemplateType",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<Guid>(
                name: "LibraryTemplateTypeId",
                table: "TemplateType",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "Template",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<Guid>(
                name: "LibraryTemplateId",
                table: "Template",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Template",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "SelectableListCategory",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<Guid>(
                name: "LibrarySelectableListCategoryId",
                table: "SelectableListCategory",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "SelectableListCategory",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "SelectableList",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<bool>(
                name: "IsPredefined",
                table: "SelectableList",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "LibrarySelectableListId",
                table: "SelectableList",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "SelectableList",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "PatientChartDocumentNode",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<Guid>(
                name: "LibraryPatientChartDocumentNodeId",
                table: "PatientChartDocumentNode",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "PatientChartDocumentNode",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TemplateSelectableList",
                columns: table => new
                {
                    TemplateId = table.Column<Guid>(nullable: false),
                    SelectableListId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateSelectableList", x => new { x.TemplateId, x.SelectableListId });
                    table.ForeignKey(
                        name: "FK_TemplateSelectableList_SelectableList_SelectableListId",
                        column: x => x.SelectableListId,
                        principalTable: "SelectableList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TemplateSelectableList_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "PatientChartDocumentNode",
                columns: new[] { "Id", "CompanyId", "LibraryPatientChartDocumentNodeId", "Name", "PatientChartDocumentNodeJsonString", "Title", "Version" },
                values: new object[] { new Guid("0df67882-b7ca-3f30-6d0f-8395a05b3cb7"), null, null, "historyAndPhysical", "{\"id\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\",\"name\":\"historyAndPhysical\",\"title\":\"History And Physical\",\"type\":2,\"value\":null,\"attributes\":{\"order\":1,\"isActive\":true,\"isPredefined\":true,\"isNotShownInReport\":false,\"signedOffOnly\":false},\"children\":[{\"id\":\"0ce298a5-c3be-4919-8926-6d884562438d\",\"name\":\"Statement of Examination\",\"title\":\"Statement of Examination\",\"value\":{},\"type\":4,\"attributes\":{\"order\":1,\"isPredefined\":true,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateId\":\"917f532d-0dfc-43eb-ae8d-47e4b71b5287\"}},\"template\":\"<patient-chart-template [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' [templateType]='common' [templateId]='\\\"917f532d-0dfc-43eb-ae8d-47e4b71b5287\\\"' [patientChartDocumentNode]='patientChartDocumentNode'></patient-chart-template>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\",\"name\":\"patientHistory\",\"title\":\"Patient History\",\"value\":{},\"type\":3,\"attributes\":{\"isPredefined\":true,\"order\":2,\"isActive\":true},\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\",\"children\":[{\"id\":\"3d777f2b-7f73-424a-9394-3cad0d022bb6\",\"title\":\"Patient Medical Records Reviewed\",\"name\":\"reviewedMedicalRecords\",\"value\":{},\"type\":19,\"attributes\":{\"isPredefined\":true,\"order\":1,\"isActive\":true},\"template\":\"<reviewed-medical-records [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></reviewed-medical-records>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"ca25ceaf-5f2b-d384-4b1e-8c42b3bed3b7\",\"title\":\"Tobacco History\",\"name\":\"tobaccoHistory\",\"value\":{},\"type\":6,\"attributes\":{\"isPredefined\":true,\"order\":2,\"isActive\":true},\"template\":\"<tobacco-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></tobacco-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"bbaab92b-1c68-a062-6fc4-c663f77637d9\",\"title\":\"Drug History\",\"name\":\"drugHistory\",\"value\":{},\"type\":8,\"attributes\":{\"isPredefined\":true,\"order\":3,\"isActive\":true},\"template\":\"<drug-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></drug-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"65257e6d-f638-0cd6-09c1-4e63fea85b44\",\"title\":\"Alcohol History\",\"name\":\"alcoholHistory\",\"value\":{},\"type\":9,\"attributes\":{\"isPredefined\":true,\"order\":4,\"isActive\":true},\"template\":\"<alcohol-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></alcohol-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"9d78af46-93da-a4d9-f18b-26359b46dc1a\",\"title\":\"Previous Medical History\",\"name\":\"previousMedicalHistory\",\"value\":{},\"type\":10,\"attributes\":{\"isPredefined\":true,\"order\":5,\"isActive\":true},\"template\":\"<medical-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></medical-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"ebe51265-258d-0e44-3f52-75f4e22b41db\",\"title\":\"Previous Surgical History\",\"name\":\"previousSurgicalHistory\",\"value\":{},\"type\":11,\"attributes\":{\"isPredefined\":true,\"order\":6,\"isActive\":true},\"template\":\"<surgical-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></surgical-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"ea430551-f775-0dcb-4482-c39ba8dd61e2\",\"title\":\"Family History\",\"name\":\"familyHistory\",\"value\":{},\"type\":12,\"attributes\":{\"isPredefined\":true,\"order\":7,\"isActive\":true},\"template\":\"<family-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></family-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"c28e6572-a1a4-8e33-7cdb-f6ad22c1658d\",\"title\":\"Education\",\"name\":\"education\",\"value\":{},\"type\":13,\"attributes\":{\"isPredefined\":true,\"order\":8,\"isActive\":true},\"template\":\"<education-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></education-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"8dbfca90-e165-19c7-2782-569bdb0aa1fe\",\"title\":\"Occupational History\",\"name\":\"occupationalHistory\",\"value\":{},\"type\":14,\"attributes\":{\"isPredefined\":true,\"order\":9,\"isActive\":true},\"template\":\"<occupational-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></occupational-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"9299b50a-bff7-436c-7473-08deb5efdbe3\",\"title\":\"Allergies\",\"name\":\"allergies\",\"value\":{},\"type\":15,\"attributes\":{\"isPredefined\":true,\"order\":10,\"isActive\":true},\"template\":\"<allergy [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></allergy>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"},{\"id\":\"865c3dde-18c3-da87-0321-16e2056a09c0\",\"title\":\"Medications\",\"name\":\"medications\",\"value\":{},\"type\":16,\"attributes\":{\"isPredefined\":true,\"order\":11,\"isActive\":true},\"template\":\"<medication-history [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId'></medication-history>\",\"parentId\":\"91d5dd27-2e8e-c459-873e-ebf6e62835b1\"}]},{\"id\":\"f90c12a7-d19f-8695-4399-07d16b59cb4a\",\"name\":\"chiefComplaint\",\"title\":\"Chief Complaint\",\"value\":{},\"type\":7,\"attributes\":{\"isPredefined\":true,\"order\":3,\"isActive\":true},\"template\":\"<chief-complaint [companyId]='companyId' [appointmentId]='appointmentId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' [patientChartDocumentNode]='patientChartDocumentNode'></chief-complaint>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"da8b288f-646b-4711-a25d-fa716a1690e7\",\"name\":\"hpi\",\"title\":\"HPI\",\"value\":[],\"type\":5,\"attributes\":{\"isPredefined\":true,\"order\":4,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateTypeId\":\"5bbc7f4a-b079-41f6-9b74-288e448ff458\"}},\"template\":\"<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' templateType='hpi'></template-list>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"71bbf322-c43c-ec41-6c98-0611594b420b\",\"name\":\"ros\",\"title\":\"Review Of Systems\",\"value\":[],\"type\":5,\"attributes\":{\"isPredefined\":true,\"order\":5,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateTypeId\":\"0d2a05f5-95ee-4895-96ff-b393082e996d\"}},\"template\":\"<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' templateType='ros'></template-list>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"c4a8589f-720b-4833-8161-91dca9d7a96e\",\"name\":\"Activities of Daily Living\",\"title\":\"Activities of Daily Living\",\"value\":{},\"type\":4,\"attributes\":{\"isPredefined\":true,\"order\":6,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateId\":\"2ed1290b-8379-4f23-a91b-0556d3023094\"}},\"template\":\"<patient-chart-template [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' [templateType]='common' [templateId]='\\\"2ed1290b-8379-4f23-a91b-0556d3023094\\\"' [patientChartDocumentNode]='patientChartDocumentNode'></patient-chart-template>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"fd4ddc0f-a183-484b-8163-3b1b061e8982\",\"name\":\"physicalExams\",\"title\":\"Physical Exams\",\"value\":[],\"type\":3,\"attributes\":{\"isPredefined\":true,\"order\":7,\"isActive\":true},\"children\":[{\"id\":\"5eb895f1-4c39-fba4-e70c-91a48f2c9ee2\",\"nodeType\":3,\"name\":\"vitalSigns\",\"title\":\"Vital Signs\",\"value\":{},\"type\":17,\"attributes\":{\"isPredefined\":true,\"order\":1,\"isActive\":true},\"parentId\":\"fd4ddc0f-a183-484b-8163-3b1b061e8982\",\"template\":\"<vital-signs [companyId]='companyId' [isSignedOff]='isSignedOff' [admissionId]='admissionId' [patientId]='patientId'></vital-signs>\"},{\"id\":\"6fac01f8-5f16-5eeb-32ed-b4e8eb72d0d7\",\"name\":\"physicalExam\",\"title\":\"Physical Exam\",\"value\":[],\"type\":5,\"attributes\":{\"isPredefined\":true,\"order\":2,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateTypeId\":\"4fdf0192-5499-4e66-98a2-68e5387cbbe5\"}},\"template\":\"<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' templateType='physicalExam'></template-list>\",\"parentId\":\"fd4ddc0f-a183-484b-8163-3b1b061e8982\"}],\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"c3bbcfa7-e718-4b47-a291-1541b7e31309\",\"name\":\"procedure\",\"title\":\"Procedure\",\"value\":[],\"type\":5,\"attributes\":{\"isPredefined\":true,\"order\":8,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateTypeId\":\"3d894f76-4459-4e05-87fe-f37225b42e39\"}},\"template\":\"<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' templateType='procedure'></template-list> \",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"32bad915-6856-4d58-9288-5abce0cc0666\",\"name\":\"prescription\",\"title\":\"Prescription\",\"value\":[],\"type\":21,\"attributes\":{\"isPredefined\":true,\"order\":9,\"isActive\":true},\"template\":\"<medication-prescription [companyId]='companyId' [isSignedOff]='isSignedOff' [admissionId]='admissionId' [patientId]='patientId'></medication-prescription>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"874b0541-502c-030b-1175-8f6497b3c78d\",\"name\":\"assessment\",\"title\":\"Assessment\",\"value\":[],\"type\":18,\"attributes\":{\"isPredefined\":true,\"order\":10,\"isActive\":true},\"template\":\"<assessment [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartDocumentNode]='patientChartDocumentNode' [patientChartNode]='patientChartNode'></assessment>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"abccb09e-4d04-3051-d414-2e5a7492940f\",\"name\":\"plan\",\"title\":\"Plan\",\"value\":[],\"type\":5,\"attributes\":{\"isPredefined\":true,\"order\":11,\"isActive\":true,\"nodeSpecificAttributes\":{\"templateTypeId\":\"12e7cc25-66d0-47d1-9660-a6a50c988c13\"}},\"template\":\"<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' templateType='plan'></template-list>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"49b91e73-2b34-4f06-b52f-3bacc4559f91\",\"name\":\"addendum\",\"title\":\"Addendum\",\"value\":\"\",\"type\":22,\"attributes\":{\"isPredefined\":true,\"order\":12,\"signedOffOnly\":true,\"isActive\":true},\"template\":\"<addendum [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode'></addendum>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"},{\"id\":\"d641c024-3035-e8b8-d2fa-394eb00c59ce\",\"name\":\"scanDocument\",\"title\":\"Scan Document\",\"value\":[],\"type\":20,\"attributes\":{\"isPredefined\":true,\"order\":13,\"isNotShownInReport\":true,\"isActive\":true},\"template\":\"<scan-document [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId' [appointmentId]='appointmentId'></scan-document>\",\"parentId\":\"0df67882-b7ca-3f30-6d0f-8395a05b3cb7\"}]}", "History And Physical", 1 });

            migrationBuilder.InsertData(
                table: "SelectableListCategory",
                columns: new[] { "Id", "CompanyId", "IsActive", "LibrarySelectableListCategoryId", "Title", "Version" },
                values: new object[,]
                {
                    { new Guid("37460797-d208-4bc3-b01b-0999e8fc12fb"), null, true, null, "Vital Signs", 1 },
                    { new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"), null, true, null, "Medication", 1 },
                    { new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, null, "Social", 1 },
                    { new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, null, "Documentation", 1 },
                    { new Guid("bb8ea100-080b-4a60-93e2-986548d51c75"), null, true, null, "Administration", 1 }
                });

            migrationBuilder.InsertData(
                table: "TemplateType",
                columns: new[] { "Id", "CompanyId", "IsActive", "IsPredefined", "LibraryTemplateTypeId", "Name", "Title" },
                values: new object[,]
                {
                    { new Guid("3d894f76-4459-4e05-87fe-f37225b42e39"), null, true, true, null, "procedure", "Procedure" },
                    { new Guid("d22bfc8f-3dea-47db-892e-e184d5978ea5"), null, true, true, null, "common", "Common" },
                    { new Guid("4fdf0192-5499-4e66-98a2-68e5387cbbe5"), null, true, true, null, "physicalExam", "Physical Exam" },
                    { new Guid("0d2a05f5-95ee-4895-96ff-b393082e996d"), null, true, true, null, "ros", "ROS" },
                    { new Guid("12e7cc25-66d0-47d1-9660-a6a50c988c13"), null, true, true, null, "plan", "Plan" },
                    { new Guid("5bbc7f4a-b079-41f6-9b74-288e448ff458"), null, true, true, null, "hpi", "HPI" },
                    { new Guid("98f1e6b9-71cc-433d-960a-657d080c38f5"), null, true, true, null, "assessment", "Assessment" }
                });

            migrationBuilder.InsertData(
                table: "SelectableList",
                columns: new[] { "Id", "CategoryId", "CompanyId", "IsActive", "IsPredefined", "JsonValues", "LibrarySelectableListId", "Title", "Version" },
                values: new object[,]
                {
                    { new Guid("de085dd4-2d41-492a-9231-b2aa03768b16"), new Guid("37460797-d208-4bc3-b01b-0999e8fc12fb"), null, true, true, "[{\"id\":\"0cd04024-62ce-472e-8712-3c89d76075a4\",\"value\":\"Supine\",\"description\":\"Supine\"},{\"id\":\"efa1bed3-e941-4a61-a6ce-8fdd6505daf6\",\"value\":\"Sitting\",\"description\":\"Sitting\",\"isDefault\":true},{\"id\":\"94549eb5-ecee-4382-a209-4255e1acccc7\",\"value\":\"Standing\",\"description\":\"Standing\"}]", null, "Blood Pressure Position", 1 },
                    { new Guid("3ecfa4a6-a122-455b-95a5-c281c0f9c5da"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"0b4fa622-ed64-412e-9422-a154e84f5f35\",\"value\":\"Denies Alcohol Use\",\"description\":\"Never Drank Alcohol\",\"isDefault\":true},{\"id\":\"e66619a0-eb31-4277-890b-ae7d9171a07f\",\"value\":\"Currently Drinks Alcohol\",\"description\":\"Currently Drinks Alcohol\"},{\"id\":\"e716b6d3-0f50-4828-9497-ebfceda561c6\",\"value\":\"Quit Drinking Alcohol\",\"description\":\"Quit Drinking Alcohol\"}]", null, "Alcohol Use Status", 1 },
                    { new Guid("f971829e-8ead-4446-abc1-3043c558ebaa"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"34065102-7246-4a5d-8e21-cb5348064230\",\"description\":\"Alcohol\",\"value\":\"Alcohol\",\"isDefault\":true},{\"id\":\"a8ea85e2-5a5b-4d32-ba42-c86dac2b027e\",\"description\":\"Beer\",\"value\":\"Beer\"},{\"id\":\"036bc66a-ba65-4f91-82db-14c868dafcfd\",\"description\":\"Wine\",\"value\":\"Wine\"},{\"id\":\"c4074a8b-1cef-47e5-ac52-b0d4cbdd1f8a\",\"description\":\"Hard Liquor\",\"value\":\"Hard Liquor\"}]", null, "Alcohol Type", 1 },
                    { new Guid("eede3a10-b8c5-4ce3-9452-e03fc8123382"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"ebd73c4f-1e92-4caf-af31-901549bf5ab9\",\"description\":\"drink(s)\",\"value\":\"drink(s)\",\"isDefault\":true},{\"id\":\"22366ff3-fc3b-410f-ac7b-6e1dc7fb01ff\",\"description\":\"40 ounce\",\"value\":\"40 ounce\"},{\"id\":\"4f313025-ee6d-4f0d-9722-323e5a78a17c\",\"description\":\"fifth\",\"value\":\"fifth\"},{\"id\":\"6dda07c7-49d1-4568-803b-173d12c939bd\",\"description\":\"pint\",\"value\":\"pint\"},{\"id\":\"ec4bd2b4-3b8f-4d9b-b93a-3044e610eea0\",\"description\":\"quart\",\"value\":\"quart\"},{\"id\":\"39e9a523-6301-4540-b10e-3f7259b31b7c\",\"description\":\"gallon\",\"value\":\"gallon\"},{\"id\":\"273951c0-8be9-4f17-a78a-49b8e8dfe002\",\"description\":\"bottle\",\"value\":\"bottle\"}]", null, "Alcohol Use", 1 },
                    { new Guid("a7b2c36d-0ec0-4dda-91f8-e337a270f459"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, true, "[{\"id\":\"4e356d13-6d02-4313-a2be-8cae1e3cc0eb\",\"value\":\"Scheduled\",\"description\":\"Scheduled\",\"isDefault\":true},{\"id\":\"5b27166d-ff5c-4c42-a699-fac8c0fa7c5e\",\"value\":\"No Show\",\"description\":\"No Show\"},{\"id\":\"442c1881-7eff-41d9-b999-2de155dd919e\",\"value\":\"Exam\",\"description\":\"Exam\"},{\"id\":\"4e0356ea-3ef4-4a6d-90f3-cc4127611a60\",\"value\":\"Procedure\",\"description\":\"Procedure\"},{\"id\":\"0b08a367-9810-4796-851f-3592a05c5169\",\"value\":\"Audit\",\"description\":\"Audit\"},{\"id\":\"1be1c15f-1485-47cf-b018-446609f03fdb\",\"value\":\"Vital Signs\",\"description\":\"Vital Signs\"},{\"id\":\"c543b0f9-08f0-d791-1f1a-447c01ea4fb0\",\"value\":\"Discharged\",\"description\":\"Discharged\"}]", null, "Appointment Status", 1 },
                    { new Guid("835e052e-b481-4258-8b06-eb71efa5eb41"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, true, "[{\"id\":\"5ab7a08d-a933-4df0-af31-cf60c82c00da\",\"description\":\"Second(s)\",\"value\":\"Second(s)\",\"isDefault\":true},{\"id\":\"b549982f-dd7d-4cb4-83e1-34f52c72e930\",\"description\":\"Minute(s)\",\"value\":\"Minute(s)\"},{\"id\":\"52649d89-c46e-4246-93e0-0c52b824a8d3\",\"description\":\"Hour(s)\",\"value\":\"Hour(s)\"},{\"id\":\"270909a4-1ea4-4bf3-b23c-6ca30ce7f518\",\"description\":\"Day(s)\",\"value\":\"Day(s)\"},{\"id\":\"4f2837be-67f4-4ec2-bc58-af6709ae0966\",\"description\":\"Week(s)\",\"value\":\"Week(s)\"},{\"id\":\"d1535b14-4e50-4aad-8eda-cccacb65ab5f\",\"description\":\"Month(s)\",\"value\":\"Month(s)\"},{\"id\":\"b1aec0a3-04fe-42ed-a96c-f2720d6acd4e\",\"description\":\"Year(s)\",\"value\":\"Year(s)\"},{\"id\":\"9340cb08-13c7-47c7-b820-c34e4c5bcd32\",\"description\":\"episodes\",\"value\":\"episodes\"},{\"id\":\"d9e767e9-98f2-45e5-85a7-16d3efadd542\",\"description\":\"Unknown\",\"value\":\"Unknown\"}]", null, "Duration", 1 },
                    { new Guid("ad43752a-ade8-4212-9126-d3d506573c56"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, true, "[{\"id\":\"828cb2f9-0418-43af-9c14-7b26c6275199\",\"value\":\"PFT\",\"description\":\"PFT\"},{\"id\":\"2d69e8eb-317c-4293-89e6-172e8661009e\",\"value\":\"x-ray\",\"description\":\"x-ray\"},{\"id\":\"a66aeef8-aa0c-4c6a-b35c-e01e1350fe42\",\"value\":\"MRI\",\"description\":\"MRI\"},{\"id\":\"f3876136-33b7-4466-b0c2-cb2f132b1d15\",\"value\":\"CT Scan\",\"description\":\"CT Scan\"},{\"id\":\"25377de8-90fe-4011-a7ec-55aafbd50a9c\",\"value\":\"cardiac catheterization\",\"description\":\"cardiac catheterization\"},{\"id\":\"8aaab618-a779-451c-8e33-d75960331c80\",\"value\":\"laboratory studies\",\"description\":\"laboratory studies\"},{\"id\":\"db9f2f6d-665b-44b2-bbf7-743749b836a6\",\"value\":\"EKG\",\"description\":\"EKG\"},{\"id\":\"40c5c416-e45e-4e9c-8e64-47bbaa6c7420\",\"value\":\"EEG\",\"description\":\"EEG\"},{\"id\":\"de2ad68a-00ed-4d0f-a03e-581a2ca8a9eb\",\"value\":\"progress notes\",\"description\":\"progress notes\"},{\"id\":\"5cf52a2e-fd2e-407c-a578-38cb256b4e70\",\"value\":\"specialist progress note\",\"description\":\"specialist progress note\"},{\"id\":\"128a84c8-a858-4d48-9c68-da26b0b09bf7\",\"value\":\"ABG\",\"description\":\"ABG\"},{\"id\":\"325277a4-4d8a-4309-be4d-59ccb708138b\",\"value\":\"no documentation\",\"description\":\"no documentation\",\"isDefault\":true},{\"id\":\"7ddfc9eb-a9da-4742-a00e-3ff8ab5340ed\",\"value\":\"surgical report\",\"description\":\"surgical report\"}]", null, "Associated Documentation", 1 },
                    { new Guid("e488ce9f-17ea-4c2e-a166-9dc7e58fd780"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, true, "[{\"id\":\"d3d1aec9-1642-80a2-5e6c-a53072d80205\",\"value\":\"passport\",\"description\":\"passport\",\"isDefault\":true},{\"id\":\"99533927-37b4-2e27-c546-4fa3c5541607\",\"value\":\"drive license\",\"description\":\"drive license\"}]", null, "Identification", 1 },
                    { new Guid("683695da-d326-4940-b62f-e947b3a67456"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"5c18dd74-a36b-48c4-8055-5ac2f600a503\",\"value\":\"gram\",\"description\":\"gram\",\"isDefault\":true},{\"id\":\"27c49a2a-4098-448f-985b-399239810add\",\"value\":\"eigth ounce\",\"description\":\"eigth ounce\"},{\"id\":\"d4af299e-5f38-4234-9d1a-222831fadaeb\",\"value\":\"ounce\",\"description\":\"ounce\"},{\"id\":\"c2ff03a1-13f1-af03-8a9e-fda05e7325d4\",\"value\":\"tablet\",\"description\":\"tablet\"}]", null, "Drug Use Route", 1 },
                    { new Guid("9175e277-79d4-4897-84e5-986b903d93e6"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, true, "[{\"Id\":\"57bbb85c-ae5d-45d9-a3b3-047d87ed51f2\",\"Value\":\"complains of\",\"Description\":\"complains of\"},{\"Id\":\"9e0b0171-4955-443b-80e7-b13b0f38bb4c\",\"Value\":\"denies\",\"Description\":\"denies\",\"IsDefault\":true}]", null, "Denies", 1 },
                    { new Guid("deab5766-2c86-4e81-82d4-1ce3f780a4a0"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, false, "[{\"id\":\"7a413da6-0625-4496-99ef-e32d24143325\",\"value\":\"not\",\"description\":\"not\"},{\"id\":\"1ad9c60e-16c6-4ab8-b68a-58c677d9adbb\",\"value\":\"is not\",\"description\":\"is not\"},{\"id\":\"fef0ec7c-d27e-66e7-d837-c9b20640531b\",\"value\":\"is\",\"description\":\"is\",\"isDefault\":true}]", null, "Not", 1 },
                    { new Guid("c87715fa-d0c5-4da1-a959-cec722a13e31"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, false, "[{\"id\":\"0d81345c-3048-4586-bfb0-9f0a3d7e8996\",\"value\":\"walking\",\"description\":\"walking\"},{\"id\":\"35b20b9b-7bc1-4933-9e4f-50d9dab27882\",\"value\":\"hygiene\",\"description\":\"hygiene\"},{\"id\":\"a768fba2-481d-48cb-9ae9-5c48697c00b4\",\"value\":\"self-care\",\"description\":\"self-care\"},{\"id\":\"39977f4d-b94c-42e4-ac7b-52058720e0fe\",\"value\":\"meals\",\"description\":\"meals\"},{\"id\":\"3de4df5a-c1a6-4606-91de-b798e015d879\",\"value\":\"dressing\",\"description\":\"dressing\"},{\"id\":\"53da044f-963c-4065-9fea-141596da5f8e\",\"value\":\"driving\",\"description\":\"driving\"},{\"id\":\"eca3e9d3-eeb6-c471-213d-a0a92995c662\",\"value\":\"activities of daily living\",\"description\":\"activities of daily living\",\"isDefault\":true}]", null, "Adl Activities", 1 },
                    { new Guid("057f5281-4488-4a26-9978-67fffe3d1212"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, false, "[{\"Id\":\"b831aabe-0ca0-443d-9800-e1a4c3562e64\",\"Value\":\"with\",\"Description\":\"with\"},{\"Id\":\"3a2d04a7-854c-42b7-9462-b2b0c20199a2\",\"Value\":\"without\",\"Description\":\"with out\",\"IsDefault\":true}]", null, "With", 1 },
                    { new Guid("6176cccf-6ccc-48d7-86c4-27404531c2a6"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, false, "[{\"id\":\"24267ee9-1ede-41e2-aa39-d27bc4d56c09\",\"description\":\"does\",\"value\":\"does\",\"isDefault\":true},{\"id\":\"603e0aef-566e-476a-9aa5-27b0938fd879\",\"description\":\"does not\",\"value\":\"does not\"}]", null, "Does", 1 },
                    { new Guid("6fb8dabb-3b5a-462b-aa61-1ba607a84f49"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, false, "[{\"id\":\"60244308-6da1-4908-8b75-5f1aad7ffa32\",\"description\":\"can\",\"value\":\"can\",\"isDefault\":true},{\"id\":\"fb1b35a2-f563-4fea-8064-561be8d662a5\",\"description\":\"can not\",\"value\":\"can not\"}]", null, "Can", 1 },
                    { new Guid("16981ccc-ef62-4f5b-bff9-4e15953d386d"), new Guid("bb8ea100-080b-4a60-93e2-986548d51c75"), null, true, true, "[{\"id\":\"06f46038-04e8-7a84-4eba-35a2ec8e4b95\",\"value\":\"DO\",\"description\":\"DO\",\"isDefault\":true},{\"id\":\"cc5d6fa3-18b5-ccec-599b-557b71be8515\",\"value\":\"MD\",\"description\":\"MD\"},{\"id\":\"fdd05535-6d04-4b75-57bc-b027a913c512\",\"value\":\"PhD\",\"description\":\"PhD\"},{\"id\":\"37a2acb4-b0ef-b8b4-2e20-e447b23bf424\",\"value\":\"OD\",\"description\":\"OD\"},{\"id\":\"3d75b60e-83ef-d1b2-de4a-cc0c3f3d7b06\",\"value\":\"PA\",\"description\":\"PA\"},{\"id\":\"c3d3d6c6-a997-a3d9-5a89-288bf7b766fd\",\"value\":\"FNP\",\"description\":\"FNP\"},{\"id\":\"e2ecd2dc-597e-e2b7-273c-6cd6d8914f13\",\"value\":\"RN\",\"description\":\"RN\"},{\"id\":\"1dbbcb35-fd06-b000-6408-3190f041194a\",\"value\":\"MA\",\"description\":\"MA\"}]", null, "Title Suffix", 1 },
                    { new Guid("27674949-2fff-4346-8cb3-87677cdb4af8"), new Guid("bb8ea100-080b-4a60-93e2-986548d51c75"), null, true, true, "[{\"id\":\"aa8f97c9-1756-1581-33de-e006a82af324\",\"value\":\"Mr.\",\"description\":\"Mr\",\"isDefault\":true},{\"id\":\"274950e7-d01c-8b18-3179-4329cb9af810\",\"value\":\"Mrs.\",\"description\":\"Ms\"},{\"id\":\"d0f6fe7d-d69d-ced3-b6fa-1a66aaa1d0a8\",\"value\":\"Ms.\",\"description\":\"Ms\"},{\"id\":\"41395a61-bac0-9bea-7cd2-22c1e63544ff\",\"value\":\"Dr.\",\"description\":\"Dr.\"}]", null, "Title Prefix", 1 },
                    { new Guid("0b918d8e-e232-491b-90fa-8e304407ba02"), new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"), null, true, false, "[{\"id\":\"72de1620-d3d4-4f68-92db-64c8e5a7d15a\",\"value\":\"mild\",\"description\":\"mild\",\"isDefault\":true},{\"id\":\"5d9c513f-d7f6-416b-a61d-17d336e6ba2c\",\"value\":\"moderate\",\"description\":\"moderate\"},{\"id\":\"c3d7b52a-2e78-4bca-94fd-1e840583e506\",\"value\":\"severe\",\"description\":\"severe\"},{\"id\":\"c5efc863-edf8-409e-8749-b2c1fc12c004\",\"value\":\"0/10\",\"description\":\"0/10\"},{\"id\":\"1065c51e-ff95-4224-bb57-f0509b28d74b\",\"value\":\"1/10\",\"description\":\"1/10\"},{\"id\":\"a9061a6a-81db-4db9-a81c-79d2f87a44e0\",\"value\":\"2/10\",\"description\":\"2/10\"},{\"id\":\"934c9740-f876-4ff5-a034-d87dd1302517\",\"value\":\"3/10\",\"description\":\"3/10\"},{\"id\":\"1f3e7e56-b3c2-4d72-a1a6-3e520790c5c0\",\"value\":\"4/10\",\"description\":\"4/10\"},{\"id\":\"27d87640-3880-449d-9c52-18016102ab5c\",\"value\":\"5/10\",\"description\":\"5/10\"},{\"id\":\"57379b7a-847e-4984-ad92-7be4617426b3\",\"value\":\"6/10\",\"description\":\"6/10\"},{\"id\":\"5b42bd37-3184-4d10-b8ed-11280f8bc119\",\"value\":\"7/10\",\"description\":\"7/10\"},{\"id\":\"1f5fbd68-4d14-452d-8881-03d6036271ac\",\"value\":\"8/10\",\"description\":\"8/10\"},{\"id\":\"7036fe3d-2415-404a-b03f-68ab48a1ee0f\",\"value\":\"9/10\",\"description\":\"9/10\"},{\"id\":\"b913fca5-d60a-4737-bf27-0bf43bc6077e\",\"value\":\"10/10\",\"description\":\"10/10\"},{\"id\":\"2cf2a98c-7987-42b0-9e48-3cd6ef3e725d\",\"value\":\"no\",\"description\":\"no\"},{\"id\":\"7756230a-2b10-4f24-99ed-adc3c4134a72\",\"value\":\"any\",\"description\":\"any\"},{\"id\":\"31385544-f374-4653-b227-1c093f7753a9\",\"value\":\"minimal\",\"description\":\"minimal\"}]", null, "Severity", 1 },
                    { new Guid("a6cf6b2b-0f8d-4f46-9088-abd27048e185"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"5c18dd74-a36b-48c4-8055-5ac2f600a503\",\"value\":\"gram\",\"description\":\"gram\",\"isDefault\":true},{\"id\":\"27c49a2a-4098-448f-985b-399239810add\",\"value\":\"eight ounce\",\"description\":\"eight ounce\"},{\"id\":\"d4af299e-5f38-4234-9d1a-222831fadaeb\",\"value\":\"ounce\",\"description\":\"ounce\"},{\"id\":\"c2ff03a1-13f1-af03-8a9e-fda05e7325d4\",\"value\":\"tablet\",\"description\":\"tablet\"}]", null, "Drug Use", 1 },
                    { new Guid("37cc2e8d-7572-4355-a6ac-1306c8b8ac09"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"b62fffcb-3f65-4720-9d8e-3789b96c03f4\",\"value\":\"Amphetamines\",\"description\":\"Amphetamines\",\"isDefault\":true},{\"id\":\"66ff0bce-a339-407a-a735-2a2455d00f7d\",\"value\":\"Marijuana\",\"description\":\"Marijuana\"},{\"id\":\"3c4969a9-1154-4bec-8622-e03cccc9a91f\",\"value\":\"Heroine\",\"description\":\"Heroine\"},{\"id\":\"28a89ac1-6daa-4924-96f1-8eac8682462c\",\"value\":\"MDMA\",\"description\":\"MDMA\"},{\"id\":\"e701d3cc-9bea-4ada-a00a-ebbc21abe2fb\",\"value\":\"Cocaine\",\"description\":\"Cocaine\"},{\"id\":\"15136965-57a7-40dd-bac4-466ee06137c5\",\"value\":\"Crack\",\"description\":\"Crack\"},{\"id\":\"c32d121d-07d3-4167-9b14-0e00a4ea7304\",\"value\":\"Opioides\",\"description\":\"Opioides\"},{\"id\":\"ede03fed-42b6-fe2c-f860-db6f9ddd7dde\",\"value\":\"Molly\",\"description\":\"Molly\"}]", null, "Drug Type", 1 },
                    { new Guid("30907ec3-1ab2-42f0-8ff4-ccd53327c355"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"37bef3b8-ff92-4552-9f0e-696ed770c3ba\",\"value\":\"Denies Drugs Use\",\"description\":\"Never Used Alcohol\",\"isDefault\":true},{\"id\":\"f7475255-a5d3-464f-8df2-fc2a5ac4cb5e\",\"value\":\"Currently Uses Drugs\",\"description\":\"Currently Uses Drugs\"},{\"id\":\"09751e38-58de-4db7-8839-226d5617cb28\",\"value\":\"Quit Using Drugs\",\"description\":\"Quit Using Drugs\"}]", null, "Drug Use Status", 1 },
                    { new Guid("88800a93-5a5b-4756-abed-8c2c4f545a8c"), new Guid("37460797-d208-4bc3-b01b-0999e8fc12fb"), null, true, true, "[{\"id\":\"5c45d70d-7f30-4715-bd42-54349553c5c1\",\"description\":\"Right Bicep\",\"value\":\"Right Bicep\",\"isDefault\":true},{\"id\":\"cad7b3d6-fbe5-4c76-8c96-64d6b93763ab\",\"description\":\"Left Bicep\",\"value\":\"Left Bicep\"},{\"id\":\"4b6659f9-6651-4bb3-90ab-4fe82d6374fe\",\"description\":\"Right Forearm\",\"value\":\"Right Forearm\"},{\"id\":\"73469a6a-11b6-40f6-9f31-e7f8df638fd5\",\"description\":\"Left Forearm\",\"value\":\"Left Forearm\"},{\"id\":\"7db2bfa6-f653-4e6e-8f1d-f1784fbbcd56\",\"description\":\"Right Thigh\",\"value\":\"Right Thigh\"},{\"id\":\"5f80a302-05a7-45df-939a-16600141d629\",\"description\":\"Left Thigh\",\"value\":\"Left Thigh\"},{\"id\":\"038aec0f-3750-4932-a49c-2bd98870eae0\",\"description\":\"Right Ankle\",\"value\":\"Right Ankle\"},{\"id\":\"0b01e99c-b562-4ef9-a26c-52b94dae49df\",\"description\":\"Left Ankle\",\"value\":\"Left Ankle\"}]", null, "Blood Pressure Location", 1 },
                    { new Guid("46705797-7974-4729-aa55-25150c8b9eef"), new Guid("37460797-d208-4bc3-b01b-0999e8fc12fb"), null, true, true, "[{\"id\":\"f7a94357-2d89-f214-1aba-984e76e0b03b\",\"value\":\"At Rest\",\"description\":\"At Rest\",\"isDefault\":true},{\"id\":\"d0f6e3ad-4a01-75db-04ea-541c8f3193a6\",\"value\":\"Walking\",\"description\":\"Walking\"},{\"id\":\"8948704d-dec7-a090-0ce2-9ea0dafe69a3\",\"value\":\"Recovery\",\"description\":\"Recovery\"},{\"id\":\"5bbe5663-7b4c-eed6-bd03-f0013e511e46\",\"value\":\"Pre-PFT\",\"description\":\"Pre-PFT\"},{\"id\":\"a3db58f2-e576-81d7-7f6e-8c769e535992\",\"value\":\"Post-PFT\",\"description\":\"Post-PFT\"}]", null, "Oxygen Saturation Test", 1 },
                    { new Guid("e584095f-7622-4a04-ba61-0ab8145c1e44"), new Guid("37460797-d208-4bc3-b01b-0999e8fc12fb"), null, true, true, "[{\"id\":\"8dc28e73-2e33-1ed0-eedc-dc3bbded50c9\",\"value\":\"Continuously\",\"description\":\"Continuously\"},{\"id\":\"df016354-9168-2592-e050-b855ff0ee61e\",\"value\":\"As Needed\",\"description\":\"As needed\",\"isDefault\":true},{\"id\":\"89c81567-32bc-c239-65b7-0bb29d6b48d3\",\"value\":\"At Night\",\"description\":\"At Night\"}]", null, "Oxygen Use Type", 1 },
                    { new Guid("63d73b9b-9478-4364-8956-5f9e535f17fd"), new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"), null, true, true, "[{\"id\":\"44ec9c40-10ee-b7bf-2989-7e81c03bd057\",\"value\":\"mg\",\"description\":\"mg\"},{\"id\":\"d270c257-e5fe-3aca-1c63-ac7cfc6d76ff\",\"value\":\"ml\",\"description\":\"ml\"},{\"id\":\"ba6b277b-0d90-37ad-b99e-02a9ef56d3fd\",\"value\":\"mcg\",\"description\":\"mcg\"},{\"id\":\"08e958ca-9008-dacf-6072-4d79d96bb9d0\",\"value\":\"ml\",\"description\":\"ml\"},{\"id\":\"27b71d90-a055-ed7a-6d68-ccc13e9a9cfb\",\"value\":\"Liter\",\"description\":\"Liter\"},{\"id\":\"eada0a3c-a46a-ea28-eb89-4783327c191f\",\"value\":\"mg/kg\",\"description\":\"mg/kg\"},{\"id\":\"2a9e6e7d-d2f5-7cbe-33a5-b62401aacbf5\",\"value\":\"ml/kg\",\"description\":\"ml/kg\"}]", null, "Medications Units", 1 },
                    { new Guid("b907cdcf-5012-4930-85c1-8c7f53cd9767"), new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"), null, true, true, "[{\"id\":\"b845a0cf-180e-46ab-9b77-8a8edca870c1\",\"value\":\"Rash\",\"description\":\"Rash\"},{\"id\":\"1f4bdfb1-a2c4-46b8-9c04-358c37b1536c\",\"value\":\"Anaphylaxis\",\"description\":\"Anaphylaxis\"},{\"id\":\"c97df55b-ef13-4c56-a28b-a837ef0d69bb\",\"value\":\"Difficulty Breathing\",\"description\":\"Difficulty Breathing\"},{\"id\":\"c6bf281c-a3df-4d8f-b81d-908dd0263625\",\"value\":\"Nausea and Vomiting\",\"description\":\"Nausea and Vomiting\"},{\"id\":\"1bd8ab30-166f-4b27-83cd-c07b4f63e15e\",\"value\":\"Itching\",\"description\":\"Itching\"},{\"id\":\"de769cef-d013-3f7d-297c-3c9466609794\",\"value\":\"None\",\"description\":\"None\",\"isDefault\":true}]", null, "Medications Allergies", 1 },
                    { new Guid("2e6d349b-968f-4deb-bb4f-cff54e052f56"), new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"), null, true, true, "[{\"id\":\"3b5aaf83-80df-4977-918a-5b2fcb654eec\",\"description\":\"PO\",\"value\":\"PO\",\"isDefault\":true},{\"id\":\"b0134614-35be-4354-acd5-8f753007e079\",\"description\":\"PR\",\"value\":\"PR\"},{\"id\":\"869e6d52-5b18-4ae1-a028-acafd00d33b0\",\"description\":\"Topical\",\"value\":\"Topical\"},{\"id\":\"98743ed5-bcd4-4b86-8256-e9111a080281\",\"description\":\"IM\",\"value\":\"IM\"},{\"id\":\"86a7c26f-4145-4211-8f4b-e69970406520\",\"description\":\"IV\",\"value\":\"IV\"},{\"id\":\"45da8a34-ee18-4a3b-acb6-2ca7ff4e5fd4\",\"description\":\"drops\",\"value\":\"drops\"}]", null, "Medications Route", 1 },
                    { new Guid("5818c64f-8a47-4355-ab50-eb61ec7f1cc7"), new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"), null, true, true, "[{\"id\":\"899ed174-6613-45bb-b86b-b165a2f1801c\",\"description\":\"QAM\",\"value\":\"QAM\",\"isDefault\":true},{\"id\":\"eecf1751-969e-4822-b648-6ce74b3232e9\",\"description\":\"QDay\",\"value\":\"QDay\"},{\"id\":\"99466ab6-50a3-48da-a41f-2014fcb07dc7\",\"description\":\"Bid\",\"value\":\"Bid\"},{\"id\":\"881b2cc0-4b32-4c0f-9851-b1c8e188157d\",\"description\":\"Tid\",\"value\":\"Tid\"},{\"id\":\"a62eaa2b-8a69-496b-a4c0-ab623a847d0b\",\"description\":\"Qid\",\"value\":\"Qid\"},{\"id\":\"2250afbb-cb34-4707-9d9c-f78d071a51c2\",\"description\":\"QHS\",\"value\":\"QHS\"},{\"id\":\"0060cce2-408e-4085-bcac-3fdc83923248\",\"description\":\"Q 1 Hour\",\"value\":\"Q 1 Hour\"},{\"id\":\"73ae5864-c19e-4495-a558-db27403397c2\",\"description\":\"Q 2 Hours\",\"value\":\"Q 2 Hours\"},{\"id\":\"f1f7cea3-0724-4822-b016-2093fe4aaf24\",\"description\":\"Q 4 Hours\",\"value\":\"Q 4 Hours\"},{\"id\":\"e8024217-552c-4a34-89b6-6a2f0128c861\",\"description\":\"Q 6 Hours\",\"value\":\"Q 6 Hours\"},{\"id\":\"3b17f947-105d-4837-8a5a-edf221256b75\",\"description\":\"Q 8 Hours\",\"value\":\"Q 8 Hours\"},{\"id\":\"3405fdfc-b15a-431c-883d-c5bb73abbfd1\",\"description\":\"Q 12 Hours\",\"value\":\"Q 12 Hours\"},{\"id\":\"11a861ae-0975-419f-b1c0-758b9a8acc93\",\"description\":\"Q 5 minutes\",\"value\":\"Q 5 minutes\"},{\"id\":\"f2ac1d15-4230-41d3-a7bb-8f0d9374e1fa\",\"description\":\"Q 10 minutes\",\"value\":\"Q 10 minutes\"},{\"id\":\"d7c92232-6602-4a40-8ab4-cbc89089672a\",\"description\":\"Q 15 minutes\",\"value\":\"Q 15 minutes\"},{\"id\":\"dae84583-a009-4551-911c-dc48039208b4\",\"description\":\"Q 20 minutes\",\"value\":\"Q 20 minutes\"},{\"id\":\"92350cb4-311c-4710-b916-f48fb0621eb1\",\"description\":\"Q 30 minutes\",\"value\":\"Q 30 minutes\"},{\"id\":\"845b5aa7-30d5-46a0-b6ff-d0270128312f\",\"description\":\"Q 45 minutes\",\"value\":\"Q 45 minutes\"},{\"id\":\"c3d028d6-d9fb-4a88-9e9a-75500fa22bce\",\"description\":\"6 AM 12 PM 6 PM 12 AM\",\"value\":\"6 AM 12 PM 6 PM 12 AM\"},{\"id\":\"b7b9c5da-8f70-49da-8b42-ae219feecae7\",\"description\":\"6 AM 2 PM 10 PM\",\"value\":\"6 AM 2 PM 10 PM\"},{\"id\":\"8f843bdf-a220-403d-808c-9cef8906ed5e\",\"description\":\"6 AM 12 AM\",\"value\":\"6 AM 12 AM\"},{\"id\":\"3082b68e-5170-459c-9fa8-76c8e0dffa82\",\"description\":\"NOW\",\"value\":\"NOW\"}]", null, "Medications Dose Schedule", 1 },
                    { new Guid("693892e5-aa93-4af9-80a8-e38134364659"), new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"), null, true, true, "[{\"id\":\"6285933f-e60e-47b4-8ecb-b2ec9689b2db\",\"description\":\"Current\",\"value\":\"Current\",\"isDefault\":true},{\"id\":\"70619cf9-ab4a-435b-8857-90ba2fcf4912\",\"description\":\"Discontinued\",\"value\":\"Discontinued\"}]", null, "Medications Status", 1 },
                    { new Guid("461231ff-7370-4616-a5ef-b82157be16ba"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"4f6efc3a-91fd-40f5-a343-61c295476d82\",\"description\":\"daily\",\"value\":\"daily\",\"isDefault\":true},{\"id\":\"87e50252-4362-4582-8c29-c342343dbdf5\",\"description\":\"weekly\",\"value\":\"weekly\"},{\"id\":\"3352a5f2-dbd6-4f9f-bf85-5339bf0b77ad\",\"description\":\"weekends only\",\"value\":\"weekends only\"},{\"id\":\"8695ead1-373b-40a3-9271-46fd1810a51a\",\"description\":\"monthly\",\"value\":\"monthly\"},{\"id\":\"d87fd3c4-5477-43d0-9a41-fadb8ceeb759\",\"description\":\"socially\",\"value\":\"socially\"}]", null, "Frequency", 1 },
                    { new Guid("dea559cd-c24b-4171-a25f-2017da06b15d"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"b66d5795-80d0-4579-8a54-cb17c0ed695b\",\"value\":\"Denies Tobacco Use\",\"description\":\"Never Smoked\",\"isDefault\":true},{\"id\":\"c7d148cd-b66b-4bec-9b32-d197ca2d3709\",\"value\":\"Currently Smokes\",\"description\":\"Currently Smokes\"},{\"id\":\"e4cb561d-c0b8-44c5-9352-98c0986a61e5\",\"value\":\"Quit Smoking\",\"description\":\"Quit Smoking\"},{\"id\":\"77904b88-b535-de5a-9946-663fc6239578\",\"value\":\"Chew Tobacco\",\"description\":\"new status\"}]", null, "Tobacco Use Status", 1 },
                    { new Guid("70e07cc0-c1a1-4cab-a590-1ebb63717461"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"f1a0d9d8-cda4-41e3-a5a8-fb1c41ffd9c7\",\"value\":\"Tobacco\",\"description\":\"Tobacco\",\"isDefault\":true},{\"id\":\"501e59b9-14af-420c-9a3b-f87d687799d4\",\"value\":\"Cigarettes\",\"description\":\"Cigarettes\"},{\"id\":\"51aae1f0-bfaa-4fc7-b57d-bd611c7338ee\",\"value\":\"Chew Tobacco\",\"description\":\"Chew Tobacco\"},{\"id\":\"3317e3c9-3dff-4cb1-8201-047edda0b3ee\",\"value\":\"Cigar/Pipe\",\"description\":\"Cigar/Pipe\"},{\"id\":\"38f52a00-e8c7-f039-e213-6c4075187576\",\"value\":\"new tobacco\",\"description\":\"new tobacco\"}]", null, "Tobacco Type", 1 },
                    { new Guid("88ffe78c-93dc-46c2-bc3e-fdedbd84ab90"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"79be7b69-cfc6-4e6d-aad3-d6beae312e01\",\"value\":\"pack(s)\",\"description\":\"pack(s)\",\"isDefault\":true},{\"id\":\"538f0006-fa00-4820-8350-d5f34f704baf\",\"value\":\"cigarette(s)\",\"description\":\"cigarette(s)\"},{\"id\":\"49f036ca-ae76-6a9a-d0d1-b49f821711ec\",\"value\":\"tabac\",\"description\":\"tabac\"}]", null, "Tobacco Use", 1 },
                    { new Guid("3821efa3-7d06-4e1f-af55-82806a7f6ab4"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, false, "[{\"id\":\"6749f69e-7b41-49bd-a503-1c55f7ab9109\",\"value\":\"Athlete\",\"description\":\"Athlete\"},{\"id\":\"416123af-4619-40c1-a1e6-a047f13df4f1\",\"value\":\"Accountant\",\"description\":\"Accountant\"},{\"id\":\"54da9ea9-c6da-4ada-883a-2c79e976bd92\",\"value\":\"Actor/actress\",\"description\":\"Actor/actress\"},{\"id\":\"43c7a96d-2f84-4249-8032-dad81cb5de3e\",\"value\":\"Administrator\",\"description\":\"Administrator\"},{\"id\":\"f55f164d-dd97-4e85-8902-7c4eda8f66a9\",\"value\":\"Aerospace Tngineer\",\"description\":\"Aerospace Tngineer\"},{\"id\":\"6365c6fb-2cce-4569-b3b6-e0ea1bbfebc8\",\"value\":\"Air Traffic Controller\",\"description\":\"Air Traffic Controller\"},{\"id\":\"9e725ad1-851f-40f7-a4e5-f359e123cafd\",\"value\":\"Ambassador\",\"description\":\"Ambassador\"},{\"id\":\"da464576-e95b-49c7-a397-4e3313933d54\",\"value\":\"Anesthetist\",\"description\":\"Anesthetist\"},{\"id\":\"a83a0cec-8b23-4c1b-8b85-a153409c8332\",\"value\":\"Anchorman\",\"description\":\"Anchorman\"},{\"id\":\"5d01695d-eebd-46c9-b718-00c72ad215a0\",\"value\":\"Animator\",\"description\":\"Animator\"},{\"id\":\"23f26363-8d3f-481d-8303-ff6eb3e6c158\",\"value\":\"Animal Trainer\",\"description\":\"Animal Trainer\"},{\"id\":\"91a24573-a22c-48e2-acba-29dadc0f9289\",\"value\":\"Archaeologist\",\"description\":\"Archaeologist\"},{\"id\":\"fb1d6837-d9d7-45e3-b94e-7a8850f82127\",\"value\":\"Architect\",\"description\":\"Architect\"},{\"id\":\"9ab9a291-1c38-4c31-88ea-84201c44c19d\",\"value\":\"Art Dealer\",\"description\":\"Art Dealer\"},{\"id\":\"36a2dcc6-321d-4289-88c7-3fbb4be01c41\",\"value\":\"Artist\",\"description\":\"Artist\"},{\"id\":\"9860b08b-85e0-435f-910f-5e3b33f0e678\",\"value\":\"Astronaut\",\"description\":\"Astronaut\"},{\"id\":\"68545030-bab8-438f-94c3-63579229e596\",\"value\":\"Astronomer\",\"description\":\"Astronomer\"},{\"id\":\"3865f050-160d-465e-a0e8-aa5af4c76977\",\"value\":\"Athletic Trainer\",\"description\":\"Athletic Trainer\"},{\"id\":\"89c710d8-a2e7-4ecb-a3e1-c981143707d4\",\"value\":\"Attorney\",\"description\":\"Attorney\"},{\"id\":\"09e3151f-5a5d-482c-9c88-237c1fcc01fd\",\"value\":\"Author\",\"description\":\"Author\"},{\"id\":\"fc98172c-c236-4116-ba70-e28c9c85a441\",\"value\":\"Auditor\",\"description\":\"Auditor\"},{\"id\":\"18bdc7c8-cacb-4273-acf7-6e3d8198b826\",\"value\":\"Babysitter\",\"description\":\"Babysitter\"},{\"id\":\"bcd3bd76-f5a9-4ad3-9db8-4ece2fe65d12\",\"value\":\"Baker\",\"description\":\"Baker\"},{\"id\":\"6f606059-d528-4fbe-ae9f-6c154c438527\",\"value\":\"Bank Teller\",\"description\":\"Bank Teller\"},{\"id\":\"e0346813-ba32-4fdd-bc0d-09eed62cfdd1\",\"value\":\"Banker\",\"description\":\"Banker\"},{\"id\":\"ccaf5cce-feb3-4911-89d9-805b632f7ca6\",\"value\":\"Barber\",\"description\":\"Barber\"},{\"id\":\"9d034535-570c-40e6-88fc-431813b1933a\",\"value\":\"Barista\",\"description\":\"Barista\"},{\"id\":\"d9acd076-2e8c-4653-a6ab-cfb685487216\",\"value\":\"Barrister\",\"description\":\"Barrister\"},{\"id\":\"6ae44555-0594-4145-8301-c45753618c4e\",\"value\":\"Bartender\",\"description\":\"Bartender\"},{\"id\":\"35fab9a2-393c-4ef2-ac5a-6e8640b5e149\",\"value\":\"Bassoonist\",\"description\":\"Bassoonist\"},{\"id\":\"2b81ac73-bb5e-4927-b1de-5ae0ebcfa86f\",\"value\":\"Batman\",\"description\":\"Batman\"},{\"id\":\"a43d0989-1a3a-4758-bce1-a4604bf8391c\",\"value\":\"Beauty Therapist\",\"description\":\"Beauty Therapist\"},{\"id\":\"3b7c99b0-88aa-4ed2-8ee6-0aae82084247\",\"value\":\"Beekeeper\",\"description\":\"Beekeeper\"},{\"id\":\"9b081727-e705-4c1c-be77-72e1e9b392a5\",\"value\":\"Bellhop\",\"description\":\"Bellhop\"},{\"id\":\"8c916dd7-7c53-4994-b1d1-51dd37ac5fe2\",\"value\":\"Blacksmith\",\"description\":\"Blacksmith\"},{\"id\":\"dbecdfb0-f0eb-4cd7-be99-56f14fca0bca\",\"value\":\"Boilermaker\",\"description\":\"Boilermaker\"},{\"id\":\"efbc4b5a-a7aa-4363-b8a9-9cb69a262440\",\"value\":\"Bookkeeper\",\"description\":\"Bookkeeper\"},{\"id\":\"f6c097a5-6b09-423f-9d53-162252e2c773\",\"value\":\"Bookseller\",\"description\":\"Bookseller\"},{\"id\":\"4164b5bd-d0ab-477f-8155-04b92b81f6ed\",\"value\":\"Brewer\",\"description\":\"Brewer\"},{\"id\":\"4a302c25-d45a-4f15-97d2-76d711c16c72\",\"value\":\"Builder\",\"description\":\"Builder\"},{\"id\":\"74eda81d-3a6d-4b53-95e2-62cb2488aee3\",\"value\":\"Butcher\",\"description\":\"Butcher\"},{\"id\":\"24d04656-e484-4640-9247-2882af05a545\",\"value\":\"Butler\",\"description\":\"Butler\"},{\"id\":\"3045d92c-a3ff-41bc-b78f-f13c3324dbde\",\"value\":\"Cab Driver\",\"description\":\"Cab Driver\"},{\"id\":\"17999a9f-7fff-41da-ab42-3fa671bad46e\",\"value\":\"Calligrapher\",\"description\":\"Calligrapher\"},{\"id\":\"d851a86a-8fc7-45c0-b4c1-71f1dbbc3544\",\"value\":\"Cameraman\",\"description\":\"Cameraman\"},{\"id\":\"e86f90a1-472a-4e79-be81-ed5de3f2704c\",\"value\":\"Car Designer\",\"description\":\"Car Designer\"},{\"id\":\"d0d1e4b7-ab33-43e0-a29a-69ddcb846d68\",\"value\":\"Cardiologist\",\"description\":\"Cardiologist\"},{\"id\":\"abd122a0-12b8-4480-bba6-99c5e7059931\",\"value\":\"Carpenter\",\"description\":\"Carpenter\"},{\"id\":\"d5c1a77a-549f-4777-9336-173d95a59a6c\",\"value\":\"Cartoonist\",\"description\":\"Cartoonist\"},{\"id\":\"71414eaa-61d5-4d93-8a32-47453035c437\",\"value\":\"Cartographer\",\"description\":\"Cartographer\"},{\"id\":\"a75e1746-dac3-41e1-a8fd-a08401cefc95\",\"value\":\"Cashier\",\"description\":\"Cashier\"},{\"id\":\"00cfe75e-683f-45a0-a675-d204155bb819\",\"value\":\"Cellist\",\"description\":\"Cellist\"},{\"id\":\"d5c92967-40e6-470b-a73a-755faee91da2\",\"value\":\"Chaplain\",\"description\":\"Chaplain\"},{\"id\":\"f7914b21-64c7-430e-8bc8-2712ad73f9e6\",\"value\":\"Chess Player\",\"description\":\"Chess Player\"},{\"id\":\"a4ea66f6-2678-4edc-8116-4e59a3b25930\",\"value\":\"Chief Compliance Officer\",\"description\":\"Chief Compliance Officer\"},{\"id\":\"7863d338-4dc3-473e-969b-a4f6191844ee\",\"value\":\"Chief Executive Officer\",\"description\":\"Chief Executive Officer\"},{\"id\":\"9149c2b2-375d-4ed2-bb6e-54a2e436504a\",\"value\":\"Chief Information Officer\",\"description\":\"Chief Information Officer\"},{\"id\":\"66f81d61-cf71-4e44-8d65-79aaea02bd3b\",\"value\":\"Chief Financial Officer\",\"description\":\"Chief Financial Officer\"},{\"id\":\"16ed6fc7-2429-4ccb-9069-0a3b3aa0f11e\",\"value\":\"Chief Technology Officer\",\"description\":\"Chief Technology Officer\"},{\"id\":\"cac9bff6-fb96-4399-9c27-c1e4e34f3e5b\",\"value\":\"Chief Privacy Officer\",\"description\":\"Chief Privacy Officer\"},{\"id\":\"ecbcfa6c-ed2b-4f58-a5a6-b2ce0df91d9e\",\"value\":\"Chauffeur\",\"description\":\"Chauffeur\"},{\"id\":\"eddccb63-8111-4d90-8067-1600e7ed665f\",\"value\":\"Cheesemaker\",\"description\":\"Cheesemaker\"},{\"id\":\"c5c03ad6-4fb6-401f-b75f-7e5ead93c3c2\",\"value\":\"Chef\",\"description\":\"Chef\"},{\"id\":\"4e0007a2-2ed0-40b8-9f88-1276a7e23a46\",\"value\":\"Chemist\",\"description\":\"Chemist\"},{\"id\":\"95871e34-c551-426c-b3da-f739f2f68f13\",\"value\":\"Chief of Police\",\"description\":\"Chief of Police\"},{\"id\":\"2e1737d9-0bae-4b35-9f96-2453a344319f\",\"value\":\"Chimney Sweep\",\"description\":\"Chimney Sweep\"},{\"id\":\"6c76859d-00e0-40a0-8f3e-c8a2ea92110a\",\"value\":\"Civil Servant\",\"description\":\"Civil Servant\"},{\"id\":\"4a61cfc8-d9ea-4f3b-85f6-26559da934fa\",\"value\":\"Civil Engineer\",\"description\":\"Civil Engineer\"},{\"id\":\"f0b42f52-6d34-4a1a-b4f9-d30b3ea4b8c1\",\"value\":\"Clarinetist\",\"description\":\"Clarinetist\"},{\"id\":\"6297900e-698f-49f0-b2b3-7917876eae8e\",\"value\":\"Cleaner\",\"description\":\"Cleaner\"},{\"id\":\"e3b6be69-7e88-4356-a15c-ce685adc98ac\",\"value\":\"Clerk\",\"description\":\"Clerk\"},{\"id\":\"fcf50253-96bc-4180-a76e-49fa6d2db793\",\"value\":\"Clockmaker\",\"description\":\"Clockmaker\"},{\"id\":\"a4a3f48b-5be2-4e96-bd44-041bf85d2f35\",\"value\":\"Coach\",\"description\":\"Coach\"},{\"id\":\"1d85cdcb-3445-4391-89da-eda2041468ec\",\"value\":\"Coachman\",\"description\":\"Coachman\"},{\"id\":\"6561f84d-cc2f-4dc3-8ee1-c3a3489e1700\",\"value\":\"Coast Guard\",\"description\":\"Coast Guard\"},{\"id\":\"e6bd6a5c-c8e6-4042-ace1-8ec031716e82\",\"value\":\"Cobbler\",\"description\":\"Cobbler\"},{\"id\":\"4a67cf5c-7480-4d53-a99b-05b023631494\",\"value\":\"Columnist\",\"description\":\"Columnist\"},{\"id\":\"6e49afae-2bdb-40bc-b77c-5106a4895139\",\"value\":\"Comedian\",\"description\":\"Comedian\"},{\"id\":\"70c80ced-2b5d-4f08-b050-2a5ad881523f\",\"value\":\"Company Secretary\",\"description\":\"Company Secretary\"},{\"id\":\"9745fcad-9bf3-4e58-9ae6-95593f39e186\",\"value\":\"Compasssmith\",\"description\":\"Compasssmith\"},{\"id\":\"52ee31e3-1f4f-4010-84cd-93ba7cc5f3ca\",\"value\":\"Composer\",\"description\":\"Composer\"},{\"id\":\"f46b25df-218b-4ff4-bf08-cb3bd7dfcaa7\",\"value\":\"Computer Programmer\",\"description\":\"Computer Programmer\"},{\"id\":\"370b91ef-4b27-410a-95d9-a54116ee2f96\",\"value\":\"Conductor\",\"description\":\"Conductor\"},{\"id\":\"d686e519-c277-4bf6-85de-e13d26837779\",\"value\":\"Construction Engineer\",\"description\":\"Construction Engineer\"},{\"id\":\"7e27585d-4c42-4690-83c7-6e995f6c84b0\",\"value\":\"Construction Worker\",\"description\":\"Construction Worker\"},{\"id\":\"14627738-7977-4b36-94d6-18b9066cafd6\",\"value\":\"Consul\",\"description\":\"Consul\"},{\"id\":\"305ca878-4e6c-4994-b963-7cf344b157fe\",\"value\":\"Consultant\",\"description\":\"Consultant\"},{\"id\":\"caeefcb5-5c1f-460a-bd70-68b6dbf06043\",\"value\":\"Contractor\",\"description\":\"Contractor\"},{\"id\":\"8093bc8b-036b-4ceb-9e4d-951e37cadc26\",\"value\":\"Cook\",\"description\":\"Cook\"},{\"id\":\"b5a09af1-8258-4eed-9ac4-5970442388ef\",\"value\":\"Coroner\",\"description\":\"Coroner\"},{\"id\":\"ed693a36-a6b4-45bf-84fb-80f972cff7d0\",\"value\":\"Corrections Officer\",\"description\":\"Corrections Officer\"},{\"id\":\"a5fcda63-15ef-4536-a173-479139f74536\",\"value\":\"Cosmonaut\",\"description\":\"Cosmonaut\"},{\"id\":\"68a03deb-29dd-44d0-8eec-83f55281f75a\",\"value\":\"Costume Designer\",\"description\":\"Costume Designer\"},{\"id\":\"866de163-d87c-4395-a814-6e077d43986f\",\"value\":\"Courier\",\"description\":\"Courier\"},{\"id\":\"39b52ec4-9959-4b11-8770-b21aff87d19b\",\"value\":\"Cryptographer\",\"description\":\"Cryptographer\"},{\"id\":\"8418342f-f9d4-4715-87a6-8cc10ac82c60\",\"value\":\"Cryptozoologist\",\"description\":\"Cryptozoologist\"},{\"id\":\"060fed68-35fa-4922-8a37-7d3973e6fc9b\",\"value\":\"Currier\",\"description\":\"Currier\"},{\"id\":\"520c5a12-bffc-4fb3-ac04-be1003b6f4a4\",\"value\":\"Customer Service Representative\",\"description\":\"Customer Service Representative\"},{\"id\":\"4630e46f-32a7-4c62-ae67-94d527164f0e\",\"value\":\"Customs Officer\",\"description\":\"Customs Officer\"},{\"id\":\"58f25d80-9a98-4140-9e68-eb2336c6567d\",\"value\":\"Dancer\",\"description\":\"Dancer\"},{\"id\":\"8cd82a9b-0c9a-4e3b-b838-db44e6c4e233\",\"value\":\"Dentist\",\"description\":\"Dentist\"},{\"id\":\"dabcdb03-956b-48ed-a144-da47a6609fb1\",\"value\":\"Deputy\",\"description\":\"Deputy\"},{\"id\":\"dd6c1559-f337-4447-b99e-21ae58c70dd3\",\"value\":\"Dermatologist\",\"description\":\"Dermatologist\"},{\"id\":\"f1eacb8d-5ea2-404f-aaac-4259ff52788b\",\"value\":\"Detective\",\"description\":\"Detective\"},{\"id\":\"b110b102-1f89-4fdb-92f9-3ddbc3fb4c62\",\"value\":\"Dictator\",\"description\":\"Dictator\"},{\"id\":\"7fb8540c-4b96-4dfa-8069-5d8c1a8d3107\",\"value\":\"Disc Jockey\",\"description\":\"Disc Jockey\"},{\"id\":\"f35cc96a-0977-4a58-9502-92bd7596c972\",\"value\":\"Diver\",\"description\":\"Diver\"},{\"id\":\"0ac6a4f0-d7d7-4948-8b0d-50ff1ac3260b\",\"value\":\"Doctor\",\"description\":\"Doctor\"},{\"id\":\"9fd5b230-47ca-4383-b66b-e7335852a338\",\"value\":\"Dog Walker\",\"description\":\"Dog Walker\"},{\"id\":\"16583974-54f4-4064-bc09-d78f67e5ddc1\",\"value\":\"Doorman\",\"description\":\"Doorman\"},{\"id\":\"695a5efe-52a2-4900-9884-8a9f72be2a63\",\"value\":\"Dressmaker\",\"description\":\"Dressmaker\"},{\"id\":\"b0c93c2d-0bdd-4518-b5d6-9a486e96b212\",\"value\":\"Dealer\",\"description\":\"Dealer\"},{\"id\":\"55f6af00-1d66-48a2-b471-36bc2b7d3acd\",\"value\":\"Falconer\",\"description\":\"Falconer\"},{\"id\":\"09b46fdc-c3eb-4092-b773-21d3e4396fdf\",\"value\":\"Farmer\",\"description\":\"Farmer\"},{\"id\":\"22bcc6e9-7348-4777-bc2b-ac29590470a1\",\"value\":\"Farrier\",\"description\":\"Farrier\"},{\"id\":\"d8362a5b-f47e-4872-8b50-702a85703049\",\"value\":\"Fashion designer\",\"description\":\"Fashion designer\"},{\"id\":\"facab8c2-b9a0-4c76-b5c4-8969e71bf0ba\",\"value\":\"Film director\",\"description\":\"Film director\"},{\"id\":\"8172d290-707f-41e1-9390-6c3b4f61053a\",\"value\":\"Film producer\",\"description\":\"Film producer\"},{\"id\":\"47c5b2ca-e2f7-47fc-ace8-dd6a663bb5dd\",\"value\":\"Financial Adviser\",\"description\":\"Financial Adviser\"},{\"id\":\"cf3eb469-2052-4476-91ad-36daa86a2fab\",\"value\":\"Fire Marshal\",\"description\":\"Fire Marshal\"},{\"id\":\"020be59d-2898-4e31-a2fe-d66fd8c31619\",\"value\":\"Fire Safety Officer\",\"description\":\"Fire Safety Officer\"},{\"id\":\"d9ee01c2-3c3b-4d3a-a21d-35d8c195bc7c\",\"value\":\"Firefighter\",\"description\":\"Firefighter\"},{\"id\":\"d1c8a58b-d95b-4202-83ff-69459b9ef45d\",\"value\":\"First Mate\",\"description\":\"First Mate\"},{\"id\":\"0ca0eda2-f3ca-4124-8437-6bb8c51e2ef3\",\"value\":\"Fishmonger\",\"description\":\"Fishmonger\"},{\"id\":\"45c744dd-5aea-4274-b610-758d4cff7f34\",\"value\":\"Fisherman\",\"description\":\"Fisherman\"},{\"id\":\"1a1dfe54-4a8b-44b1-a660-3311516275ab\",\"value\":\"Fitter\",\"description\":\"Fitter\"},{\"id\":\"9c433ba9-855e-424c-b7d2-44e5b7808764\",\"value\":\"Flavorist\",\"description\":\"Flavorist\"},{\"id\":\"4088e59c-7296-4871-8b11-23d404dd37a7\",\"value\":\"Fletcher\",\"description\":\"Fletcher\"},{\"id\":\"d5f5213a-c41c-4511-8caf-f48d0840ffa6\",\"value\":\"Flight Attendant\",\"description\":\"Flight Attendant\"},{\"id\":\"6e5ce8df-2961-4406-953c-03289bb59c1a\",\"value\":\"Flight\",\"description\":\"Flight\"},{\"id\":\"1f3cda03-17d0-48d0-b2ee-88ede87a10a9\",\"value\":\"Florist\",\"description\":\"Florist\"},{\"id\":\"8a52506b-099e-4851-b58d-601796046397\",\"value\":\"Flautist\",\"description\":\"Flautist\"},{\"id\":\"69af6ebf-faeb-4b5b-8ea9-a74f5d02dcf0\",\"value\":\"Food Critic\",\"description\":\"Food Critic\"},{\"id\":\"5767048e-eb71-4202-9fb9-ef8b3fd37591\",\"value\":\"Footballer\",\"description\":\"Footballer\"},{\"id\":\"260f7c89-7448-4deb-9788-f3617b4a5a72\",\"value\":\"Forester\",\"description\":\"Forester\"},{\"id\":\"3bd3fc1e-a975-46f9-a2a3-b5e6b1658715\",\"value\":\"Fortune Teller\",\"description\":\"Fortune Teller\"},{\"id\":\"3bda08c6-5dce-44aa-b4d0-ea23e3221109\",\"value\":\"Funeral Director\",\"description\":\"Funeral Director\"},{\"id\":\"6407d3cb-f178-4cdb-98da-bb4076beb99e\",\"value\":\"Gamekeeper\",\"description\":\"Gamekeeper\"},{\"id\":\"7ba2e7bb-4ebe-45e6-b227-427cad2e90a4\",\"value\":\"Game Designer\",\"description\":\"Game Designer\"},{\"id\":\"85ba2ce4-a717-4328-b8a5-732fb5f7a051\",\"value\":\"Game Warden\",\"description\":\"Game Warden\"},{\"id\":\"ae949797-581f-47df-a171-9ba0184ecc6b\",\"value\":\"Gardener\",\"description\":\"Gardener\"},{\"id\":\"a56487f9-f3ec-4358-865f-97c6f272a328\",\"value\":\"Gemcutter\",\"description\":\"Gemcutter\"},{\"id\":\"739434d9-5f6e-4211-87f0-36af1691f3bb\",\"value\":\"Genealogist\",\"description\":\"Genealogist\"},{\"id\":\"20ac98fe-a59a-4495-8bf9-09c11a1734b2\",\"value\":\"General\",\"description\":\"General\"},{\"id\":\"ab33fe54-fb21-4d70-b61c-b398b79b826d\",\"value\":\"Geologist\",\"description\":\"Geologist\"},{\"id\":\"7d47de3d-e8a6-40a1-9b0d-f451b0f22819\",\"value\":\"Goldsmith\",\"description\":\"Goldsmith\"},{\"id\":\"bc754144-c193-40b0-8245-514bbf54707a\",\"value\":\"Government Agent\",\"description\":\"Government Agent\"},{\"id\":\"e483437e-39e0-4ab8-827d-21488f6ea984\",\"value\":\"Governor\",\"description\":\"Governor\"},{\"id\":\"7f50769a-24a5-438d-872f-9e7031a086bb\",\"value\":\"Graphic Designer\",\"description\":\"Graphic Designer\"},{\"id\":\"e45d2f92-4ba9-4533-a551-bad0c4cc5262\",\"value\":\"Gravedigger\",\"description\":\"Gravedigger\"},{\"id\":\"effb223a-043d-464c-aeda-27a5194dce1e\",\"value\":\"Greengrocer\",\"description\":\"Greengrocer\"},{\"id\":\"aad75e94-4366-4093-b4d4-ccef66b0dc3d\",\"value\":\"Grocer\",\"description\":\"Grocer\"},{\"id\":\"b19c0290-3fe3-49a5-a559-3d1e9e6f9ea7\",\"value\":\"Guide\",\"description\":\"Guide\"},{\"id\":\"5dc80caf-154c-4450-80ee-7fbd2fdfd578\",\"value\":\"Guitarist\",\"description\":\"Guitarist\"},{\"id\":\"e88fbe8b-ff8e-4ba0-9f0c-f778a128029d\",\"value\":\"Gunsmith\",\"description\":\"Gunsmith\"},{\"id\":\"1108c7ca-39a8-422f-b253-795e59de5529\",\"value\":\"Hairdresser\",\"description\":\"Hairdresser\"},{\"id\":\"b002452a-e8c1-4c1b-b2bb-1b35abfb599e\",\"value\":\"Hairstylist\",\"description\":\"Hairstylist\"},{\"id\":\"9284a3c9-9daf-4225-a112-e981730d09e6\",\"value\":\"Handyman\",\"description\":\"Handyman\"},{\"id\":\"775c468c-f173-4b40-bc6f-9b0c3bae1f51\",\"value\":\"Harbourmaster\",\"description\":\"Harbourmaster\"},{\"id\":\"0d9bc5f1-a9c9-45fd-80a9-a6e067810b14\",\"value\":\"Harpist\",\"description\":\"Harpist\"},{\"id\":\"70fa0ee7-37f8-4cff-8923-87c08cba55ae\",\"value\":\"Hatter\",\"description\":\"Hatter\"},{\"id\":\"3cc846b8-e138-4f25-b91d-860bbf4aa867\",\"value\":\"Historian\",\"description\":\"Historian\"},{\"id\":\"603d1253-ffe2-4381-9593-9ccfc0056eb6\",\"value\":\"Homeopath\",\"description\":\"Homeopath\"},{\"id\":\"5a9e085c-b280-4574-a50e-40d1d759fceb\",\"value\":\"Hotel Manager\",\"description\":\"Hotel Manager\"},{\"id\":\"2aa9ec11-a6c2-46f7-b69a-b0dd61df55cf\",\"value\":\"Housekeeper\",\"description\":\"Housekeeper\"},{\"id\":\"b66afbd9-2952-42ed-8886-5853f5574d3e\",\"value\":\"Housewift\",\"description\":\"Housewift\"},{\"id\":\"628110d0-ece1-44f6-8542-c45cb6bfed7b\",\"value\":\"Illuminator\",\"description\":\"Illuminator\"},{\"id\":\"6246cced-0de8-4c03-b73f-5b383eb14233\",\"value\":\"Illusionist\",\"description\":\"Illusionist\"},{\"id\":\"f5004a59-eb7e-4adb-b25f-415bcb5725cf\",\"value\":\"Illustrator\",\"description\":\"Illustrator\"},{\"id\":\"7d3d8180-49c3-48c2-b632-4f590b3d2d0e\",\"value\":\"Image Consultant\",\"description\":\"Image Consultant\"},{\"id\":\"0cfb7b8c-598d-49b7-8892-3b8cd6fa3f5c\",\"value\":\"Importer\",\"description\":\"Importer\"},{\"id\":\"212eec62-1470-40a3-8380-cf40d34828fe\",\"value\":\"Industrial Engineer\",\"description\":\"Industrial Engineer\"},{\"id\":\"b092717e-8a5f-4e19-a774-c35d69491b4b\",\"value\":\"Industrialist\",\"description\":\"Industrialist\"},{\"id\":\"b43f7ea9-00ff-4868-b821-8bd217b53208\",\"value\":\"Information Technologist\",\"description\":\"Information Technologist\"},{\"id\":\"4e6733d3-ec9c-463c-b566-dbe36f0674e1\",\"value\":\"Inker\",\"description\":\"Inker\"},{\"id\":\"7a762326-8d0b-40f4-8365-f677212fbd7e\",\"value\":\"Innkeeper\",\"description\":\"Innkeeper\"},{\"id\":\"05770f05-1888-4184-b87e-0cfe5cb820be\",\"value\":\"Instructor\",\"description\":\"Instructor\"},{\"id\":\"0f517a66-a29f-405c-868b-e834585ac3b0\",\"value\":\"Interior Designer\",\"description\":\"Interior Designer\"},{\"id\":\"d8493a6a-e64b-4f6d-a476-6aac091f5bf5\",\"value\":\"Interpreter\",\"description\":\"Interpreter\"},{\"id\":\"86088801-a2a9-4267-a0ec-6537211b7271\",\"value\":\"Interrogator\",\"description\":\"Interrogator\"},{\"id\":\"3f036ea3-bd3a-44ad-b3fa-ec177b49020c\",\"value\":\"Inventor\",\"description\":\"Inventor\"},{\"id\":\"dccac7b9-172c-4836-8b18-07ef18c0c419\",\"value\":\"Investigator\",\"description\":\"Investigator\"},{\"id\":\"983d4785-fb18-460a-8711-d5529c308cda\",\"value\":\"Investment Banker\",\"description\":\"Investment Banker\"},{\"id\":\"1f1e2a94-45a7-4aef-a441-0aee7dd39d2a\",\"value\":\"Investment Broker\",\"description\":\"Investment Broker\"},{\"id\":\"8a2bd9f6-8b9a-4737-ad82-db1bb3f73936\",\"value\":\"Ironmonger\",\"description\":\"Ironmonger\"},{\"id\":\"d9e9bd2a-c193-4928-aef0-69985a0f4705\",\"value\":\"Ironmaster\",\"description\":\"Ironmaster\"},{\"id\":\"9f554f9d-5547-4cd0-9fbc-259955b187e0\",\"value\":\"Ironworker\",\"description\":\"Ironworker\"},{\"id\":\"9d1451ae-f142-4752-b5fb-460f965cab70\",\"value\":\"Jailer\",\"description\":\"Jailer\"},{\"id\":\"22a4b6af-4c87-4f0a-9e4f-cbe2d38e586c\",\"value\":\"Janitor\",\"description\":\"Janitor\"},{\"id\":\"ba3c0db8-aedb-478f-9c0c-d341868953c8\",\"value\":\"Jeweller\",\"description\":\"Jeweller\"},{\"id\":\"9ea0fbb4-c27d-430a-95e7-434ff20f456f\",\"value\":\"Journalist\",\"description\":\"Journalist\"},{\"id\":\"6e5bf42a-6fb6-4535-b825-a20dcb6fd4ee\",\"value\":\"Jurist\",\"description\":\"Jurist\"},{\"id\":\"ca6928a8-b569-42de-a89c-b9dad71f2df5\",\"value\":\"Judge\",\"description\":\"Judge\"},{\"id\":\"16d70247-8796-4646-8a85-63353183e445\",\"value\":\"Jockey\",\"description\":\"Jockey\"},{\"id\":\"e3fdd635-4911-4c40-aa40-e2ef13e64865\",\"value\":\"Joggler\",\"description\":\"Joggler\"},{\"id\":\"7194b48c-9d07-4d2c-bd3a-50a0f5070cb3\",\"value\":\"Karate Master\",\"description\":\"Karate Master\"},{\"id\":\"5238eeab-e7b9-4648-9d32-2f8fef8cb920\",\"value\":\"Kinesiologist\",\"description\":\"Kinesiologist\"},{\"id\":\"d3de44c8-ab2a-4ec2-93a7-aad1e2afe681\",\"value\":\"Kickboxer\",\"description\":\"Kickboxer\"},{\"id\":\"e645ac8f-87da-43ec-8f41-8ba39c38ede2\",\"value\":\"King\",\"description\":\"King\"},{\"id\":\"4685cfc8-8c1d-4646-8fb2-c8e5ce964b5f\",\"value\":\"kindergarten Teacher\",\"description\":\"kindergarten Teacher\"},{\"id\":\"9cdd3d1b-75bb-48b8-8473-d9b433e01673\",\"value\":\"Loan Officer\",\"description\":\"Loan Officer\"},{\"id\":\"31fb771c-94ea-4a0e-a2f8-e2c1dd27451e\",\"value\":\"Laborer\",\"description\":\"Laborer\"},{\"id\":\"d3692c92-6202-4470-b9a1-6017e2f3a8a9\",\"value\":\"Landlord\",\"description\":\"Landlord\"},{\"id\":\"5c909e6f-9ae2-4c0b-8af2-18c221691081\",\"value\":\"Laundress\",\"description\":\"Laundress\"},{\"id\":\"7d722c35-a8c8-41c3-960c-01f396b9524c\",\"value\":\"Law Enforcement Agent\",\"description\":\"Law Enforcement Agent\"},{\"id\":\"59f4949e-ef8a-4f07-b0ed-8388a7b83844\",\"value\":\"Lawyer\",\"description\":\"Lawyer\"},{\"id\":\"44ee1ab2-8028-48a7-8c87-36f804a14a9e\",\"value\":\"Leadworker\",\"description\":\"Leadworker\"},{\"id\":\"b6284200-c55c-4463-9e3a-35ef1c92495a\",\"value\":\"Leatherer\",\"description\":\"Leatherer\"},{\"id\":\"b55b29fe-b08b-48da-aced-260028e6925f\",\"value\":\"Leather Worker\",\"description\":\"Leather Worker\"},{\"id\":\"1dda3871-52c5-46c0-bba9-429efadbb1f6\",\"value\":\"Lecturer\",\"description\":\"Lecturer\"},{\"id\":\"ada7df57-8a5e-4295-b165-d791c1115252\",\"value\":\"Level Designer\",\"description\":\"Level Designer\"},{\"id\":\"befa35c2-bc05-4d0d-b430-4df70bf0f59c\",\"value\":\"Librarianship\",\"description\":\"Librarianship\"},{\"id\":\"af6618f2-ce50-4063-9f5d-593209e631c5\",\"value\":\"Librettist\",\"description\":\"Librettist\"},{\"id\":\"e3bb2119-6204-430a-acde-8be9e061aeb9\",\"value\":\"Lifeguard\",\"description\":\"Lifeguard\"},{\"id\":\"e23304cc-6fa2-4f0c-b97f-cf5130de4f83\",\"value\":\"Lighthouse Keeper\",\"description\":\"Lighthouse Keeper\"},{\"id\":\"7234cb48-d164-4b8c-a344-f8376cc3eead\",\"value\":\"Lighting Technician\",\"description\":\"Lighting Technician\"},{\"id\":\"a6ba1fa4-1558-4f77-b5f6-d106a7873067\",\"value\":\"Lineman\",\"description\":\"Lineman\"},{\"id\":\"8a08caf9-b11f-403a-9ed6-9f0876cf6589\",\"value\":\"Linguist\",\"description\":\"Linguist\"},{\"id\":\"afa8400a-4f08-4ac9-b16a-f183e7600e96\",\"value\":\"Loan officer\",\"description\":\"Loan officer\"},{\"id\":\"367b9b31-12ac-4bf6-aacc-b03e486d84f6\",\"value\":\"Lobbyist\",\"description\":\"Lobbyist\"},{\"id\":\"e052f1ac-07ec-4304-ae1b-43592837a956\",\"value\":\"Locksmith\",\"description\":\"Locksmith\"},{\"id\":\"81df1d00-2d50-44ad-bdc7-13b777e2b9fc\",\"value\":\"Lumberjack\",\"description\":\"Lumberjack\"},{\"id\":\"b42a1677-44f2-4877-87d8-db79d886d6be\",\"value\":\"Lyricist\",\"description\":\"Lyricist\"},{\"id\":\"12b6c876-ea8e-4e7b-96bf-b425f00ccac4\",\"value\":\"Magistrate\",\"description\":\"Magistrate\"},{\"id\":\"17beed46-687a-4073-b6c0-3ef3bbb41f5a\",\"value\":\"Magnate\",\"description\":\"Magnate\"},{\"id\":\"7ee2e7ee-de07-4d9e-9325-6dd0ab1d4edd\",\"value\":\"Maid\",\"description\":\"Maid\"},{\"id\":\"3bb83f95-ca62-4bdb-8149-ffc6ca31821f\",\"value\":\"Mailman or Mail carrier\",\"description\":\"Mailman or Mail carrier\"},{\"id\":\"205d5384-0403-43e5-8aae-ac24776681ce\",\"value\":\"Make-up Artist\",\"description\":\"Make-up Artist\"},{\"id\":\"34ef486b-8dfb-4b36-89e0-61b3dc7b5def\",\"value\":\"Management Consultant\",\"description\":\"Management Consultant\"},{\"id\":\"541593aa-b706-4f22-8fa7-89a7147452fd\",\"value\":\"Manager\",\"description\":\"Manager\"},{\"id\":\"5c4faadc-80a5-476a-b62d-9e6eccccda64\",\"value\":\"Manicurist\",\"description\":\"Manicurist\"},{\"id\":\"1680a908-37f5-4c8c-9257-f7eb2a8bb217\",\"value\":\"Manufacturer\",\"description\":\"Manufacturer\"},{\"id\":\"0ae58170-772f-48f3-9c72-49e50a72a8b4\",\"value\":\"Marine\",\"description\":\"Marine\"},{\"id\":\"7af9f5ee-5fe3-493c-88ac-64170094c3da\",\"value\":\"Marine Biologist\",\"description\":\"Marine Biologist\"},{\"id\":\"902e97c1-6317-4faf-8d93-5f0e34d83d1a\",\"value\":\"Market Gardener\",\"description\":\"Market Gardener\"},{\"id\":\"9e3a0383-cd73-42e3-836c-c694d21a9a3b\",\"value\":\"Martial Artist\",\"description\":\"Martial Artist\"},{\"id\":\"c5e8dff9-5df7-448a-a2ed-32d824c91d6f\",\"value\":\"Mason\",\"description\":\"Mason\"},{\"id\":\"b27044f9-c3d4-4f76-a395-710dcffc5169\",\"value\":\"Massage Therapist\",\"description\":\"Massage Therapist\"},{\"id\":\"6978c2bc-170a-4e65-99dd-7330d140a104\",\"value\":\"Matador\",\"description\":\"Matador\"},{\"id\":\"b6b0c895-a8c2-4a1e-b0d1-4752f051fc6f\",\"value\":\"Mathematician\",\"description\":\"Mathematician\"},{\"id\":\"755f4f33-e625-4fa5-90db-0551726d1fe4\",\"value\":\"Mechanic\",\"description\":\"Mechanic\"},{\"id\":\"d25cc802-212a-4059-af78-7e21dd2f7447\",\"value\":\"Mechanical Engineer\",\"description\":\"Mechanical Engineer\"},{\"id\":\"52cccafd-64b0-4e19-9fe9-a98181b76ed2\",\"value\":\"Mechanician\",\"description\":\"Mechanician\"},{\"id\":\"795626c3-9bdf-4ceb-bc35-0ab972c4d9e9\",\"value\":\"Mediator\",\"description\":\"Mediator\"},{\"id\":\"9a28ede3-f3e3-47e3-8eb3-c838834d243c\",\"value\":\"Medic\",\"description\":\"Medic\"},{\"id\":\"f52e1aca-248c-4a74-b5dc-32c18e850e4d\",\"value\":\"Medical Biller\",\"description\":\"Medical Biller\"},{\"id\":\"b2013134-86e6-460c-89d4-a93cdeeb7b0b\",\"value\":\"Medical Laboratory Scientist\",\"description\":\"Medical Laboratory Scientist\"},{\"id\":\"b29b989a-c21c-4472-ad91-045e32c3cbc9\",\"value\":\"Medical Transcriptionist\",\"description\":\"Medical Transcriptionist\"},{\"id\":\"908fd310-8602-4e09-9d1e-5782b8338736\",\"value\":\"Mesmerist\",\"description\":\"Mesmerist\"},{\"id\":\"e0784b75-feaf-4ef0-82af-7285759bc7b9\",\"value\":\"Messenger\",\"description\":\"Messenger\"},{\"id\":\"17fd7399-1cdf-4ee7-9e9d-f377a221a3d3\",\"value\":\"Mid-wife\",\"description\":\"Mid-wife\"},{\"id\":\"17d5bdbb-327f-4531-b35a-fce8dca67534\",\"value\":\"Milkman\",\"description\":\"Milkman\"},{\"id\":\"b016ea7f-ccb8-4835-a856-01ab7cf9ac0e\",\"value\":\"Miller\",\"description\":\"Miller\"},{\"id\":\"f687b766-e310-4949-b43e-9af31dd97f19\",\"value\":\"Miner\",\"description\":\"Miner\"},{\"id\":\"f297af64-2da5-413d-b650-91d86177cce1\",\"value\":\"Missionary\",\"description\":\"Missionary\"},{\"id\":\"8c1a6556-e5ea-4db6-a5bf-ddacc25b0c42\",\"value\":\"Model\",\"description\":\"Model\"},{\"id\":\"694cad41-b677-43ed-bd4c-753e56fc91e9\",\"value\":\"Modeller\",\"description\":\"Modeller\"},{\"id\":\"6d9debcb-4ede-4bb0-a0b3-580179839e12\",\"value\":\"Moneychanger\",\"description\":\"Moneychanger\"},{\"id\":\"a05c1073-8ed9-40cd-b21f-95acb8c4b584\",\"value\":\"Moneylender\",\"description\":\"Moneylender\"},{\"id\":\"d9a7781c-3046-413f-babe-364eff06eeb4\",\"value\":\"Monk\",\"description\":\"Monk\"},{\"id\":\"adda569c-cd15-4aaa-a84e-fa25fcda04e1\",\"value\":\"Mortgage Broker\",\"description\":\"Mortgage Broker\"},{\"id\":\"a755088f-c2f9-4b8d-8071-07bd797006be\",\"value\":\"Mountaineer\",\"description\":\"Mountaineer\"},{\"id\":\"00c15302-3f28-4273-88e9-1919cfdc8c28\",\"value\":\"Muralist\",\"description\":\"Muralist\"},{\"id\":\"cf4027c9-5e0d-40c7-a225-bdfdae743fd0\",\"value\":\"Music Educator\",\"description\":\"Music Educator\"},{\"id\":\"748237d2-05fb-4ed6-80c8-6c4d94207273\",\"value\":\"Musician\",\"description\":\"Musician\"},{\"id\":\"b4876f2e-c9fe-4d7e-90f8-94840ee6c56d\",\"value\":\"Navigator\",\"description\":\"Navigator\"},{\"id\":\"5e0d31c0-50f6-412b-a046-c9c2ee98d296\",\"value\":\"Négociant\",\"description\":\"Négociant\"},{\"id\":\"19a7936f-72c9-4572-8389-c3cea01ac008\",\"value\":\"Negotiator\",\"description\":\"Negotiator\"},{\"id\":\"3e48c9e8-b9e3-4b5f-993a-98bcbe81f9ff\",\"value\":\"Netmaker\",\"description\":\"Netmaker\"},{\"id\":\"2ed0f3fb-61be-41fa-a5eb-e06adb3a4f45\",\"value\":\"Neurologist\",\"description\":\"Neurologist\"},{\"id\":\"656f261a-3ddd-4adb-8cd1-5b4d5143138a\",\"value\":\"Newscaster\",\"description\":\"Newscaster\"},{\"id\":\"c5c7f4e0-9779-4fba-9d74-f227b79c477e\",\"value\":\"Night Auditor\",\"description\":\"Night Auditor\"},{\"id\":\"5e5b8fdf-732a-4fac-b7c9-a9c4b13149e7\",\"value\":\"Nightwatchmen\",\"description\":\"Nightwatchmen\"},{\"id\":\"2ab3f70d-cbfa-41f4-a0f2-e5c9d63a2dd7\",\"value\":\"Notary\",\"description\":\"Notary\"},{\"id\":\"e73abced-9ea0-4439-9c73-fe001fc68851\",\"value\":\"Novelist\",\"description\":\"Novelist\"},{\"id\":\"799a9396-6520-46cf-956f-199027c00173\",\"value\":\"Numerologist\",\"description\":\"Numerologist\"},{\"id\":\"067a325e-0859-4f8f-97b8-681601c627b8\",\"value\":\"Numismatist\",\"description\":\"Numismatist\"},{\"id\":\"ed7e37e8-eea9-4489-87b4-d234cf9ec799\",\"value\":\"Nun\",\"description\":\"Nun\"},{\"id\":\"b7dcf9f8-67a9-4884-b7a0-12ce53173837\",\"value\":\"Nursemaid\",\"description\":\"Nursemaid\"},{\"id\":\"25dc3423-eb45-4fa4-8e2d-db0df78c375a\",\"value\":\"Nurse\",\"description\":\"Nurse\"},{\"id\":\"2c87d0e0-6fd9-42ce-bcbc-2a090d4efdc8\",\"value\":\"Nutritionist\",\"description\":\"Nutritionist\"},{\"id\":\"6269c41f-0cb6-4f53-a3c2-77f8fa6a6506\",\"value\":\"Oboist\",\"description\":\"Oboist\"},{\"id\":\"23d100bf-c854-441c-a9ca-53e7906b1bd3\",\"value\":\"Obstetrician\",\"description\":\"Obstetrician\"},{\"id\":\"3e899a69-ae41-4131-9729-6b3c88a630e5\",\"value\":\"Occupational Therapist\",\"description\":\"Occupational Therapist\"},{\"id\":\"3d43eed6-ca5f-49d8-916b-088edc787817\",\"value\":\"Odontologist\",\"description\":\"Odontologist\"},{\"id\":\"4931043f-ec80-4cd1-90ea-9febdf953a4c\",\"value\":\"Oncologist\",\"description\":\"Oncologist\"},{\"id\":\"8b4358fe-ff60-4db4-afd4-586b68883489\",\"value\":\"Ontologist\",\"description\":\"Ontologist\"},{\"id\":\"dcef785d-ddd5-4bcf-b08f-975179e29df4\",\"value\":\"Operator\",\"description\":\"Operator\"},{\"id\":\"01209833-d110-472c-a135-524284d176bb\",\"value\":\"Ophthalmologist\",\"description\":\"Ophthalmologist\"},{\"id\":\"b42a17b1-ef73-4bc0-a0a8-0c38e6ef1617\",\"value\":\"Optician\",\"description\":\"Optician\"},{\"id\":\"bf974d22-4671-4f0f-b330-f95f488518a3\",\"value\":\"Oracle\",\"description\":\"Oracle\"},{\"id\":\"3b069b66-cf87-40ec-b26f-dae99ecbf3de\",\"value\":\"Ordinary Seaman\",\"description\":\"Ordinary Seaman\"},{\"id\":\"8fb22374-298e-4be1-900d-2b17ed89d962\",\"value\":\"Organizer\",\"description\":\"Organizer\"},{\"id\":\"6c158a3a-b384-4049-bc48-72fb3076eea5\",\"value\":\"Orthodontist\",\"description\":\"Orthodontist\"},{\"id\":\"af583d85-a1b1-44bf-afb9-fc918eb56317\",\"value\":\"Ornithologist\",\"description\":\"Ornithologist\"},{\"id\":\"33e3c0f4-bd11-4a45-b303-831be84eaeb5\",\"value\":\"Ostler\",\"description\":\"Ostler\"},{\"id\":\"3455d40d-8481-4117-990e-8970b2458921\",\"value\":\"Other\",\"description\":\"Other\"},{\"id\":\"22aa13d2-f276-4e1e-bed3-5c9fb780f199\",\"value\":\"Otorhinolaryngologist\",\"description\":\"Otorhinolaryngologist\"},{\"id\":\"77ef5ce8-630e-46be-843e-45d02bb6df60\",\"value\":\"Optometrist\",\"description\":\"Optometrist\"},{\"id\":\"be4d615f-42af-4a0a-bc78-4c030e29f73e\",\"value\":\"Ocularist\",\"description\":\"Ocularist\"},{\"id\":\"a1d5c8d3-4aa3-4126-8dc6-c8b131e9f36b\",\"value\":\"Painter\",\"description\":\"Painter\"},{\"id\":\"5945b236-f5bf-4b5e-b195-57d6b25c864d\",\"value\":\"Paleontologist\",\"description\":\"Paleontologist\"},{\"id\":\"56b839f3-3f06-4787-95fe-a2754d9f596b\",\"value\":\"Paralegal\",\"description\":\"Paralegal\"},{\"id\":\"aace28be-ddc0-4e2e-b1c4-921b15c5fa42\",\"value\":\"Paramedic\",\"description\":\"Paramedic\"},{\"id\":\"b153d20b-70b3-4eda-b02c-ac2630ce0ee1\",\"value\":\"Park Ranger\",\"description\":\"Park Ranger\"},{\"id\":\"015eea80-e85b-4931-9169-a0bc315d8ecf\",\"value\":\"Parole Officer\",\"description\":\"Parole Officer\"},{\"id\":\"fa3a5267-42ce-41ce-9161-0110a9626af2\",\"value\":\"Pastor\",\"description\":\"Pastor\"},{\"id\":\"04bad626-9942-4e51-b630-ce728f4a1042\",\"value\":\"Patent Attorney\",\"description\":\"Patent Attorney\"},{\"id\":\"b2ac84e3-022d-42a9-af9c-190ea19e17d4\",\"value\":\"Patent Xxaminer\",\"description\":\"Patent Xxaminer\"},{\"id\":\"78beacc7-02bd-4827-ac75-0960ea87967e\",\"value\":\"Pathologist\",\"description\":\"Pathologist\"},{\"id\":\"22082f4e-2389-43ed-b56c-8ab47d3039fb\",\"value\":\"Pawnbroker\",\"description\":\"Pawnbroker\"},{\"id\":\"854b383f-5360-4ad2-8a2b-b309a583691a\",\"value\":\"Peddler\",\"description\":\"Peddler\"},{\"id\":\"6fec1da5-6044-4580-abd2-cc4b159ec2c3\",\"value\":\"Pediatrician\",\"description\":\"Pediatrician\"},{\"id\":\"accb2e1f-4622-48ba-b168-52f242e378c9\",\"value\":\"Pedologist\",\"description\":\"Pedologist\"},{\"id\":\"f4037d70-2d64-4985-82ce-249b02d1539c\",\"value\":\"Percussionist\",\"description\":\"Percussionist\"},{\"id\":\"db4ff48b-c761-4d65-aa6e-9d9b4999d573\",\"value\":\"Perfumer\",\"description\":\"Perfumer\"},{\"id\":\"eb441af4-40ab-439d-83a9-0173d3987458\",\"value\":\"Personal Trainer\",\"description\":\"Personal Trainer\"},{\"id\":\"531ca3f7-e4e4-4af4-9cfd-01699f36eae2\",\"value\":\"Pharmacist\",\"description\":\"Pharmacist\"},{\"id\":\"c4677728-2906-4035-a460-5fc72382578f\",\"value\":\"Philanthropist\",\"description\":\"Philanthropist\"},{\"id\":\"f6b247be-0da7-4c5c-859b-1871201e404d\",\"value\":\"Philologist\",\"description\":\"Philologist\"},{\"id\":\"171deabe-73e9-4ee1-b8a4-396b39c4a1a8\",\"value\":\"Philosopher\",\"description\":\"Philosopher\"},{\"id\":\"8dcd66a8-259c-4082-ad4b-9af9f624d798\",\"value\":\"Photographer\",\"description\":\"Photographer\"},{\"id\":\"8a05ff78-1b0d-41e3-8267-bfbec905c4f2\",\"value\":\"Physical Therapist\",\"description\":\"Physical Therapist\"},{\"id\":\"14e98400-0b76-4011-a864-6d00c9878cf2\",\"value\":\"Physician\",\"description\":\"Physician\"},{\"id\":\"60ffd790-64ce-4f78-ad43-be8857994cf1\",\"value\":\"Physician Assistant\",\"description\":\"Physician Assistant\"},{\"id\":\"5909d7a6-78a0-4163-8d28-f77f7ddccf42\",\"value\":\"Physicist\",\"description\":\"Physicist\"},{\"id\":\"5fae3ed0-c334-4203-84a4-ab266d23020c\",\"value\":\"Physiognomist\",\"description\":\"Physiognomist\"},{\"id\":\"12a737e6-cd18-483b-967a-2840a074cec2\",\"value\":\"Physiotherapist\",\"description\":\"Physiotherapist\"},{\"id\":\"ac0a464d-d269-43e5-9cba-184019d6ff45\",\"value\":\"Pianist\",\"description\":\"Pianist\"},{\"id\":\"e040070f-0bb9-418d-a46c-2dbcdf161023\",\"value\":\"Piano tuner\",\"description\":\"Piano tuner\"},{\"id\":\"1954d88c-c839-4fbb-a6c7-37ea3385f619\",\"value\":\"Pilot\",\"description\":\"Pilot\"},{\"id\":\"e85fb3f1-0507-47bf-b217-d0983950e48c\",\"value\":\"Pirate\",\"description\":\"Pirate\"},{\"id\":\"0ecc6ca6-24f0-4e9e-b0a3-6b851546daf2\",\"value\":\"Plumber\",\"description\":\"Plumber\"},{\"id\":\"4989270d-b9e0-4166-9e34-316ddd9596a5\",\"value\":\"Podiatrist\",\"description\":\"Podiatrist\"},{\"id\":\"4aa59ae8-4c02-4ccc-a1de-5730541c32aa\",\"value\":\"Poet\",\"description\":\"Poet\"},{\"id\":\"cfc44829-50c8-433b-85c3-7a0bb3382b3b\",\"value\":\"Police inspector\",\"description\":\"Police inspector\"},{\"id\":\"17c49d25-c226-4c35-aadc-253deb10aeca\",\"value\":\"Politician\",\"description\":\"Politician\"},{\"id\":\"d3431f8e-eac8-4dd1-84c4-8c93ecc8e2bb\",\"value\":\"Porter\",\"description\":\"Porter\"},{\"id\":\"7566eaad-183e-468b-8f71-1c2bb33e089f\",\"value\":\"Presenter\",\"description\":\"Presenter\"},{\"id\":\"8eda306c-ac00-4cd4-9083-5ce36610a551\",\"value\":\"President\",\"description\":\"President\"},{\"id\":\"df96e420-b455-470e-bc1b-e2cf195fc1f2\",\"value\":\"Press Officer\",\"description\":\"Press Officer\"},{\"id\":\"67da178f-5594-43ca-b197-94daa3de9a81\",\"value\":\"Priest\",\"description\":\"Priest\"},{\"id\":\"8a62bdf9-0a29-419b-bb70-c1b3d36441dd\",\"value\":\"Princess\",\"description\":\"Princess\"},{\"id\":\"66dc3be8-6cef-4c99-8ca4-e1024e58bf22\",\"value\":\"Principal\",\"description\":\"Principal\"},{\"id\":\"a1172af1-1fb4-4de2-993a-7c5dd5002b4a\",\"value\":\"Printer\",\"description\":\"Printer\"},{\"id\":\"0d29ce28-90d3-4e38-a7e2-fdc0a8c6e6b9\",\"value\":\"Prison Officer\",\"description\":\"Prison Officer\"},{\"id\":\"d2097c89-5492-4312-b4c9-e135722a0760\",\"value\":\"Private Detective\",\"description\":\"Private Detective\"},{\"id\":\"09cf4915-9f7d-4503-8c33-fd4e2798fe77\",\"value\":\"Probation Officer\",\"description\":\"Probation Officer\"},{\"id\":\"4a60e2e8-a662-40ed-a650-8acb2b4e359b\",\"value\":\"Proctologist\",\"description\":\"Proctologist\"},{\"id\":\"c39ad2e1-7179-4934-9840-a124f44e3e82\",\"value\":\"Product Designer\",\"description\":\"Product Designer\"},{\"id\":\"2098c127-9651-4fbf-8dd5-975a52237f77\",\"value\":\"Professor\",\"description\":\"Professor\"},{\"id\":\"f2f7b381-8144-4f07-a7a2-90af5ba4f680\",\"value\":\"Professional Dominant\",\"description\":\"Professional Dominant\"},{\"id\":\"6c36331d-6f5e-4928-bf07-c48f3d3acedb\",\"value\":\"Programmer\",\"description\":\"Programmer\"},{\"id\":\"6018679f-371b-46f3-9d4e-b58330b6c0ef\",\"value\":\"Project Manager\",\"description\":\"Project Manager\"},{\"id\":\"0d6754be-3395-44ac-9ef3-8da39d135a2b\",\"value\":\"Proofreader\",\"description\":\"Proofreader\"},{\"id\":\"5adb6203-9a01-4eb7-bf4d-b0934c646e58\",\"value\":\"Prostitute\",\"description\":\"Prostitute\"},{\"id\":\"8f8fd3b5-2cdb-474f-8347-598da29ac5e8\",\"value\":\"Psychiatrist\",\"description\":\"Psychiatrist\"},{\"id\":\"daa3dd7b-884d-41b3-ab82-45c92a67a673\",\"value\":\"Psychodramatist\",\"description\":\"Psychodramatist\"},{\"id\":\"6c13ace3-6118-47b4-9461-8f2d5f896928\",\"value\":\"Psychologist\",\"description\":\"Psychologist\"},{\"id\":\"661c842a-819d-4758-8999-ab337124b56f\",\"value\":\"Public Relations Officer\",\"description\":\"Public Relations Officer\"},{\"id\":\"3007097b-0827-43bd-8fa9-f0e7bd707a7e\",\"value\":\"Public Speaker\",\"description\":\"Public Speaker\"},{\"id\":\"e2de35e0-0ea9-49f2-9357-17314d145903\",\"value\":\"Publisher\",\"description\":\"Publisher\"},{\"id\":\"661a8771-839d-42e5-a6ee-ca09400dd93b\",\"value\":\"Queen Consort\",\"description\":\"Queen Consort\"},{\"id\":\"f179342b-0bb9-4d93-9f19-1083ca327f7e\",\"value\":\"Queen Regnant\",\"description\":\"Queen Regnant\"},{\"id\":\"6f38a446-4759-4c3f-b9a0-a253a5be1e92\",\"value\":\"Quilter\",\"description\":\"Quilter\"},{\"id\":\"660e6f5f-1c62-4e32-a09e-664aef650e8f\",\"value\":\"Rabbi\",\"description\":\"Rabbi\"},{\"id\":\"4c16a760-24a4-421e-8fd3-c2f0c9582a96\",\"value\":\"Radiologist\",\"description\":\"Radiologist\"},{\"id\":\"9f7b89e6-1824-4c0d-9bcb-4e531e92bb93\",\"value\":\"Radiographer\",\"description\":\"Radiographer\"},{\"id\":\"8efb6a73-561f-497f-b0bd-1c8cc3fb89b2\",\"value\":\"Real Estate Broker\",\"description\":\"Real Estate Broker\"},{\"id\":\"1a16db89-cea1-416c-8ff1-3c1ef4056cad\",\"value\":\"Real Estate Investor\",\"description\":\"Real Estate Investor\"},{\"id\":\"207ea890-2ebc-40eb-ba7d-f434ce35df46\",\"value\":\"Real Estate Developer\",\"description\":\"Real Estate Developer\"},{\"id\":\"ce670aa4-ea71-494e-a446-1d8e726d9ea0\",\"value\":\"Receptionist\",\"description\":\"Receptionist\"},{\"id\":\"5354fcbf-11e7-417d-9d45-891fc2c9f15e\",\"value\":\"Record Producer\",\"description\":\"Record Producer\"},{\"id\":\"fa4fcdb0-c355-41c7-9aaf-e7e189d9bc4b\",\"value\":\"Referee\",\"description\":\"Referee\"},{\"id\":\"5560edd3-f569-4aa8-a1e0-d20f359a902e\",\"value\":\"Refuse Collector\",\"description\":\"Refuse Collector\"},{\"id\":\"37d4c503-8fa8-43f4-a8a6-eec5ec1c85e4\",\"value\":\"Registrar\",\"description\":\"Registrar\"},{\"id\":\"774a72b2-9da3-4d4a-bd7e-f5e7e0594aa4\",\"value\":\"Registered Nurse\",\"description\":\"Registered Nurse\"},{\"id\":\"0209bf63-600a-4d3d-af34-71b6631ebf68\",\"value\":\"Reporter\",\"description\":\"Reporter\"},{\"id\":\"801a7820-c6ba-43a9-be82-e2dbd38e34c3\",\"value\":\"Researcher\",\"description\":\"Researcher\"},{\"id\":\"6b05ffcc-1bda-46bd-951c-5f2667d90731\",\"value\":\"Respiratory Therapist\",\"description\":\"Respiratory Therapist\"},{\"id\":\"4ed6325b-f303-4bc3-9d93-0806503bc9f1\",\"value\":\"Restaurateur\",\"description\":\"Restaurateur\"},{\"id\":\"b0eaccba-130c-4ba3-abc2-f7e5090e3b19\",\"value\":\"Retailer\",\"description\":\"Retailer\"},{\"id\":\"ac4d3edd-efe0-4fbc-a4c5-955f959641be\",\"value\":\"Rubbish Collector\",\"description\":\"Rubbish Collector\"},{\"id\":\"71fe7569-e05b-48a7-9c8a-9fdd714ac351\",\"value\":\"Sexologist\",\"description\":\"Sexologist\"},{\"id\":\"6a40fb69-9269-4596-ab75-f16b9e442fa6\",\"value\":\"Sailmaker\",\"description\":\"Sailmaker\"},{\"id\":\"0b1441e2-0d27-43ee-8c12-3ac3425c61b2\",\"value\":\"Sailor\",\"description\":\"Sailor\"},{\"id\":\"5e59cc3b-ce25-4fb1-9966-4bb32981e9d8\",\"value\":\"Salesmen\",\"description\":\"Salesmen\"},{\"id\":\"71cda81c-22f0-4d11-ab85-710997eee8ec\",\"value\":\"Sanitation worker\",\"description\":\"Sanitation worker\"},{\"id\":\"c24b603c-bc81-41d9-881b-90061378d187\",\"value\":\"Saucier\",\"description\":\"Saucier\"},{\"id\":\"03223e27-36a7-4b53-962b-5346cd7f057b\",\"value\":\"Saxophonist\",\"description\":\"Saxophonist\"},{\"id\":\"7f8ce946-1f63-4586-b599-4921a5489742\",\"value\":\"Scientist\",\"description\":\"Scientist\"},{\"id\":\"959191e1-f6e6-4905-aa76-c702de9290eb\",\"value\":\"School Superintendent\",\"description\":\"School Superintendent\"},{\"id\":\"6a4388fc-33c7-4c08-9d55-ba6d47624c3a\",\"value\":\"Scout\",\"description\":\"Scout\"},{\"id\":\"b3dd7790-6c8f-44bd-9e6a-2c394d75c109\",\"value\":\"Screenwriter\",\"description\":\"Screenwriter\"},{\"id\":\"a5f64817-a1d6-4809-9fab-63cc849f2a6a\",\"value\":\"Scribe\",\"description\":\"Scribe\"},{\"id\":\"24d19350-4cfb-481c-98ab-76b28b6ffe6a\",\"value\":\"Seamstress\",\"description\":\"Seamstress\"},{\"id\":\"906c7d1c-b248-409e-bce2-3570447c679a\",\"value\":\"Second Mate\",\"description\":\"Second Mate\"},{\"id\":\"c70013ef-61b2-485a-a402-bca388fe70a5\",\"value\":\"Secret Service Agent\",\"description\":\"Secret Service Agent\"},{\"id\":\"9584b77e-8582-4b11-a729-a035f38df86c\",\"value\":\"Secretary General\",\"description\":\"Secretary General\"},{\"id\":\"6d42c4e9-2051-4f22-a6fb-c1ef2158b95f\",\"value\":\"Security Guard\",\"description\":\"Security Guard\"},{\"id\":\"55122c83-e33c-43ff-96c0-c7cc35a2e69b\",\"value\":\"Senator\",\"description\":\"Senator\"},{\"id\":\"f0fba39f-e25e-49d5-ac37-e714adf5a486\",\"value\":\"Sexton\",\"description\":\"Sexton\"},{\"id\":\"95d9b8bc-54e9-48fc-89ee-ffc68cd16e9e\",\"value\":\"Sheepshearer\",\"description\":\"Sheepshearer\"},{\"id\":\"aee35c64-d057-45cc-b20c-2db162651983\",\"value\":\"Sheriff\",\"description\":\"Sheriff\"},{\"id\":\"3d7a83cc-305f-4f02-97ea-d9fe7078ba89\",\"value\":\"Sheriff Officer\",\"description\":\"Sheriff Officer\"},{\"id\":\"b70d84df-c815-429b-93a9-04a254b3f5e3\",\"value\":\"Shoemaker\",\"description\":\"Shoemaker\"},{\"id\":\"5f943ee9-c253-4c5e-b206-4361f51124b1\",\"value\":\"Shop Assistant\",\"description\":\"Shop Assistant\"},{\"id\":\"126f79f2-3de2-4ce8-8357-0346e1ae601d\",\"value\":\"Singer\",\"description\":\"Singer\"},{\"id\":\"de9c7e90-f095-4110-8881-fd51f23cc18b\",\"value\":\"Skydiver\",\"description\":\"Skydiver\"},{\"id\":\"780ed89d-ccf7-4aca-841d-c98d49a2bcfd\",\"value\":\"Sleeper\",\"description\":\"Sleeper\"},{\"id\":\"c4c78010-105e-4dc0-afc7-dcfa28d65f12\",\"value\":\"Sleuth\",\"description\":\"Sleuth\"},{\"id\":\"93cf4530-9b09-4739-827d-bfffb6c206b4\",\"value\":\"Social Worker\",\"description\":\"Social Worker\"},{\"id\":\"2b27590a-424f-4a9b-8271-06ef2f1bab5c\",\"value\":\"Socialite\",\"description\":\"Socialite\"},{\"id\":\"919eea6c-4460-417c-b889-6a1c41104b96\",\"value\":\"Software Engineer\",\"description\":\"Software Engineer\"},{\"id\":\"572b7ebe-0cb7-4d5b-b9fa-791f706e84fc\",\"value\":\"Soil Scientist\",\"description\":\"Soil Scientist\"},{\"id\":\"e2683d17-b759-42fc-a07d-5f499a184bae\",\"value\":\"Soldier\",\"description\":\"Soldier\"},{\"id\":\"a6cd7e02-cc64-47c5-a2c0-2c1965c601e1\",\"value\":\"Solicitor\",\"description\":\"Solicitor\"},{\"id\":\"ade958dd-a175-41d5-9938-b28af359cc4c\",\"value\":\"Sommelier\",\"description\":\"Sommelier\"},{\"id\":\"2394fc87-a40a-4137-9735-a5e9e2c5b634\",\"value\":\"Sonographer\",\"description\":\"Sonographer\"},{\"id\":\"1e8de8c0-e540-4f60-8ce1-4450006e6e73\",\"value\":\"Sound Engineer\",\"description\":\"Sound Engineer\"},{\"id\":\"af30164d-8196-424f-b7bb-6928c3b314d7\",\"value\":\"Special Agent\",\"description\":\"Special Agent\"},{\"id\":\"65383a3a-c6a7-4d5e-8cab-ae44eaabd820\",\"value\":\"Speech Therapist\",\"description\":\"Speech Therapist\"},{\"id\":\"8a0e75f6-7052-414d-b4a5-c75235ca627d\",\"value\":\"Sportsman\",\"description\":\"Sportsman\"},{\"id\":\"cb1d2f32-5744-48e1-8393-9fda6d34ea2d\",\"value\":\"Spy\",\"description\":\"Spy\"},{\"id\":\"e1ef1d32-3c9c-4d68-ae89-429a58c8fa57\",\"value\":\"Statistician\",\"description\":\"Statistician\"},{\"id\":\"51014aac-5c36-4a04-b179-6a91cdb494a8\",\"value\":\"Street Artist\",\"description\":\"Street Artist\"},{\"id\":\"1c601d6b-0110-4ec3-b3dd-d28f00089c52\",\"value\":\"Street Musician\",\"description\":\"Street Musician\"},{\"id\":\"4f8decd3-8688-4f34-8834-be763f685475\",\"value\":\"Stevedore\",\"description\":\"Stevedore\"},{\"id\":\"aed9f352-f731-48e4-bb11-af389311600b\",\"value\":\"Street Sweeper\",\"description\":\"Street Sweeper\"},{\"id\":\"ed91abd0-5f27-4d75-acd3-e0c41c74cb2a\",\"value\":\"Street Vendor\",\"description\":\"Street Vendor\"},{\"id\":\"5722a82d-3df3-45ee-990f-79bfa3f4a68c\",\"value\":\"Structural Engineers\",\"description\":\"Structural Engineers\"},{\"id\":\"25e9dadc-80b1-480d-bf7e-9c302bced8ff\",\"value\":\"Stunt Double\",\"description\":\"Stunt Double\"},{\"id\":\"b46eedd5-1105-44b4-941c-f413c78594e2\",\"value\":\"Stunt Performer\",\"description\":\"Stunt Performer\"},{\"id\":\"c3d007dc-9efd-4c2e-90d4-ac12cb653a7c\",\"value\":\"Surgeon\",\"description\":\"Surgeon\"},{\"id\":\"821ee1dc-8d0b-4fba-8eeb-ff7a80a87741\",\"value\":\"Supervisor\",\"description\":\"Supervisor\"},{\"id\":\"5ee02be9-0e46-4ffb-ba6d-533967f78c60\",\"value\":\"Surveyor\",\"description\":\"Surveyor\"},{\"id\":\"b08d2cd1-2702-4b01-b3fa-ee7e3f1ee6ab\",\"value\":\"Swimmer\",\"description\":\"Swimmer\"},{\"id\":\"81d333d5-4a9b-45b8-9158-7e5c429994d7\",\"value\":\"Switchboard Operator\",\"description\":\"Switchboard Operator\"},{\"id\":\"6f902cfd-8669-4f5e-93b3-291cd0a24ac8\",\"value\":\"System Administrator\",\"description\":\"System Administrator\"},{\"id\":\"9239fd7e-df41-47a2-9912-3dc16bf98db3\",\"value\":\"Systems Analyst\",\"description\":\"Systems Analyst\"},{\"id\":\"e5359ce4-71f5-461e-8854-af56e6ccdea7\",\"value\":\"Student\",\"description\":\"Student\"},{\"id\":\"4d594d71-f1ec-496e-aeae-8923b65d19fe\",\"value\":\"Tailor\",\"description\":\"Tailor\"},{\"id\":\"3c7e8f14-e7bd-4b5d-a905-94a6bc5e5910\",\"value\":\"Tanner\",\"description\":\"Tanner\"},{\"id\":\"4b94832e-de48-48b8-a864-bf56a11b9f68\",\"value\":\"Tapicer\",\"description\":\"Tapicer\"},{\"id\":\"636e3fc8-0b9e-4bc2-821f-be360be5cc11\",\"value\":\"Tax Collector\",\"description\":\"Tax Collector\"},{\"id\":\"0a2c9756-2769-46f8-b218-3af1ac8fa4fd\",\"value\":\"Tax Lawyer\",\"description\":\"Tax Lawyer\"},{\"id\":\"28693bab-f29f-482c-9228-1803421b6e95\",\"value\":\"Taxidermist\",\"description\":\"Taxidermist\"},{\"id\":\"1a70d48d-da29-4b4a-86b9-b1da05ad35f8\",\"value\":\"Taxicab Driver\",\"description\":\"Taxicab Driver\"},{\"id\":\"17337fe8-57c3-449f-af62-c1fa4d2b045d\",\"value\":\"Taxonomist\",\"description\":\"Taxonomist\"},{\"id\":\"7f60188e-9b91-4222-b86d-819c5401e421\",\"value\":\"Tea Lady\",\"description\":\"Tea Lady\"},{\"id\":\"18881df7-2fb2-489b-bac3-dfd5ec1989c5\",\"value\":\"Teacher\",\"description\":\"Teacher\"},{\"id\":\"dda72f63-a26a-47f2-a508-46af2e0079e7\",\"value\":\"Technician\",\"description\":\"Technician\"},{\"id\":\"9257faa3-1dc1-450a-aa7a-e6014e84a619\",\"value\":\"Technologist\",\"description\":\"Technologist\"},{\"id\":\"fa89d104-97da-4f2e-8afa-fd35b8f13a9b\",\"value\":\"Technical Writer\",\"description\":\"Technical Writer\"},{\"id\":\"c0a3f8a7-ad9a-4633-b89a-6d7275b82f15\",\"value\":\"Telegraphist\",\"description\":\"Telegraphist\"},{\"id\":\"4e3c6caa-ea4b-4a6c-9c38-63dfa79eb776\",\"value\":\"Telephone Operator\",\"description\":\"Telephone Operator\"},{\"id\":\"37f00e95-e366-4cf3-8660-c1dc7c01496f\",\"value\":\"Tennis Player\",\"description\":\"Tennis Player\"},{\"id\":\"17024ebd-abf6-4d7c-bb39-cf20aa1cf2b6\",\"value\":\"Terminator\",\"description\":\"Terminator\"},{\"id\":\"ef5de01b-4c96-44da-866e-e553ce17e4cf\",\"value\":\"Test Developer\",\"description\":\"Test Developer\"},{\"id\":\"f747924a-14f6-43ed-bffd-f01e379be527\",\"value\":\"Test Pilot\",\"description\":\"Test Pilot\"},{\"id\":\"ee6f47e1-bcb4-46c6-833c-79d53e565927\",\"value\":\"Thatcher\",\"description\":\"Thatcher\"},{\"id\":\"1d5b9861-9a5d-4d2a-9b97-7ebb66c4663e\",\"value\":\"Theatre Director\",\"description\":\"Theatre Director\"},{\"id\":\"92857d38-311d-40d0-908d-217925458bbd\",\"value\":\"Therapist\",\"description\":\"Therapist\"},{\"id\":\"805a1d2e-56eb-4183-86f3-cfb84db38c3b\",\"value\":\"Thimbler\",\"description\":\"Thimbler\"},{\"id\":\"01205d65-c95c-45a4-a054-ffff2aedd0d6\",\"value\":\"Tiler\",\"description\":\"Tiler\"},{\"id\":\"9932634e-4fd2-49be-a40c-7634b98d57bc\",\"value\":\"Toolmaker\",\"description\":\"Toolmaker\"},{\"id\":\"6d347940-378b-400e-ad26-a201971f1962\",\"value\":\"Trademark Attorney\",\"description\":\"Trademark Attorney\"},{\"id\":\"a5ae25fe-ac49-4ab3-9067-71892a61efe9\",\"value\":\"Trader\",\"description\":\"Trader\"},{\"id\":\"e117b7de-83dc-40b3-846d-3a74cc05ee3b\",\"value\":\"Tradesman\",\"description\":\"Tradesman\"},{\"id\":\"5b25a80e-395a-4355-90dd-110aebc7ac71\",\"value\":\"Trainer\",\"description\":\"Trainer\"},{\"id\":\"d7964265-21b7-4dd1-af31-ca424295fb54\",\"value\":\"Transit Planner\",\"description\":\"Transit Planner\"},{\"id\":\"dd2a3b7f-5b1c-4025-b791-ac72dc0b580b\",\"value\":\"Translator\",\"description\":\"Translator\"},{\"id\":\"745fab3b-8f08-4e92-aaf9-db488bf126aa\",\"value\":\"Treasurer\",\"description\":\"Treasurer\"},{\"id\":\"18b830a3-e975-4a27-ad19-a9277ea6553a\",\"value\":\"Truck Driver\",\"description\":\"Truck Driver\"},{\"id\":\"1bffdfe3-6f4e-416c-9650-3e0328c89f28\",\"value\":\"Turner\",\"description\":\"Turner\"},{\"id\":\"5a4a2bbe-cc96-4052-8d11-4506574bfd47\",\"value\":\"Tutor\",\"description\":\"Tutor\"},{\"id\":\"a9b156a7-ca3d-4f35-9003-83d25a41f60e\",\"value\":\"Tyler\",\"description\":\"Tyler\"},{\"id\":\"fb592465-f834-4a07-9cf2-4f90ba2229b9\",\"value\":\"Typist\",\"description\":\"Typist\"},{\"id\":\"7b3764e4-6cb3-453e-ab77-eff74dd6e14f\",\"value\":\"Undertaker\",\"description\":\"Undertaker\"},{\"id\":\"16dcc41c-8e90-4fd7-bbf7-f5ee3b8283b5\",\"value\":\"Ufologist\",\"description\":\"Ufologist\"},{\"id\":\"fbb5af8a-35e1-4c4f-96eb-835f85017d3f\",\"value\":\"Undercover Agent\",\"description\":\"Undercover Agent\"},{\"id\":\"2246f99f-fb8d-4973-9251-d4fde5ecdba2\",\"value\":\"Underwriter\",\"description\":\"Underwriter\"},{\"id\":\"70356d60-fbd1-49bb-8f61-023c4a5d94fd\",\"value\":\"Upholsterer\",\"description\":\"Upholsterer\"},{\"id\":\"c10a58cc-de5e-49b0-b847-e42faa64f1d0\",\"value\":\"Urologist\",\"description\":\"Urologist\"},{\"id\":\"00b35242-9504-46e1-85fd-f497fc3dae08\",\"value\":\"Usher\",\"description\":\"Usher\"},{\"id\":\"cb5d7e58-4d88-49e4-bda3-006ad130a74b\",\"value\":\"Underwear Model\",\"description\":\"Underwear Model\"},{\"id\":\"da4ae4c1-d5eb-4db7-a3bb-763592fc36e2\",\"value\":\"Unemployed\",\"description\":\"Unemployed\"},{\"id\":\"6b5cbf7b-7b1a-474d-8c1f-a7306c32c0c1\",\"value\":\"Valet\",\"description\":\"Valet\"},{\"id\":\"dc503126-a2b9-4062-ae9b-30052a418348\",\"value\":\"Verger\",\"description\":\"Verger\"},{\"id\":\"7dd99aed-8163-4f57-9977-e264f7659c29\",\"value\":\"Vibraphonist\",\"description\":\"Vibraphonist\"},{\"id\":\"95133396-8b5d-4d47-b47b-c2ce939f9668\",\"value\":\"Vicar\",\"description\":\"Vicar\"},{\"id\":\"df9c4b5b-8b21-4184-b9a6-8e3584eea92f\",\"value\":\"Video editor\",\"description\":\"Video editor\"},{\"id\":\"35314c94-5a83-4579-9f26-532a5622eda8\",\"value\":\"Video game developer\",\"description\":\"Video game developer\"},{\"id\":\"53080302-682f-4010-914a-4f23f592a553\",\"value\":\"Vintner\",\"description\":\"Vintner\"},{\"id\":\"1da50ebd-2714-4e58-ba2a-c4406740fc4e\",\"value\":\"Violinist\",\"description\":\"Violinist\"},{\"id\":\"e967478d-2c22-410a-bd34-e3e92367a6eb\",\"value\":\"Violist\",\"description\":\"Violist\"},{\"id\":\"ff96c11d-8dd7-47a5-b66b-03c3eeddd8bf\",\"value\":\"Voice Actor\",\"description\":\"Voice Actor\"},{\"id\":\"3bef8a78-d0ef-4e60-ac7d-7fadbbb00bbd\",\"value\":\"Watchmaker\",\"description\":\"Watchmaker\"},{\"id\":\"752519a4-f4fd-4e18-bad9-8aaf02ac24a4\",\"value\":\"Weaponsmith\",\"description\":\"Weaponsmith\"},{\"id\":\"90e26bfb-3386-4beb-bb5d-f1964c171715\",\"value\":\"Weatherman\",\"description\":\"Weatherman\"},{\"id\":\"edc747d5-09d9-45a2-ab56-f5242fa7a523\",\"value\":\"Weaver\",\"description\":\"Weaver\"},{\"id\":\"544cd338-b370-4b1c-af62-0189cfca5ccd\",\"value\":\"Web designer\",\"description\":\"Web designer\"},{\"id\":\"d6a36b93-b41f-426e-940a-006cb7f34f49\",\"value\":\"Web developer\",\"description\":\"Web developer\"},{\"id\":\"9891e679-f7c0-468b-87ce-6c649a06e152\",\"value\":\"Wedding planner\",\"description\":\"Wedding planner\"},{\"id\":\"4ed45267-7e56-4263-ba98-b261cfb2cf92\",\"value\":\"Welder\",\"description\":\"Welder\"},{\"id\":\"ad83ead0-5823-461c-97d1-643f8db46ad7\",\"value\":\"Wet nurse\",\"description\":\"Wet nurse\"},{\"id\":\"44ef7470-2d77-4417-921e-b297ee261fee\",\"value\":\"Winemaker\",\"description\":\"Winemaker\"},{\"id\":\"daf5ccfd-6137-4a69-a01a-2e1ae32f919b\",\"value\":\"Wood cutter\",\"description\":\"Wood cutter\"},{\"id\":\"74699748-50d5-41bc-850e-437b12c7d203\",\"value\":\"Woodcarver\",\"description\":\"Woodcarver\"},{\"id\":\"73de630d-a9bf-427e-af89-1c1134b974ae\",\"value\":\"Wrangler\",\"description\":\"Wrangler\"},{\"id\":\"6521ed40-3424-4c99-ab4d-ed59a17e69cf\",\"value\":\"Writer\",\"description\":\"Writer\"},{\"id\":\"99be1722-86da-47cb-9e64-c0479a2294c4\",\"value\":\"Xylophonist\",\"description\":\"Xylophonist\"},{\"id\":\"ab3ef7dc-a532-493c-ac00-f072fb5cd00b\",\"value\":\"X-ray Operator\",\"description\":\"X-ray Operator\"},{\"id\":\"6a6f051c-cdcd-4e8c-8406-ced46dddb4b1\",\"value\":\"Yodeler\",\"description\":\"Yodeler\"},{\"id\":\"afb79c8f-d649-4ccf-9e7e-c85afb90386e\",\"value\":\"Yinder Ho\",\"description\":\"Yinder Ho\"},{\"id\":\"8eb150d0-910f-4124-afe2-5f3d52a65db0\",\"value\":\"Zookeeper\",\"description\":\"Zookeeper\"},{\"id\":\"bb522722-8e4f-4bde-a0fd-8e7bce1a9fc5\",\"value\":\"Zoologist\",\"description\":\"Zoologist\"},{\"id\":\"8863f017-a999-5c38-202d-a2e733b2a555\",\"value\":\"Not Documented\",\"description\":\"Not Documented\",\"isDefault\":true}]", null, "Occupation", 1 },
                    { new Guid("169f6c0d-8c0c-4f15-bb58-8683953a2d02"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"587b4a0c-7a23-d274-8a34-fea8c41182d4\",\"value\":\"Full Time\",\"description\":\"Full Time\"},{\"id\":\"42e37176-6126-17c1-c993-6fadb809a21d\",\"value\":\"Part Time\",\"description\":\"Part Time\"},{\"id\":\"68ec98ef-933c-1a85-233b-349605695343\",\"value\":\"Student\",\"description\":\"Student\"},{\"id\":\"e97e1ca5-7a9e-ad1c-77c3-a6009fab6105\",\"value\":\"unemployed\",\"description\":\"unemployed\"},{\"id\":\"01bcfa07-1c9e-b601-7d9a-58c3c303e3fe\",\"value\":\"Active Duty Military\",\"description\":\"Active Duty Military\"}]", null, "Employment Status", 1 },
                    { new Guid("c6cb119a-0177-4bc4-9f6f-e2c31f662b40"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"614c4fe5-975a-4d4f-84ff-0e287dfda4b6\",\"description\":\"Mother\",\"value\":\"Mother\",\"isDefault\":true},{\"id\":\"8aa08362-d5cf-4541-845f-1144cf888431\",\"description\":\"Father\",\"value\":\"Father\"},{\"id\":\"9c08f262-8ce9-460f-b07e-342a916a0457\",\"description\":\"Brother\",\"value\":\"Brother\"},{\"id\":\"6800e5a1-6189-4e84-9760-e49ee5b8de5b\",\"description\":\"Sister\",\"value\":\"Sister\"},{\"id\":\"de734063-a189-4a67-9605-ed06c2e008dd\",\"description\":\"Daughter\",\"value\":\"Daughter\"},{\"id\":\"e2f36093-c631-4a7c-84cc-f4a14491de02\",\"description\":\"Son\",\"value\":\"Son\"},{\"id\":\"cbfc8609-4020-436f-b75b-51d73da35094\",\"description\":\"Grandfather\",\"value\":\"Grandfather\"},{\"id\":\"8a7bfa35-9866-4b2b-b4be-e7fe8af24359\",\"description\":\"Grandmother\",\"value\":\"Grandmother\"},{\"id\":\"15afcc61-80e2-4ba9-8144-19787b963b0a\",\"description\":\"Uncle\",\"value\":\"Uncle\"},{\"id\":\"97837b9c-a0cf-42f6-9083-52290f7a8d55\",\"description\":\"Aunt\",\"value\":\"Aunt\"},{\"id\":\"806a06ec-e55a-4c24-ad59-201508445968\",\"description\":\"Unknown\",\"value\":\"Unknown\"}]", null, "Family Members", 1 },
                    { new Guid("48378765-9c26-410a-9761-84e722f9a513"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"a4b8a5f8-a9a9-45f9-93f4-7125b58472eb\",\"description\":\"Alive\",\"value\":\"Alive\",\"isDefault\":true},{\"id\":\"598fbf44-540b-4ba3-ae04-b2a22e290da4\",\"description\":\"Deceased\",\"value\":\"Deceased\"}]", null, "Family Status", 1 },
                    { new Guid("296a80a3-e8ed-40d7-bcaf-d90e0b37436e"), new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"), null, true, true, "[{\"id\":\"46339255-5440-471d-be99-0a9d29a8dd8e\",\"value\":\"Incomplete Education\",\"description\":\"Incomplete Education\"},{\"id\":\"515a67b3-11fc-4d91-8deb-c8ac5c86020d\",\"value\":\"GED\",\"description\":\"GED\"},{\"id\":\"b898cc7c-298b-4213-a62a-1b85fa552b1b\",\"value\":\"High School Diploma\",\"description\":\"High School Diploma\"},{\"id\":\"d5d0a606-9135-4fb0-9b6e-9edd9292cd71\",\"value\":\"Associate Degree\",\"description\":\"Associate Degree\"},{\"id\":\"61338c37-2116-4d92-98a0-ba64b11a4a84\",\"value\":\"Associate of Arts Degree\",\"description\":\"Associate of Arts Degree\"},{\"id\":\"fba29e13-dc88-4dfe-b4c0-0f0ee1d2c285\",\"value\":\"Associate of Science Degree\",\"description\":\"Associate of Science Degree\"},{\"id\":\"96558c2a-336a-4f0a-aff8-0a25a7a5ae15\",\"value\":\"Bachelor Degree\",\"description\":\"Bachelor Degree\"},{\"id\":\"cda15a34-4036-45d7-9fe5-02fc1a9d6166\",\"value\":\"Bachelor of Arts Degree\",\"description\":\"Bachelor of Arts Degree\"},{\"id\":\"f023dbf6-40b0-4d91-b3b3-ec9c7d73155e\",\"value\":\"Bachelor of Science Degree\",\"description\":\"Bachelor of Science Degree\"},{\"id\":\"fa81bd0b-f2fc-4110-aea5-696279ee6269\",\"value\":\"Masters of Arts Degree\",\"description\":\"Masters of Arts Degree\"},{\"id\":\"04a4d50e-ea9a-4598-8beb-74605f45a32e\",\"value\":\"Masters of Science Degree\",\"description\":\"Masters of Science Degree\"},{\"id\":\"c4784d17-8080-499e-8d03-2c59571e434e\",\"value\":\"Graduate College of Architecture\",\"description\":\"Graduate College of Architecture\"},{\"id\":\"56b7a79b-dbff-47c9-90db-c12b784b0b55\",\"value\":\"Graduate College of Business\",\"description\":\"Graduate College of Business\"},{\"id\":\"e42434dd-11e0-4eb2-bd89-c93373c532a8\",\"value\":\"Graduate College of Journalism\",\"description\":\"Graduate College of Journalism\"},{\"id\":\"5dbad913-74bd-4f57-b1bf-038d633196db\",\"value\":\"Graduate College of the Law\",\"description\":\"Graduate College of the Law\"},{\"id\":\"26b40324-918f-4d2c-9f4f-032ec7f9591f\",\"value\":\"Graduate College of Library Science\",\"description\":\"Graduate College of Library Science\"},{\"id\":\"96982fd2-6abf-4b51-a272-e1b8190d9473\",\"value\":\"Graduate College of Optometry\",\"description\":\"Graduate College of Optometry\"},{\"id\":\"ed92cb28-0c1e-4b6a-a08f-e405f25b314d\",\"value\":\"Graduate College of Pharmacy\",\"description\":\"Graduate College of Pharmacy\"},{\"id\":\"f31e8b0e-0111-48c4-b16b-e0aee9b28fe8\",\"value\":\"Graduate College of Public Policy\",\"description\":\"Graduate College of Public Policy\"},{\"id\":\"9276a4af-23b2-4652-9b61-f676a3c207fd\",\"value\":\"Human Medicine\",\"description\":\"Human Medicine\"},{\"id\":\"01b37d12-c0cd-42c1-a293-7fa678325dee\",\"value\":\"Professional Engineering\",\"description\":\"Professional Engineering\"},{\"id\":\"c1f4e52a-d610-4e9a-9337-d64e22773a1b\",\"value\":\"Podiatric Medicine\",\"description\":\"Podiatric Medicine\"},{\"id\":\"60e023fb-92af-461e-a38f-246440a3c435\",\"value\":\"Professional certification\",\"description\":\"Professional certification\"},{\"id\":\"546f499a-0c95-4264-a538-3cb2e8b90fbf\",\"value\":\"Scientific Dentistry\",\"description\":\"Scientific Dentistry\"},{\"id\":\"cb26af79-dcc1-4959-8fa9-6aaf23d7b028\",\"value\":\"Veterinary Medicine\",\"description\":\"Veterinary Medicine\"},{\"id\":\"012f874c-1ac5-f8c6-f1c5-69d3f4f17f6c\",\"value\":\"Not Documented\",\"description\":\"Not Documented\",\"isDefault\":true}]", null, "Education", 1 }
                });

            migrationBuilder.InsertData(
                table: "Template",
                columns: new[] { "Id", "CompanyId", "DefaultTemplateHtml", "DetailedTemplateHtml", "InitialDetailedTemplateHtml", "IsActive", "IsHistorical", "IsRequired", "LibraryTemplateId", "ReportTitle", "TemplateOrder", "TemplateTypeId", "Title", "Version" },
                values: new object[,]
                {
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), null, "<p>The claimant denies significant impact on activities of daily living. The claimant is able to complete self-care activities including meals, hygiene, and light house work. The claimant is able to ambulate without assistance and without difficulty. The claimant is not confined to bed, and gets adequate sleep. The claimant is able to drive a vehicle.</p>", "<p>The claimant <label id=\"f53fb798-ef03-4d10-b6dc-ddfc293c1c4d\" metadata=\"9175e277-79d4-4897-84e5-986b903d93e6\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"denies\"> denies</label><span> </span><label id=\"640ba8a7-b15e-4974-ab91-3b8525e160fe\" metadata=\"0b918d8e-e232-491b-90fa-8e304407ba02\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"mild\">severity</label><span>&nbsp;</span> significant impact on activities of daily living. The claimant <label id=\"baf24d09-04de-44d2-892c-8fc7564b17f8\" metadata=\"deab5766-2c86-4e81-82d4-1ce3f780a4a0\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"is\">not</label> <span></span>able to complete self-care activities including <label id=\"8e0f1ddf-25da-42b0-b979-5792be7ad87b\" metadata=\"c87715fa-d0c5-4da1-a959-cec722a13e31\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"activities of daily living\">adl activities</label>. The claimant <label id=\"335d9d65-3b1a-49f7-87bd-3c455c9f348f\" metadata=\"deab5766-2c86-4e81-82d4-1ce3f780a4a0\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"is\">not</label><span>&nbsp;</span> able to ambulate <label id=\"eb4d5163-9d1f-480e-b777-1450b930a833\" metadata=\"057f5281-4488-4a26-9978-67fffe3d1212\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"without\">with</label> assistance and<span>&nbsp;</span><label id=\"d637c395-5837-43ac-9833-4a506af3cdf0\" metadata=\"057f5281-4488-4a26-9978-67fffe3d1212\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"without\">with</label><span>&nbsp;</span>difficulty. The claimant<span>&nbsp;</span><label id=\"534e3439-77bc-4867-b039-eaeb8548f015\" metadata=\"057f5281-4488-4a26-9978-67fffe3d1212\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"without\">with</label><span>&nbsp;</span>not confined to bed, and<span>&nbsp;</span><label id=\"72f59e81-34d8-437b-84b7-a978850718f9\" metadata=\"6176cccf-6ccc-48d7-86c4-27404531c2a6\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"does\"> does</label><span>&nbsp;</span>get adequate sleep. The claimant<span>&nbsp;</span><label id=\"91378af4-2876-4699-947f-384773e2f8bc\" metadata=\"6fb8dabb-3b5a-462b-aa61-1ba607a84f49\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"can\">can</label><span>&nbsp;</span>drive a vehicle.</p>", "", true, false, false, null, "Activities of Daily Living", 1, new Guid("d22bfc8f-3dea-47db-892e-e184d5978ea5"), "Activities of Daily Living", 1 },
                    { new Guid("917f532d-0dfc-43eb-ae8d-47e4b71b5287"), null, "", "<p style=\"color: #000000; font-family: Times New Roman; font-size: 16px; font-style: normal; font-variant: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-decoration: none; text-indent: 0px; text-transform: none; -webkit-text-stroke-width: 0px; white-space: normal; word-spacing: 0px;\">Claimant was advised prior to exam that this is not a complete physical but is an administrative exam and a physician patient relationship has not been established and according to DDS requirements the claimant is not required to perform any maneuvers that cause pain or discomfort. Findings related to this examination were discussed with the claimant prior to termination of the exam and that the physician does not make determination of disability, this determination is made by DDS. Additionally, the physical exam and paperwork take 30 minutes. Identification verified with a<span>&nbsp;</span><label id=\"ec37375e-f1e5-4afe-88bb-b0c10dbee5c1\" metadata=\"e488ce9f-17ea-4c2e-a166-9dc7e58fd780\" selectable-type=\"list\" contenteditable=\"false\" initial-value=\"passport\">identification</label><span>&nbsp;</span></p>", "", true, false, false, null, "Statement of Examination", 2, new Guid("d22bfc8f-3dea-47db-892e-e184d5978ea5"), "Statement of Examination", 1 }
                });

            migrationBuilder.InsertData(
                table: "TemplateSelectableList",
                columns: new[] { "TemplateId", "SelectableListId" },
                values: new object[,]
                {
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("9175e277-79d4-4897-84e5-986b903d93e6") },
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("0b918d8e-e232-491b-90fa-8e304407ba02") },
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("c87715fa-d0c5-4da1-a959-cec722a13e31") },
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("deab5766-2c86-4e81-82d4-1ce3f780a4a0") },
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("057f5281-4488-4a26-9978-67fffe3d1212") },
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("6176cccf-6ccc-48d7-86c4-27404531c2a6") },
                    { new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"), new Guid("6fb8dabb-3b5a-462b-aa61-1ba607a84f49") },
                    { new Guid("917f532d-0dfc-43eb-ae8d-47e4b71b5287"), new Guid("e488ce9f-17ea-4c2e-a166-9dc7e58fd780") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TemplateType_LibraryTemplateTypeId",
                table: "TemplateType",
                column: "LibraryTemplateTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Template_LibraryTemplateId",
                table: "Template",
                column: "LibraryTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_SelectableListCategory_LibrarySelectableListCategoryId",
                table: "SelectableListCategory",
                column: "LibrarySelectableListCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SelectableList_LibrarySelectableListId",
                table: "SelectableList",
                column: "LibrarySelectableListId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientChartDocumentNode_LibraryPatientChartDocumentNodeId",
                table: "PatientChartDocumentNode",
                column: "LibraryPatientChartDocumentNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplateSelectableList_SelectableListId",
                table: "TemplateSelectableList",
                column: "SelectableListId");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientChartDocumentNode_PatientChartDocumentNode_LibraryPatientChartDocumentNodeId",
                table: "PatientChartDocumentNode",
                column: "LibraryPatientChartDocumentNodeId",
                principalTable: "PatientChartDocumentNode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SelectableList_SelectableList_LibrarySelectableListId",
                table: "SelectableList",
                column: "LibrarySelectableListId",
                principalTable: "SelectableList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SelectableListCategory_SelectableListCategory_LibrarySelectableListCategoryId",
                table: "SelectableListCategory",
                column: "LibrarySelectableListCategoryId",
                principalTable: "SelectableListCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Template_Template_LibraryTemplateId",
                table: "Template",
                column: "LibraryTemplateId",
                principalTable: "Template",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TemplateType_TemplateType_LibraryTemplateTypeId",
                table: "TemplateType",
                column: "LibraryTemplateTypeId",
                principalTable: "TemplateType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientChartDocumentNode_PatientChartDocumentNode_LibraryPatientChartDocumentNodeId",
                table: "PatientChartDocumentNode");

            migrationBuilder.DropForeignKey(
                name: "FK_SelectableList_SelectableList_LibrarySelectableListId",
                table: "SelectableList");

            migrationBuilder.DropForeignKey(
                name: "FK_SelectableListCategory_SelectableListCategory_LibrarySelectableListCategoryId",
                table: "SelectableListCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_Template_Template_LibraryTemplateId",
                table: "Template");

            migrationBuilder.DropForeignKey(
                name: "FK_TemplateType_TemplateType_LibraryTemplateTypeId",
                table: "TemplateType");

            migrationBuilder.DropTable(
                name: "TemplateSelectableList");

            migrationBuilder.DropIndex(
                name: "IX_TemplateType_LibraryTemplateTypeId",
                table: "TemplateType");

            migrationBuilder.DropIndex(
                name: "IX_Template_LibraryTemplateId",
                table: "Template");

            migrationBuilder.DropIndex(
                name: "IX_SelectableListCategory_LibrarySelectableListCategoryId",
                table: "SelectableListCategory");

            migrationBuilder.DropIndex(
                name: "IX_SelectableList_LibrarySelectableListId",
                table: "SelectableList");

            migrationBuilder.DropIndex(
                name: "IX_PatientChartDocumentNode_LibraryPatientChartDocumentNodeId",
                table: "PatientChartDocumentNode");

            migrationBuilder.DeleteData(
                table: "PatientChartDocumentNode",
                keyColumn: "Id",
                keyValue: new Guid("0df67882-b7ca-3f30-6d0f-8395a05b3cb7"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("057f5281-4488-4a26-9978-67fffe3d1212"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("0b918d8e-e232-491b-90fa-8e304407ba02"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("16981ccc-ef62-4f5b-bff9-4e15953d386d"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("169f6c0d-8c0c-4f15-bb58-8683953a2d02"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("27674949-2fff-4346-8cb3-87677cdb4af8"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("296a80a3-e8ed-40d7-bcaf-d90e0b37436e"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("2e6d349b-968f-4deb-bb4f-cff54e052f56"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("30907ec3-1ab2-42f0-8ff4-ccd53327c355"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("37cc2e8d-7572-4355-a6ac-1306c8b8ac09"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("3821efa3-7d06-4e1f-af55-82806a7f6ab4"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("3ecfa4a6-a122-455b-95a5-c281c0f9c5da"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("461231ff-7370-4616-a5ef-b82157be16ba"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("46705797-7974-4729-aa55-25150c8b9eef"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("48378765-9c26-410a-9761-84e722f9a513"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("5818c64f-8a47-4355-ab50-eb61ec7f1cc7"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("6176cccf-6ccc-48d7-86c4-27404531c2a6"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("63d73b9b-9478-4364-8956-5f9e535f17fd"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("683695da-d326-4940-b62f-e947b3a67456"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("693892e5-aa93-4af9-80a8-e38134364659"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("6fb8dabb-3b5a-462b-aa61-1ba607a84f49"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("70e07cc0-c1a1-4cab-a590-1ebb63717461"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("835e052e-b481-4258-8b06-eb71efa5eb41"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("88800a93-5a5b-4756-abed-8c2c4f545a8c"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("88ffe78c-93dc-46c2-bc3e-fdedbd84ab90"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("9175e277-79d4-4897-84e5-986b903d93e6"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("a6cf6b2b-0f8d-4f46-9088-abd27048e185"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("a7b2c36d-0ec0-4dda-91f8-e337a270f459"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("ad43752a-ade8-4212-9126-d3d506573c56"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("b907cdcf-5012-4930-85c1-8c7f53cd9767"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("c6cb119a-0177-4bc4-9f6f-e2c31f662b40"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("c87715fa-d0c5-4da1-a959-cec722a13e31"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("de085dd4-2d41-492a-9231-b2aa03768b16"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("dea559cd-c24b-4171-a25f-2017da06b15d"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("deab5766-2c86-4e81-82d4-1ce3f780a4a0"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("e488ce9f-17ea-4c2e-a166-9dc7e58fd780"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("e584095f-7622-4a04-ba61-0ab8145c1e44"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("eede3a10-b8c5-4ce3-9452-e03fc8123382"));

            migrationBuilder.DeleteData(
                table: "SelectableList",
                keyColumn: "Id",
                keyValue: new Guid("f971829e-8ead-4446-abc1-3043c558ebaa"));

            migrationBuilder.DeleteData(
                table: "Template",
                keyColumn: "Id",
                keyValue: new Guid("2ed1290b-8379-4f23-a91b-0556d3023094"));

            migrationBuilder.DeleteData(
                table: "Template",
                keyColumn: "Id",
                keyValue: new Guid("917f532d-0dfc-43eb-ae8d-47e4b71b5287"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("0d2a05f5-95ee-4895-96ff-b393082e996d"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("12e7cc25-66d0-47d1-9660-a6a50c988c13"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("3d894f76-4459-4e05-87fe-f37225b42e39"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("4fdf0192-5499-4e66-98a2-68e5387cbbe5"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("5bbc7f4a-b079-41f6-9b74-288e448ff458"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("98f1e6b9-71cc-433d-960a-657d080c38f5"));

            migrationBuilder.DeleteData(
                table: "SelectableListCategory",
                keyColumn: "Id",
                keyValue: new Guid("37460797-d208-4bc3-b01b-0999e8fc12fb"));

            migrationBuilder.DeleteData(
                table: "SelectableListCategory",
                keyColumn: "Id",
                keyValue: new Guid("6fc99ffe-2338-43e7-b397-45e20a9f4745"));

            migrationBuilder.DeleteData(
                table: "SelectableListCategory",
                keyColumn: "Id",
                keyValue: new Guid("bb8ea100-080b-4a60-93e2-986548d51c75"));

            migrationBuilder.DeleteData(
                table: "SelectableListCategory",
                keyColumn: "Id",
                keyValue: new Guid("d9b00bf2-d576-4553-b0f6-df9e7991d975"));

            migrationBuilder.DeleteData(
                table: "SelectableListCategory",
                keyColumn: "Id",
                keyValue: new Guid("e1a922e3-cf80-47c4-b9a6-9e14210a0864"));

            migrationBuilder.DeleteData(
                table: "TemplateType",
                keyColumn: "Id",
                keyValue: new Guid("d22bfc8f-3dea-47db-892e-e184d5978ea5"));

            migrationBuilder.DropColumn(
                name: "LibraryTemplateTypeId",
                table: "TemplateType");

            migrationBuilder.DropColumn(
                name: "LibraryTemplateId",
                table: "Template");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Template");

            migrationBuilder.DropColumn(
                name: "LibrarySelectableListCategoryId",
                table: "SelectableListCategory");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "SelectableListCategory");

            migrationBuilder.DropColumn(
                name: "IsPredefined",
                table: "SelectableList");

            migrationBuilder.DropColumn(
                name: "LibrarySelectableListId",
                table: "SelectableList");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "SelectableList");

            migrationBuilder.DropColumn(
                name: "LibraryPatientChartDocumentNodeId",
                table: "PatientChartDocumentNode");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "PatientChartDocumentNode");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "TemplateType",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "Template",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Template",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "SelectableListCategory",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "SelectableListCategory",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "SelectableList",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "SelectableList",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "PatientChartDocumentNode",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "SelectableListTrackItem",
                columns: table => new
                {
                    TemplateId = table.Column<Guid>(nullable: false),
                    SelectableListId = table.Column<Guid>(nullable: false),
                    NumberOfSelectableListsInTemplate = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelectableListTrackItem", x => new { x.TemplateId, x.SelectableListId });
                    table.ForeignKey(
                        name: "FK_SelectableListTrackItem_SelectableList_SelectableListId",
                        column: x => x.SelectableListId,
                        principalTable: "SelectableList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SelectableListTrackItem_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SelectableListTrackItem_SelectableListId",
                table: "SelectableListTrackItem",
                column: "SelectableListId");
        }
    }
}
