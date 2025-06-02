using Microsoft.AspNetCore.Mvc;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly IRateLimitedAIService _aiService;
        private readonly ICircuitBreakerService _circuitBreaker;
        private readonly ILogger<HealthController> _logger;

        public HealthController(IRateLimitedAIService aiService, ICircuitBreakerService circuitBreaker, ILogger<HealthController> logger)
        {
            _aiService = aiService;
            _circuitBreaker = circuitBreaker;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> CheckHealth()
        {
            try
            {
                var isAvailable = await _aiService.IsServiceAvailableAsync();
                var circuitBreakerOpen = _circuitBreaker.IsOpen();
                var timeUntilReset = _circuitBreaker.GetTimeUntilReset();

                if (circuitBreakerOpen)
                {
                    return Ok(new
                    {
                        status = "degraded",
                        aiService = "circuit_breaker_open",
                        message = $"AI service temporarily unavailable. Circuit breaker opens for {timeUntilReset.TotalMinutes:F1} more minutes",
                        timeUntilReset = timeUntilReset.TotalSeconds
                    });
                }

                if (!isAvailable)
                {
                    return Ok(new
                    {
                        status = "degraded",
                        aiService = "rate_limited",
                        message = "AI service may be experiencing rate limiting"
                    });
                }

                return Ok(new { status = "healthy", aiService = "available" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");
                return StatusCode(500, new { status = "unhealthy", error = ex.Message });
            }
        }

        [HttpGet("ai-status")]
        public IActionResult GetAIStatus()
        {
            var isOpen = _circuitBreaker.IsOpen();
            var timeUntilReset = _circuitBreaker.GetTimeUntilReset();

            return Ok(new
            {
                circuitBreakerOpen = isOpen,
                timeUntilReset = timeUntilReset.TotalSeconds,
                message = isOpen
                    ? $"Circuit breaker is OPEN. Service will be available in {timeUntilReset.TotalMinutes:F1} minutes"
                    : "Circuit breaker is CLOSED. Service is available for requests"
            });
        }
    }
}
