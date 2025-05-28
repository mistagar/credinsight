using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Data
{
    public static class SeedData
    {
        public static void Initialize(Context context)
        {
            if (context.Customers.Any()) return;

            var customer1 = new Customer
            {
                Id = Guid.NewGuid(),
                FullName = "John Doe",
                Email = "john@example.com",
                PhoneNumber = "1234567890",
                Address = "123 Main St",
                IsVerified = false,
                NationalIdNumber = "NID123456",
                DocumentType = "DriverLicense",
                Transactions = new List<Transaction>
                {
                    new Transaction
                    {
                        Id = Guid.NewGuid(),
                        Amount = 5000,
                        Timestamp = DateTime.UtcNow.AddDays(-1),
                        DestinationAccount = "X123",
                        SourceAccount = "A123"
                    },
                    new Transaction
                    {
                        Id = Guid.NewGuid(),
                        Amount = 75,
                        Timestamp = DateTime.UtcNow.AddDays(-2),
                        DestinationAccount = "X124",
                        SourceAccount = "A123"
                    }
                },
                LoginActivities = new List<LoginActivity>
                {
                    new LoginActivity
                    {
                        Id = Guid.NewGuid(),
                        LoginTime = DateTime.UtcNow.AddHours(-5),
                        IPAddress = "192.168.1.1",
                        Location = "Nigeria",
                        UsedVPNOrProxy = true,
                        Device = "Chrome/Win"
                    }
                }
            };

            context.Customers.Add(customer1);
            context.SaveChanges();
        }
    }
}
