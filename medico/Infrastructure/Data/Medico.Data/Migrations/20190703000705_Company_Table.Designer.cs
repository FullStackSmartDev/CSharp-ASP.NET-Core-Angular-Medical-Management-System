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
    [Migration("20190703000705_Company_Table")]
    partial class Company_Table
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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
#pragma warning restore 612, 618
        }
    }
}
