using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Medico.Identity.Data
{
    public class MedicoIdentityDbContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
    {
        public IdentityDbContext CreateDbContext(string[] args)
        {
            var environment = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"))
                ? "Development"
                : Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var currentDirectory = Directory.GetCurrentDirectory();
            var apiDirectory = Path.Combine(currentDirectory, "../../Services/Medico.Api");

            IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(apiDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();
            var connectionString = config.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString, b => b.MigrationsAssembly("Medico.Identity"));
            return new IdentityDbContext(optionsBuilder.Options);
        }
    }
}