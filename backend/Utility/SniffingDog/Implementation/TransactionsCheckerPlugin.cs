using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Microsoft.SemanticKernel;
using System.ComponentModel;
using backend.Utility.SniffingDog.Models;

namespace backend.Utility.SniffingDog.Implementation
{
    public class TransactionsCheckerPlugin
    {
        private readonly List<Transactions> _transactionLog;

        public TransactionsCheckerPlugin()
        {
            _transactionLog = GenerateMockTransactions();
        }

        [KernelFunction("AnalyzeTransaction")]
        [Description("Analyzes if the new transaction aligns with user's history using AI.")]
        public string AnalyzeTransaction( string transactionJson)
        {
            var transactionLogJson = JsonSerializer.Serialize(_transactionLog);
            var prompt = $@"
You are a financial fraud analyst AI. 

Here is the user's transaction history:
{transactionLogJson}

Here is the new transaction to evaluate:
{transactionJson}

Based on the trend of the transaction history, determine whether this transaction is suspicious or not. 
Explain your reasoning clearly and in simple terms. Respond strictly in this JSON format. no word in front or back. just json: healthStatus,suspicionLevel, variation from norm, explanation. all should between mild, moderate, severe, and critical";

            return prompt;
        }

        private List<Transactions> GenerateMockTransactions()
        {
            var categories = new[] { "food", "transfer", "airtime", "shopping", "utilities" };
            var rnd = new Random();
            var list = new List<Transactions>();

            for (int i = 1; i <= 20; i++)
            {
                list.Add(new Transactions
                {
                    TransactionId = $"TXN{i:000}",
                    UserId = i <= 15 ? "user1" : "user2",
                    Category = categories[rnd.Next(categories.Length)],
                    Amount = rnd.Next(500, 5000),
                    Date = DateTime.UtcNow.AddDays(-rnd.Next(30))
                });
            }

            return list;
        }
    }
}
