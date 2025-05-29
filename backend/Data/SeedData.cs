using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Data
{
    public static class SeedData
    {
        public static void Initialize(CredContext context)
        {
            // Don't seed if there's already data
            if (context.Customers.Any()) return;

            var random = new Random();
            var customers = new List<Customer>();

            // Create 20 customers
            for (int i = 1; i <= 20; i++)
            {
                var customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    FullName = $"User {i}",
                    Email = $"user{i}@example.com",
                    PhoneNumber = $"08000000{i:D2}",
                    Address = $"{i} Main Street",
                    IsVerified = i % 2 == 0,
                    NationalIdNumber = $"NID{i:D6}",
                    DocumentType = "Passport",
                    Transactions = new List<Transaction>(),
                    LoginActivities = new List<LoginActivity>()
                };

                customers.Add(customer);
            }

            // Create and assign 30 transactions
            for (int i = 0; i < 30; i++)
            {
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    Amount = random.Next(100, 10000),
                    Timestamp = DateTime.UtcNow.AddDays(-random.Next(1, 10)),
                    DestinationAccount = $"DEST{random.Next(1000, 9999)}",
                    SourceAccount = $"SRC{random.Next(1000, 9999)}"
                };

                var customer = customers[random.Next(customers.Count)];
                customer.Transactions.Add(transaction);
            }

            // Create and assign 30 login activities
            for (int i = 0; i < 30; i++)
            {
                var loginActivity = new LoginActivity
                {
                    Id = Guid.NewGuid(),
                    LoginTime = DateTime.UtcNow.AddHours(-random.Next(1, 100)),
                    IPAddress = $"192.168.0.{random.Next(1, 255)}",
                    Location = "Nigeria",
                    UsedVPNOrProxy = random.Next(0, 2) == 1,
                    Device = random.Next(0, 2) == 0 ? "Chrome/Windows" : "Firefox/Linux"
                };

                var customer = customers[random.Next(customers.Count)];
                customer.LoginActivities.Add(loginActivity);
            }

            // Add all customers (and their nested data)
            context.Customers.AddRange(customers);
            context.SaveChanges();
        }
    }
}
