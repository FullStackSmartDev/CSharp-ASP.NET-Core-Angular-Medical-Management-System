﻿// <auto-generated />
using System;
using Medico.Api.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Medico.Api.Migrations
{
    [DbContext(typeof(MedicoContext))]
    [Migration("20181006161429_EntityExtraFieldMap_and_ExtraField_Tables")]
    partial class EntityExtraFieldMap_and_ExtraField_Tables
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.1-rtm-30846")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Medico.Api.DB.Models.Admission", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("AdmissionData")
                        .IsRequired();

                    b.Property<Guid>("AppointmentId");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<Guid>("PatientDemographicId");

                    b.HasKey("Id");

                    b.HasIndex("AppointmentId")
                        .IsUnique();

                    b.HasIndex("PatientDemographicId");

                    b.ToTable("Admission");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Allergy", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<Guid>("MedicationId");

                    b.Property<string>("Notes");

                    b.Property<Guid>("PatientId");

                    b.Property<int>("Reaction");

                    b.HasKey("Id");

                    b.HasIndex("MedicationId");

                    b.HasIndex("PatientId");

                    b.ToTable("Allergy");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Appointment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("AdmissionId");

                    b.Property<int>("AppointmentStatus");

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("EndDate");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<Guid>("LocationId");

                    b.Property<Guid>("NurseId");

                    b.Property<Guid>("PatientDemographicId");

                    b.Property<Guid>("PhysicianId");

                    b.Property<Guid>("RoomId");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("LocationId");

                    b.HasIndex("PatientDemographicId");

                    b.HasIndex("RoomId");

                    b.ToTable("Appointment");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.AppUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("EmployeeId");

                    b.Property<string>("Hash")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<bool>("IsSuperAdmin")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("EmployeeId")
                        .IsUnique()
                        .HasFilter("[EmployeeId] IS NOT NULL");

                    b.ToTable("AppUser");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.AppUserPermissionGroup", b =>
                {
                    b.Property<Guid>("AppUserId");

                    b.Property<Guid>("PermissionGroupId");

                    b.HasKey("AppUserId", "PermissionGroupId");

                    b.HasIndex("PermissionGroupId");

                    b.ToTable("AppUserPermissionGroup");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.ChiefComplaint", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("CompanyId");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("ChiefComplaint");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.ChiefComplaintTemplate", b =>
                {
                    b.Property<Guid>("ChiefComplaintId");

                    b.Property<Guid>("TemplateId");

                    b.HasKey("ChiefComplaintId", "TemplateId");

                    b.HasIndex("TemplateId");

                    b.ToTable("ChiefComplaintTemplate");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Company", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Address")
                        .IsRequired();

                    b.Property<string>("City")
                        .IsRequired();

                    b.Property<string>("Fax")
                        .IsRequired();

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<Guid?>("PatientDataModelId");

                    b.Property<string>("Phone")
                        .IsRequired();

                    b.Property<string>("SecondaryAddress")
                        .IsRequired();

                    b.Property<string>("State")
                        .IsRequired();

                    b.Property<string>("WebSiteUrl")
                        .HasMaxLength(200);

                    b.Property<string>("ZipCode")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Company");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.CptCode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Code")
                        .IsRequired();

                    b.Property<string>("Description")
                        .IsRequired();

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("CptCode");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.EducationHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("Degree");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Notes");

                    b.Property<Guid>("PatientId");

                    b.Property<int?>("YearCompleted");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("EducationHistory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Employee", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<Guid>("AppUserId");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<int>("ExmployeeType");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("Gender");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid?>("LocationId");

                    b.Property<string>("MiddleName")
                        .HasMaxLength(100);

                    b.Property<string>("PrimaryPhone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(200);

                    b.Property<string>("SecondaryPhone")
                        .HasMaxLength(100);

                    b.Property<string>("Ssn")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("State")
                        .HasMaxLength(100);

                    b.Property<string>("Zip")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("LocationId");

                    b.ToTable("Employee");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.EntityExtraFieldMap", b =>
                {
                    b.Property<Guid>("EntityId");

                    b.Property<Guid>("ExtraFieldId");

                    b.Property<string>("Value")
                        .IsRequired();

                    b.HasKey("EntityId", "ExtraFieldId");

                    b.ToTable("EntityExtraFieldMap");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.ExtraField", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("RelatedEntityName")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<int>("Type");

                    b.HasKey("Id");

                    b.ToTable("ExtraField");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.FamilyHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("FamilyMember");

                    b.Property<int>("FamilyStatus");

                    b.Property<Guid>("IcdCodeId");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<Guid>("PatientId");

                    b.HasKey("Id");

                    b.HasIndex("IcdCodeId");

                    b.HasIndex("PatientId");

                    b.ToTable("FamilyHistory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.IcdCode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Code")
                        .IsRequired();

                    b.Property<string>("Description")
                        .IsRequired();

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("IcdCode");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Location", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("CompanyId");

                    b.Property<string>("Fax")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(200);

                    b.Property<string>("State")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Zip")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Location");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.MedicalHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<Guid>("IcdCodeId");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Notes");

                    b.Property<Guid>("PatientId");

                    b.HasKey("Id");

                    b.HasIndex("IcdCodeId");

                    b.HasIndex("PatientId");

                    b.ToTable("MedicalHistory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Medication", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Class");

                    b.Property<string>("Form");

                    b.Property<string>("GenericName");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("NdcCode");

                    b.Property<string>("PackageDescription");

                    b.Property<string>("ProductNdc");

                    b.Property<string>("Route");

                    b.Property<string>("Schedule");

                    b.Property<string>("Strength");

                    b.Property<string>("Substance");

                    b.Property<string>("Type");

                    b.Property<string>("Units");

                    b.HasKey("Id");

                    b.ToTable("Medication");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.MedicationHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("Dose")
                        .HasMaxLength(200);

                    b.Property<string>("DoseSchedule")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<Guid>("MedicationId");

                    b.Property<int>("MedicationStatus");

                    b.Property<Guid>("PatientId");

                    b.Property<bool?>("Prn");

                    b.Property<int>("Route");

                    b.Property<string>("Units")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("MedicationId");

                    b.HasIndex("PatientId");

                    b.ToTable("MedicationHistory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.OccupationalHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("DisabilityClaimDetails");

                    b.Property<int>("EmploymentStatus");

                    b.Property<DateTime?>("End");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<int>("OccupationalType");

                    b.Property<Guid>("PatientId");

                    b.Property<DateTime>("Start");

                    b.Property<string>("WorkersCompensationClaimDetails");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("OccupationalHistory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.PatientDataModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("CompanyId");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("JsonPatientDataModel")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("CompanyId")
                        .IsUnique()
                        .HasFilter("[CompanyId] IS NOT NULL");

                    b.ToTable("PatientDataModel");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.PatientDemographic", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("Gender");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("MaritalStatus");

                    b.Property<string>("Ssn")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("PatientDemographic");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.PermissionGroup", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("Permissions")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.HasKey("Id");

                    b.ToTable("PermissionGroup");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Room", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool?>("IsDelete");

                    b.Property<Guid>("LocationId");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("LocationId");

                    b.ToTable("Room");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.SurgicalHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CptCodeId");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Notes");

                    b.Property<Guid>("PatientId");

                    b.HasKey("Id");

                    b.HasIndex("CptCodeId");

                    b.HasIndex("PatientId");

                    b.ToTable("SurgicalHistory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Template", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("CompanyId");

                    b.Property<bool?>("IsDelete");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<Guid>("TemplateTypeId");

                    b.Property<string>("Title")
                        .HasMaxLength(200);

                    b.Property<string>("Value")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("TemplateTypeId");

                    b.ToTable("Template");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.TemplateLookupItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("CompanyId");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("JsonValues")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("TemplateLookupItemCategoryId");

                    b.Property<string>("Title")
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("TemplateLookupItemCategoryId");

                    b.ToTable("TemplateLookupItem");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.TemplateLookupItemCategory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Title")
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.ToTable("TemplateLookupItemCategory");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.TemplateType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("CompanyId");

                    b.Property<bool?>("IsDelete")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Title")
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("TemplateType");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Admission", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Appointment", "Appointment")
                        .WithOne("Admission")
                        .HasForeignKey("Medico.Api.DB.Models.Admission", "AppointmentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "PatientDemographic")
                        .WithMany("Admissions")
                        .HasForeignKey("PatientDemographicId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Allergy", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Medication", "Medication")
                        .WithMany("Allergies")
                        .HasForeignKey("MedicationId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("Allergies")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Appointment", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany("Appointments")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.Location", "Location")
                        .WithMany("Appointments")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "PatientDemographic")
                        .WithMany("Appointments")
                        .HasForeignKey("PatientDemographicId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.Room", "Room")
                        .WithMany("Appointments")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.AppUser", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Employee", "Employee")
                        .WithOne("AppUser")
                        .HasForeignKey("Medico.Api.DB.Models.AppUser", "EmployeeId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.AppUserPermissionGroup", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.AppUser", "AppUser")
                        .WithMany("UserPermissionGroups")
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Api.DB.Models.PermissionGroup", "PermissionGroup")
                        .WithMany("UserPermissionGroups")
                        .HasForeignKey("PermissionGroupId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.ChiefComplaint", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.ChiefComplaintTemplate", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.ChiefComplaint", "ChiefComplaint")
                        .WithMany("Templates")
                        .HasForeignKey("ChiefComplaintId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Api.DB.Models.Template", "Template")
                        .WithMany("ChiefComplaints")
                        .HasForeignKey("TemplateId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.EducationHistory", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("EducationHistory")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Employee", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany("Employees")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Api.DB.Models.Location")
                        .WithMany("Employees")
                        .HasForeignKey("LocationId");
                });

            modelBuilder.Entity("Medico.Api.DB.Models.FamilyHistory", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.IcdCode", "IcdCode")
                        .WithMany("FamilyHistory")
                        .HasForeignKey("IcdCodeId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("FamilyHistory")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Location", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany("Locations")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.MedicalHistory", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.IcdCode", "IcdCode")
                        .WithMany("MedicalHistory")
                        .HasForeignKey("IcdCodeId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("MedicalHistory")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.MedicationHistory", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Medication", "Medication")
                        .WithMany("MedicationHistory")
                        .HasForeignKey("MedicationId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("MedicationHistory")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.OccupationalHistory", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("OccupationalHistory")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.PatientDataModel", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithOne("PatientDataModel")
                        .HasForeignKey("Medico.Api.DB.Models.PatientDataModel", "CompanyId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.PatientDemographic", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany("PatientDemographics")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Room", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Location", "Location")
                        .WithMany("Rooms")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.SurgicalHistory", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.CptCode", "CptCode")
                        .WithMany("SurgicalHistory")
                        .HasForeignKey("CptCodeId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Api.DB.Models.PatientDemographic", "Patient")
                        .WithMany("SurgicalHistory")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.Template", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId");

                    b.HasOne("Medico.Api.DB.Models.TemplateType", "TemplateType")
                        .WithMany("Templates")
                        .HasForeignKey("TemplateTypeId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.TemplateLookupItem", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany("TemplateLookupItems")
                        .HasForeignKey("CompanyId");

                    b.HasOne("Medico.Api.DB.Models.TemplateLookupItemCategory", "TemplateLookupItemCategory")
                        .WithMany("TemplateLookupItems")
                        .HasForeignKey("TemplateLookupItemCategoryId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Api.DB.Models.TemplateType", b =>
                {
                    b.HasOne("Medico.Api.DB.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId");
                });
#pragma warning restore 612, 618
        }
    }
}
