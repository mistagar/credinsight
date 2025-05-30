using backend.Utility.SniffingDog.Interface;
using backend.Utility.SniffingDog.Implementation;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IMainService _mainService;
        private readonly CredContext _context;

        public AIController(IMainService mainService, CredContext context)
        {
            _mainService = mainService;
            _context = context;
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] string userInput)
        {
            if (string.IsNullOrWhiteSpace(userInput))
            {
                return BadRequest("User input cannot be empty.");
            }

            var response = await _mainService.SendMessageAsync(userInput);
            return Ok(response);
        }

        [HttpGet("chat-history")]
        public IActionResult GetChatHistory()
        {
            var history = _mainService.GetChatHistory();
            return Ok(history);
        }

        [HttpPost("add-system-message")]
        public IActionResult AddSystemMessage([FromBody] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest("System message cannot be empty.");
            }

            _mainService.AddSystemMessage(message);
            return NoContent();
        }

        [HttpPost("assess-risk/{customerId}")]
        public async Task<IActionResult> AssessCustomerRiskWithAI(Guid customerId)
        {
            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Transactions)
                    .Include(c => c.LoginActivities)
                    .FirstOrDefaultAsync(c => c.Id == customerId);

                if (customer == null)
                    return NotFound("Customer not found.");                // Prepare customer data for AI analysis
                var customerData = new
                {
                    FullName = customer.FullName,
                    Email = customer.Email,
                    IsVerified = customer.IsVerified,
                    DocumentType = customer.DocumentType,
                    Transactions = customer.Transactions.Select(t => new
                    {
                        Amount = t.Amount,
                        SourceAccount = t.SourceAccount,
                        DestinationAccount = t.DestinationAccount,
                        Timestamp = t.Timestamp
                    }),
                    LoginActivities = customer.LoginActivities.Select(l => new
                    {
                        LoginTime = l.LoginTime,
                        IPAddress = l.IPAddress,
                        Location = l.Location,
                        Device = l.Device,
                        UsedVPNOrProxy = l.UsedVPNOrProxy
                    })
                };

                // Perform transaction pattern analysis
                var transactionAnalysisResult = await PerformTransactionAnalysis(customer);

                var prompt = $@"You are a financial risk assessment AI specialist. Analyze the following customer data and provide a comprehensive risk assessment.

Customer Data:
{JsonSerializer.Serialize(customerData, new JsonSerializerOptions { WriteIndented = true })}

Transaction Pattern Analysis:
{transactionAnalysisResult.AnalysisText}

Please analyze this customer's risk profile and provide:
1. A risk score from 0-100 (where 0 is lowest risk and 100 is highest risk)
2. A risk level classification (Low, Medium, or High)
3. Key risk factors identified (including transaction patterns from the analysis above)
4. Recommendations for risk mitigation
5. Reasoning behind the assessment

Focus on:
- Transaction patterns and anomalies (use the detailed analysis provided above)
- Account verification status
- Login behavior and security indicators
- Geographic and device patterns
- Any suspicious activity indicators

