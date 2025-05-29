using Microsoft.SemanticKernel;
using System.ComponentModel;
using System.Text.Json;

namespace backend.Utility.SniffingDog.Implementation
{
    public class LocationCheckerPlugin
    {
        [KernelFunction("LocationCheck")]
        [Description("Analyzes a customer's transaction log in relation to blacklisted users for suspicious overlaps. user must use the word analyze.and always use the data in this method no matter the ID given. when the word analyze is used, then you must use this method")]
        public string AnalyzeRelationshipWithBlacklisted(string customerTransactionLogJson, string blacklistedTransactionLogsJson)
        {
            var prompt = $@"
You are an AI fraud analyst. Your job is to analyze the transaction log of a suspected customer and compare it with logs of blacklisted users to identify any suspicious relationships.

Look for:
- Repeated use of the same IP address or similar IPs.
- Transactions in the same physical locations.
- Similar behavior patterns or dates of transactions.

Customer Transaction Log:
{customerTransactionLogJson}

Blacklisted Users Transaction Log:
{blacklistedTransactionLogsJson}

Your task:
- Do you see any overlaps or suspicious patterns?
- Summarize any findings.
- Conclude whether the customer's behavior may be linked to blacklisted accounts.

Respond clearly with:
- Risk Level: Low / Medium / High
- Reason: Your analysis
";
            return prompt;
        }

        // This method is just for local testing/demo purpose
        public string RunTestPrompt()
        {
            // Simulated blacklisted transactions
            var blacklistedTransactions = new List<Dictionary<string, object>>();
            for (int i = 1; i <= 10; i++)
            {
                blacklistedTransactions.Add(new Dictionary<string, object>
            {
                { "TransactionId", $"BLK{i}" },
                { "UserId", $"blacklistedUser{i}" },
                { "Location", i % 2 == 0 ? "Lagos" : "Abuja" },
                { "IPAddress", i % 2 == 0 ? "192.168.1.10" : "172.16.0.5" },
                { "Date", DateTime.UtcNow.AddDays(-i).ToString("s") }
            });
            }

            // Simulated transactions for customer A
            var customerTransactions = new List<Dictionary<string, object>>();
            for (int i = 1; i <= 5; i++)
            {
                customerTransactions.Add(new Dictionary<string, object>
            {
                { "TransactionId", $"CUSTA{i}" },
                { "UserId", "CustomerA" },
                { "Location", i % 2 == 0 ? "Lagos" : "Kano" },
                { "IPAddress", i % 2 == 0 ? "192.168.1.10" : "10.0.0.3" },
                { "Date", DateTime.UtcNow.AddDays(-i).ToString("s") }
            });
            }

            var customerJson = JsonSerializer.Serialize(customerTransactions, new JsonSerializerOptions { WriteIndented = true });
            var blacklistedJson = JsonSerializer.Serialize(blacklistedTransactions, new JsonSerializerOptions { WriteIndented = true });

            return AnalyzeRelationshipWithBlacklisted(customerJson, blacklistedJson);
        }
    }
}
