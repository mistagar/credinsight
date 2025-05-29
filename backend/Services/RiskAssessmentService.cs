using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Services
{
    public class RiskAssessmentService : IRiskAssessmentService
    {
        private readonly Data.CredContext _context;

        public RiskAssessmentService(Data.CredContext context)
        {
            _context = context;
        }

        public async Task<RiskAssessment?> AssessCustomerRisk(Guid customerId)
        {
            var customer = await _context.Customers
                .Include(c => c.Transactions)
                .Include(c => c.LoginActivities)
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null)
                return null;

            int score = 0;

            // Rule-based scoring
            if (!customer.IsVerified) score += 20;

            var avg = customer.Transactions.Any() ? customer.Transactions.Average(t => t.Amount) : 0;

            foreach (var txn in customer.Transactions)
            {
                if (txn.Amount > 5 * avg) score += 25;
            }

            if (customer.Transactions.Count(t => t.Amount < 100) > 5)
                score += 20;

            var destCount = customer.Transactions.Select(t => t.DestinationAccount).Distinct().Count();
            if (destCount > 3) score += 15;

            if (customer.LoginActivities.Any(l => l.UsedVPNOrProxy)) score += 15;
            if (customer.LoginActivities.Select(l => l.Location).Distinct().Count() > 3)
                score += 15;

            RiskLevel level = RiskLevel.Low;
            if (score >= 70) level = RiskLevel.High;
            else if (score >= 40) level = RiskLevel.Medium;

            return new RiskAssessment
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                Score = score,
                Level = level,
                AssessedAt = DateTime.UtcNow,
                Notes = "Assessed based on recent transactions and login activity."
            };
        }
    }
}
