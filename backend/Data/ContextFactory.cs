//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Design;
//using Microsoft.Extensions.Configuration;
//using System.IO;

//namespace backend.Data
//{
//    public class ContextFactory : IDesignTimeDbContextFactory<CredContext>
//    {
//        public CredContext CreateDbContext(string[] args)
//        {
//            IConfigurationRoot configuration = new ConfigurationBuilder()
//                .SetBasePath(Directory.GetCurrentDirectory())
//                .AddJsonFile("appsettings.json")
//                .Build();

//            var optionsBuilder = new DbContextOptionsBuilder<CredContext>();
//            var connectionString = configuration.GetConnectionString("CredInsightConnection");

//            optionsBuilder.UseSqlServer(connectionString);

//            return new CredContext(optionsBuilder.Options);
//        }
//    }
//}
