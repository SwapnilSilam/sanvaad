
using SanvaadServer.DataManagers;
using SanvaadServer.Hubs;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace SanvaadServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddCors(options =>
               {
                   options.AddPolicy("SignalRPolicy", builder =>
                   {
                       builder.WithOrigins("http://localhost:4200");
                       builder.AllowAnyMethod();
                       builder.AllowAnyHeader();
                       builder.AllowCredentials();
                   });
               });

            services.AddSignalR();

            services.AddSingleton<IPeerConnectionManager, PeerConnectionManager>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("SignalRPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SanvaadHub>("/SanvaadConnection");
            });
        }
    }
}
