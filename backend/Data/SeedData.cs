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

            // Nigerian names for realistic seed data
            var nigerianNames = new string[]
            {
                "Adebayo Olumide",
                "Chioma Nwankwo",
                "Ibrahim Musa",
                "Folake Adeyemi",
                "Emeka Okafor",
                "Aisha Abdullahi",
                "Oluwaseun Ogbonna",
                "Fatima Hassan",
                "Chukwuma Eze",
                "Blessing Okoro",
                "Yusuf Garba",
                "Ngozi Okonkwo",
                "Tunde Bamidele",
                "Kemi Oladipo",
                "Uche Nnadi",
                "Halima Bello",
                "Segun Akinola",
                "Amina Suleiman",
                "Chinedu Okwu",
                "Funmi Adebisi"
            };

            // Create 20 customers with Nigerian names
            for (int i = 0; i < 20; i++)
            {
                var name = nigerianNames[i];
                var emailName = name.Replace(" ", "").ToLower();

                var customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    FullName = name,
                    Email = $"{emailName}@example.com",
                    PhoneNumber = $"08{random.Next(10000000, 99999999)}",
                    Address = $"{random.Next(1, 999)} {GetRandomNigerianStreet(random)}, Lagos",
                    IsVerified = random.Next(0, 2) == 1,
                    NationalIdNumber = $"NIN{random.Next(10000000, 99999999)}",
                    DocumentType = random.Next(0, 3) switch
                    {
                        0 => "National ID",
                        1 => "Passport",
                        _ => "Driver's License"
                    },
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
            }            // Create and assign 30 login activities
            for (int i = 0; i < 30; i++)
            {
                var loginActivity = new LoginActivity
                {
                    Id = Guid.NewGuid(),
                    LoginTime = DateTime.UtcNow.AddHours(-random.Next(1, 100)),
                    IPAddress = $"41.{random.Next(1, 255)}.{random.Next(1, 255)}.{random.Next(1, 255)}", // Nigerian IP range
                    Location = GetRandomNigerianLocation(random),
                    UsedVPNOrProxy = random.Next(0, 10) == 1, // 10% chance of VPN usage
                    Device = random.Next(0, 4) switch
                    {
                        0 => "Chrome/Windows",
                        1 => "Safari/iPhone",
                        2 => "Chrome/Android",
                        _ => "Firefox/Windows"
                    }
                };

                var customer = customers[random.Next(customers.Count)];
                customer.LoginActivities.Add(loginActivity);
            }// Add all customers (and their nested data)
            context.Customers.AddRange(customers);
            context.SaveChanges();
        }

        private static string GetRandomNigerianStreet(Random random)
        {
            var streets = new string[]
            {
                "Broad Street",
                "Marina Street",
                "Allen Avenue",
                "Victoria Island Road",
                "Ikoyi Crescent",
                "Lekki Phase 1",
                "Surulere Street",
                "Ikeja GRA",
                "Yaba Road",
                "Mushin Avenue",
                "Alaba Market Road",
                "Oshodi Express",
                "Gbagada Estate",
                "Magodo Phase 2",
                "Ajah Link Road",
                "Festac Town",
                "Mile 2 Express",
                "Apapa Road",
                "Ikorodu Road",
                "Agege Motor Road"
            }; return streets[random.Next(streets.Length)];
        }

        private static string GetRandomNigerianLocation(Random random)
        {
            var locations = new string[]
            {
                "Lagos, Nigeria",
                "Abuja, Nigeria",
                "Kano, Nigeria",
                "Ibadan, Nigeria",
                "Port Harcourt, Nigeria",
                "Benin City, Nigeria",
                "Kaduna, Nigeria",
                "Jos, Nigeria",
                "Ilorin, Nigeria",
                "Enugu, Nigeria",
                "Aba, Nigeria",
                "Onitsha, Nigeria",
                "Warri, Nigeria",
                "Calabar, Nigeria",
                "Akure, Nigeria",
                "Abeokuta, Nigeria",
                "Maiduguri, Nigeria",
                "Zaria, Nigeria",
                "Sokoto, Nigeria",
                "Uyo, Nigeria"
            };

            return locations[random.Next(locations.Length)];
        }
    }
}
