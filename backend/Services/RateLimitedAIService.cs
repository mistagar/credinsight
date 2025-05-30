using backend.Services.Interfaces;
using backend.Utility.SniffingDog.Interface;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel;
using System.Net;

namespace backend.Services
{
    public class RateLimitedAIService : IRateLimitedAIService
    {
        private readonly IMainService _mainService;
        private readonly ILogger<RateLimitedAIService> _logger;
        private readonly ICircuitBreakerService _circuitBreaker;

        public RateLimitedAIService(IMainService mainService, ILogger<RateLimitedAIService> logger, ICircuitBreakerService circuitBreaker)
        {
            _mainService = mainService;
            _logger = logger;
            _circuitBreaker = circuitBreaker;
        }
        public async Task<string> SendMessageWithRetryAsync(string userInput, int maxRetries = 3)
        {
            // Check circuit breaker
            if (_circuitBreaker.IsOpen())
            {
                var timeUntilReset = _circuitBreaker.GetTimeUntilReset();
                _logger.LogWarning($"Circuit breaker is open. Service temporarily unavailable for {timeUntilReset.TotalMinutes:F1} more minutes.");
                throw new InvalidOperationException($"AI service is temporarily unavailable due to rate limiting. Please try again in {timeUntilReset.TotalMinutes:F1} minutes.");
            }

            for (int attempt = 0; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var result = await _mainService.SendMessageAsync(userInput);

                    // Reset failure count on success
                    _circuitBreaker.RecordSuccess();
                    return result;
                }
                catch (Exception ex) when (IsRateLimitException(ex))
                {
                    _logger.LogWarning($"Rate limit hit on attempt {attempt + 1}. Error: {ex.Message}");

                    _circuitBreaker.RecordFailure();

                    if (attempt == maxRetries)
                    {
                        _logger.LogError($"Max retries ({maxRetries}) exceeded for AI request.");
                        throw new InvalidOperationException($"AI service is currently rate limited. Please try again in a few minutes. Original error: {ex.Message}");
                    }

                    // Exponential backoff with jitter
                    var delay = CalculateDelay(attempt);
                    _logger.LogInformation($"Waiting {delay.TotalSeconds} seconds before retry...");
                    await Task.Delay(delay);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Non-retryable error in AI request: {ex.Message}");
                    throw;
                }
            }

            throw new InvalidOperationException("Unexpected error: retry loop completed without success or exception.");
        }
        public Task<bool> IsServiceAvailableAsync()
        {
            return Task.FromResult(!_circuitBreaker.IsOpen());
        }

        public void AddSystemMessage(string message)
        {
            _mainService.AddSystemMessage(message);
        }

        public IEnumerable<ChatMessageContent> GetChatHistory()
        {
            return _mainService.GetChatHistory();
        }

        private static bool IsRateLimitException(Exception ex)
        {
            var message = ex.Message.ToLower();
            return message.Contains("429") ||
                   message.Contains("rate limit") ||
                   message.Contains("quota") ||
                   message.Contains("too many requests") ||
                   (ex is HttpRequestException httpEx && httpEx.Data.Contains("StatusCode") &&
                    httpEx.Data["StatusCode"]?.ToString() == "429");
        }

        private static TimeSpan CalculateDelay(int attempt)
        {
            // Exponential backoff: 2^attempt seconds, with jitter and max cap
            var baseDelay = Math.Pow(2, attempt);
            var jitter = new Random().NextDouble() * 0.5; // 0-50% jitter
            var totalSeconds = Math.Min(baseDelay * (1 + jitter), 60); // Cap at 60 seconds

            return TimeSpan.FromSeconds(totalSeconds);
        }
    }
}
