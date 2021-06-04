using System.Collections.Generic;
using Medico.Api.Configurations;
using Medico.Api.Hubs;
using Medico.Api.HostedServices;
using Medico.Api.ModelBinding;
using Medico.Api.Url;
using Medico.Application.ViewModels;
using Medico.Identity.Data;
using Medico.Identity.Middleware;
using Medico.Identity.Models;
using Medico.IoC;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Medico.Api
{
    public class Startup
    {
        private readonly string _medicoPolicy = "MedicoPolicy";

        public Startup(IHostingEnvironment env)
        {
            Configuration = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", true, true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true)
                .AddEnvironmentVariables().Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHostedService<MedicationsUpdateHostedService>();

            var medicoSettings = Configuration.GetSection("MedicoSettings");
            services.Configure<MedicoSettingsViewModel>(medicoSettings);

            var mailSettings = Configuration.GetSection("MailSettings");
            services.Configure<SendEmailViewModel>(mailSettings);

            var uriSettings = Configuration.GetSection("URISettings");
            services.Configure<UriViewModel>(uriSettings);

            services.AddDbContext<IdentityDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.User.RequireUniqueEmail = false;

                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;
            });

            var allowedHosts = Configuration.GetSection("CORSSettings:AllowedHosts")
                .Get<string[]>();

            services.AddCors(options =>
            {
                options.AddPolicy(_medicoPolicy,
                    builder => builder.WithOrigins(allowedHosts)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddMvc(options =>
            {
                options.ModelBinderProviders.Insert(0, new DateTimeModelBinderProvider());
                options.ModelBinderProviders.Insert(1, new AppointmentDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(2, new DateRangeDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(3, new DxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(4, new RoomDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(5, new TemplateDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(6, new UserDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(7, new HistoryDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(8, new VitalSignsDxOptionsModelBinderProvider());
                options.ModelBinderProviders.Insert(9, new CompanyDxOptionsModelBinderProvider());
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.AccessDeniedPath = new PathString("/api/account/forbid");
                options.Cookie.HttpOnly = true;
                options.LoginPath = new PathString("/api/account/login");
            });

            services.AddAutoMapperSetup();

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            //video chat
            //services.AddSignalR();

            // .NET Native DI Abstraction
            RegisterServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseResponseDelay();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(_medicoPolicy);
            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseCompanyAccess();
            app.UseCompanyPatientAccess();

            app.UseStaticFiles();

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            //video chat implementation
            /*app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/api/sgr/chat");
                routes.MapHub<WebRtcHub>("/api/sgr/rtc");
            });*/

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            if (!env.IsDevelopment())
            {
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";
                });
            }
        }

        private static void RegisterServices(IServiceCollection services)
        {
            services.AddScoped<IUrlService, UrlService>();
            
            // Adding dependencies from another layers (isolated from Presentation)
            NativeInjectorBootstrapper.RegisterServices(services);
        }
    }
}