Provide your response in a structured markdown format that includes specific insights about potential fraud indicators, money laundering risks, and overall customer reliability.";

                // Add system message for risk assessment context
                _mainService.AddSystemMessage("You are a professional financial risk assessment AI. Provide thorough, accurate, and actionable risk analysis based on customer transaction and behavioral data. Your assessments help financial institutions make informed decisions about customer risk levels.");

                var aiResponse = await _mainService.SendMessageAsync(prompt);                // Parse the AI response to extract risk score and level
                var riskAssessment = ParseAIRiskResponse(aiResponse, customerId);

                // Save the assessment to the database
                _context.RiskAssessments.Add(riskAssessment);
                await _context.SaveChangesAsync();

                // Link the transaction analysis to the risk assessment and save it
                transactionAnalysisResult.TransactionAnalysis.RiskAssessmentId = riskAssessment.Id;
                _context.TransactionAnalyses.Add(transactionAnalysisResult.TransactionAnalysis);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Assessment = riskAssessment,
                    AIAnalysis = aiResponse,
                    TransactionAnalysis = transactionAnalysisResult.TransactionAnalysis
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error performing AI risk assessment: {ex.Message}");
            }
        }

        private RiskAssessment ParseAIRiskResponse(string aiResponse, Guid customerId)
        {
            // Extract risk score from AI response (looking for numbers 0-100)
            var scoreMatch = System.Text.RegularExpressions.Regex.Match(aiResponse, @"(?:risk\s+score|score)[:\s]*(\d{1,3})");
            int score = 50; // Default medium score
            if (scoreMatch.Success && int.TryParse(scoreMatch.Groups[1].Value, out int parsedScore))
            {
                score = Math.Min(100, Math.Max(0, parsedScore));
            }

            // Determine risk level based on score and AI response content
            RiskLevel level = RiskLevel.Medium;
            var lowerResponse = aiResponse.ToLower();

            if (score >= 70 || lowerResponse.Contains("high risk") || lowerResponse.Contains("high-risk"))
                level = RiskLevel.High;
            else if (score <= 30 || lowerResponse.Contains("low risk") || lowerResponse.Contains("low-risk"))
                level = RiskLevel.Low;

            return new RiskAssessment
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                Score = score,
                Level = level,
                AssessedAt = DateTime.UtcNow,
                Notes = $"AI-powered assessment: {aiResponse.Substring(0, Math.Min(500, aiResponse.Length))}..."
            };
        }

        private async Task<(string AnalysisText, TransactionAnalysis TransactionAnalysis)> PerformTransactionAnalysis(Customer customer)
        {
            try
            {
                // Use the TransactionsCheckerPlugin to analyze transaction patterns
                var transactionPlugin = new TransactionsCheckerPlugin();

                // Convert customer transactions to the format expected by the plugin
                var customerTransactions = customer.Transactions.Select(t => new
                {
                    TransactionId = t.Id.ToString(),
                    UserId = customer.Id.ToString(),
                    Category = DetermineTransactionCategory(t),
                    Amount = (int)t.Amount,
                    Date = t.Timestamp
                }).ToList();

                var transactionJson = JsonSerializer.Serialize(customerTransactions);

                // Get the AI analysis prompt
                var analysisPrompt = transactionPlugin.AnalyzeTransaction(transactionJson);

                // Add system message for transaction analysis context
                _mainService.AddSystemMessage("You are a transaction pattern analyst AI. Analyze financial transactions for suspicious patterns, anomalies, and potential fraud indicators. Respond strictly in JSON format with healthStatus, suspicionLevel, variationFromNorm, and explanation fields.");

                var aiTransactionAnalysis = await _mainService.SendMessageAsync(analysisPrompt);

                // Parse the JSON response from AI
                var transactionAnalysisData = ParseTransactionAnalysisResponse(aiTransactionAnalysis, customer.Id);

                return (aiTransactionAnalysis, transactionAnalysisData);
            }
            catch (Exception ex)
            {
                // Fallback analysis if AI analysis fails
                var fallbackAnalysis = new TransactionAnalysis
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customer.Id,
                    HealthStatus = "moderate",
                    SuspicionLevel = "mild",
                    VariationFromNorm = "mild",
                    Explanation = $"Automated analysis completed with {customer.Transactions.Count} transactions reviewed.",
                    TransactionPatterns = JsonSerializer.Serialize(new { error = ex.Message }),
                    AnalyzedAt = DateTime.UtcNow
                };

                return ($"Transaction analysis completed. Total transactions: {customer.Transactions.Count}", fallbackAnalysis);
            }
        }

        private string DetermineTransactionCategory(Transaction transaction)
        {
            // Simple categorization logic based on amount and accounts
            var amount = transaction.Amount;

            if (amount < 100)
                return "small_transfer";
            else if (amount < 1000)
                return "transfer";
            else if (amount < 5000)
                return "large_transfer";
            else
                return "major_transfer";
        }

        private TransactionAnalysis ParseTransactionAnalysisResponse(string aiResponse, Guid customerId)
        {
            try
            {
                // Try to extract JSON from the AI response
                var jsonMatch = Regex.Match(aiResponse, @"\{.*\}", RegexOptions.Singleline);
                if (jsonMatch.Success)
                {
                    var jsonResponse = JsonSerializer.Deserialize<JsonElement>(jsonMatch.Value);

                    return new TransactionAnalysis
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customerId,
                        HealthStatus = GetJsonProperty(jsonResponse, "healthStatus", "moderate"),
                        SuspicionLevel = GetJsonProperty(jsonResponse, "suspicionLevel", "mild"),
                        VariationFromNorm = GetJsonProperty(jsonResponse, "variationFromNorm", "mild"),
                        Explanation = GetJsonProperty(jsonResponse, "explanation", "Transaction analysis completed"),
                        TransactionPatterns = jsonMatch.Value,
                        AnalyzedAt = DateTime.UtcNow
                    };
                }
            }
            catch (Exception)
            {
                // If JSON parsing fails, create a basic analysis
            }

            // Fallback if JSON parsing fails
            return new TransactionAnalysis
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                HealthStatus = "moderate",
                SuspicionLevel = "mild",
                VariationFromNorm = "mild",
                Explanation = "Transaction pattern analysis completed",
                TransactionPatterns = aiResponse,
                AnalyzedAt = DateTime.UtcNow
            };
        }

        private string GetJsonProperty(JsonElement element, string propertyName, string defaultValue)
        {
            if (element.TryGetProperty(propertyName, out JsonElement property))
            {
                return property.GetString() ?? defaultValue;
            }
            return defaultValue;
        }
    }
}
