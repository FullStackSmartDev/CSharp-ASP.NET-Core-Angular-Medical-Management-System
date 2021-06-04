﻿// <auto-generated />
using System;
using Medico.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Medico.Data.Migrations
{
    [DbContext(typeof(MedicoContext))]
    [Migration("20190720102632_AppointmentGridItem_View")]
    partial class AppointmentGridItem_View
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Medico.Domain.Models.Admission", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("AdmissionData")
                        .IsRequired();

                    b.Property<Guid>("AppointmentId");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<Guid>("PatientId");

                    b.Property<Guid?>("SignatureInfoId");

                    b.HasKey("Id");

                    b.HasIndex("AppointmentId")
                        .IsUnique();

                    b.HasIndex("PatientId");

                    b.ToTable("Admission");
                });

            modelBuilder.Entity("Medico.Domain.Models.Appointment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("AdmissionId");

                    b.Property<string>("Allegations")
                        .HasMaxLength(2000);

                    b.Property<string>("AppointmentStatus")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("EndDate");

                    b.Property<Guid>("LocationId");

                    b.Property<Guid?>("MedicoApplicationUserId");

                    b.Property<Guid>("NurseId");

                    b.Property<Guid>("PatientId");

                    b.Property<Guid>("PhysicianId");

                    b.Property<Guid>("RoomId");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("LocationId");

                    b.HasIndex("MedicoApplicationUserId");

                    b.HasIndex("PatientId");

                    b.HasIndex("RoomId");

                    b.ToTable("Appointment");
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaint", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CompanyId");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("ChiefComplaint");
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaintKeyword", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.HasKey("Id");

                    b.ToTable("ChiefComplaintKeyword");
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaintRelatedKeyword", b =>
                {
                    b.Property<Guid>("ChiefComplaintId");

                    b.Property<Guid>("KeywordId");

                    b.HasKey("ChiefComplaintId", "KeywordId");

                    b.HasIndex("KeywordId");

                    b.ToTable("ChiefComplaintRelatedKeyword");
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaintTemplate", b =>
                {
                    b.Property<Guid>("ChiefComplaintId");

                    b.Property<Guid>("TemplateId");

                    b.HasKey("ChiefComplaintId", "TemplateId");

                    b.HasIndex("TemplateId");

                    b.ToTable("ChiefComplaintTemplate");
                });

            modelBuilder.Entity("Medico.Domain.Models.Company", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Fax")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(2000);

                    b.Property<int>("State");

                    b.Property<string>("WebSiteUrl")
                        .HasMaxLength(2000);

                    b.Property<string>("ZipCode")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.ToTable("Company");
                });

            modelBuilder.Entity("Medico.Domain.Models.IcdCode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("Notes")
                        .HasMaxLength(2000);

                    b.HasKey("Id");

                    b.ToTable("IcdCode");
                });

            modelBuilder.Entity("Medico.Domain.Models.IcdCodeChiefComplaintKeyword", b =>
                {
                    b.Property<Guid>("IcdCodeId");

                    b.Property<Guid>("ChiefComplaintKeywordId");

                    b.HasKey("IcdCodeId", "ChiefComplaintKeywordId");

                    b.HasIndex("ChiefComplaintKeywordId");

                    b.ToTable("IcdCodeChiefComplaintKeyword");
                });

            modelBuilder.Entity("Medico.Domain.Models.Location", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("CompanyId");

                    b.Property<string>("Fax")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<bool>("IsActive");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(2000);

                    b.Property<int>("State");

                    b.Property<string>("Zip")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("Location");
                });

            modelBuilder.Entity("Medico.Domain.Models.MedicoApplicationUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("EmployeeType");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("Gender");

                    b.Property<bool>("IsActive");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("MiddleName")
                        .HasMaxLength(100);

                    b.Property<string>("NamePrefix")
                        .HasMaxLength(100);

                    b.Property<string>("NameSuffix")
                        .HasMaxLength(100);

                    b.Property<string>("PrimaryPhone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(2000);

                    b.Property<string>("SecondaryPhone")
                        .HasMaxLength(100);

                    b.Property<string>("Ssn")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("State");

                    b.Property<string>("Zip")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("MedicoApplicationUser");
                });

            modelBuilder.Entity("Medico.Domain.Models.Patient", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<Guid>("CompanyId");

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("Gender");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("MaritalStatus");

                    b.Property<string>("MiddleName");

                    b.Property<Guid?>("PatientInsuranceId");

                    b.Property<string>("PrimaryAddress")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("PrimaryPhone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(2000);

                    b.Property<string>("SecondaryPhone")
                        .HasMaxLength(100);

                    b.Property<string>("Ssn")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("State");

                    b.Property<string>("Zip")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("PatientInsuranceId")
                        .IsUnique()
                        .HasFilter("[PatientInsuranceId] IS NOT NULL");

                    b.ToTable("Patient");
                });

            modelBuilder.Entity("Medico.Domain.Models.PatientInsurance", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("CaseNumber")
                        .HasMaxLength(100);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("Gender");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("MiddleName");

                    b.Property<Guid>("PatientId");

                    b.Property<string>("PrimaryAddress")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("PrimaryPhone")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("RqId")
                        .HasMaxLength(100);

                    b.Property<string>("SecondaryAddress")
                        .HasMaxLength(2000);

                    b.Property<string>("SecondaryPhone")
                        .HasMaxLength(100);

                    b.Property<string>("Ssn")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("State");

                    b.Property<string>("Zip")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("PatientInsurance");
                });

            modelBuilder.Entity("Medico.Domain.Models.Room", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<bool>("IsActive");

                    b.Property<Guid>("LocationId");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("LocationId");

                    b.ToTable("Room");
                });

            modelBuilder.Entity("Medico.Domain.Models.SelectableList", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CategoryId");

                    b.Property<Guid>("CompanyId");

                    b.Property<bool>("IsActive");

                    b.Property<string>("JsonValues")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("CompanyId");

                    b.ToTable("SelectableList");
                });

            modelBuilder.Entity("Medico.Domain.Models.SelectableListCategory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CompanyId");

                    b.Property<bool>("IsActive");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("SelectableListCategory");
                });

            modelBuilder.Entity("Medico.Domain.Models.SignatureInfo", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("AdmissionId");

                    b.Property<bool>("IsUnsigned");

                    b.Property<Guid>("PhysicianId");

                    b.Property<DateTime>("SignDate");

                    b.HasKey("Id");

                    b.HasIndex("AdmissionId")
                        .IsUnique();

                    b.HasIndex("PhysicianId");

                    b.ToTable("SignatureInfo");
                });

            modelBuilder.Entity("Medico.Domain.Models.Template", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CompanyId");

                    b.Property<string>("DefaultTemplateHtml");

                    b.Property<string>("DetailedTemplateHtml");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsHistorical");

                    b.Property<bool>("IsRequired");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<string>("ReportTitle")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<int?>("TemplateOrder");

                    b.Property<Guid>("TemplateTypeId");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("TemplateTypeId");

                    b.ToTable("Template");
                });

            modelBuilder.Entity("Medico.Domain.Models.TemplateType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid>("CompanyId");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsPredefined");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Title")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.ToTable("TemplateType");
                });

            modelBuilder.Entity("Medico.Domain.Models.Admission", b =>
                {
                    b.HasOne("Medico.Domain.Models.Appointment", "Appointment")
                        .WithOne("Admission")
                        .HasForeignKey("Medico.Domain.Models.Admission", "AppointmentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.Patient", "Patient")
                        .WithMany("Admissions")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.Appointment", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("Appointments")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.Location", "Location")
                        .WithMany("Appointments")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.MedicoApplicationUser")
                        .WithMany("Appointments")
                        .HasForeignKey("MedicoApplicationUserId");

                    b.HasOne("Medico.Domain.Models.Patient", "Patient")
                        .WithMany("Appointments")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.Room", "Room")
                        .WithMany("Appointments")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaint", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaintRelatedKeyword", b =>
                {
                    b.HasOne("Medico.Domain.Models.ChiefComplaint", "ChiefComplaint")
                        .WithMany("ChiefComplaintsKeywords")
                        .HasForeignKey("ChiefComplaintId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Domain.Models.ChiefComplaintKeyword", "Keyword")
                        .WithMany("ChiefComplaintsKeywords")
                        .HasForeignKey("KeywordId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Domain.Models.ChiefComplaintTemplate", b =>
                {
                    b.HasOne("Medico.Domain.Models.ChiefComplaint", "ChiefComplaint")
                        .WithMany("ChiefComplaintTemplates")
                        .HasForeignKey("ChiefComplaintId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.Template", "Template")
                        .WithMany("ChiefComplaintTemplates")
                        .HasForeignKey("TemplateId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.IcdCodeChiefComplaintKeyword", b =>
                {
                    b.HasOne("Medico.Domain.Models.ChiefComplaintKeyword", "ChiefComplaintKeyword")
                        .WithMany("ChiefComplaintKeywordIcdCodes")
                        .HasForeignKey("ChiefComplaintKeywordId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.IcdCode", "IcdCode")
                        .WithMany("IcdCodeChiefComplaintKeywords")
                        .HasForeignKey("IcdCodeId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.Location", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("Locations")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Domain.Models.MedicoApplicationUser", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("MedicoApplicationUsers")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Domain.Models.Patient", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("Patients")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Domain.Models.PatientInsurance", "PatientInsurance")
                        .WithOne("Patient")
                        .HasForeignKey("Medico.Domain.Models.Patient", "PatientInsuranceId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.Room", b =>
                {
                    b.HasOne("Medico.Domain.Models.Location", "Location")
                        .WithMany("Rooms")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Domain.Models.SelectableList", b =>
                {
                    b.HasOne("Medico.Domain.Models.SelectableListCategory", "Category")
                        .WithMany("SelectableLists")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("SelectableLists")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.SelectableListCategory", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("SelectableListCategories")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Medico.Domain.Models.SignatureInfo", b =>
                {
                    b.HasOne("Medico.Domain.Models.Admission", "Admission")
                        .WithOne("SignatureInfo")
                        .HasForeignKey("Medico.Domain.Models.SignatureInfo", "AdmissionId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Medico.Domain.Models.MedicoApplicationUser", "Physician")
                        .WithMany("Signatures")
                        .HasForeignKey("PhysicianId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.Template", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Medico.Domain.Models.TemplateType", "TemplateType")
                        .WithMany("Templates")
                        .HasForeignKey("TemplateTypeId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Medico.Domain.Models.TemplateType", b =>
                {
                    b.HasOne("Medico.Domain.Models.Company", "Company")
                        .WithMany("TemplateTypes")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
