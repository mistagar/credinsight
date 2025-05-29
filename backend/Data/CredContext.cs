using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class CredContext : DbContext
    {
        public CredContext(DbContextOptions<CredContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<LoginActivity> LoginActivities { get; set; }
        public DbSet<RiskAssessment> RiskAssessments { get; set; }
    }
}
