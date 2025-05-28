using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<LoginActivity> LoginActivities { get; set; }
    }
}
