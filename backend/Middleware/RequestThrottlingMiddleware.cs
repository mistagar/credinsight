using System.Collections.Concurrent;

namespace backend.Middleware
{
    public class RequestThrottlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestThrottlingMiddleware> _logger;
        private static readonly ConcurrentDictionary<string, DateTime> _lastRequestTimes = new();
        private static readonly TimeSpan _minimumInterval = TimeSpan.FromMilliseconds(500); // Minimum 0.5 seconds between KYC requests

        public RequestThrottlingMiddleware(RequestDelegate next, ILogger<RequestThrottlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            // Only throttle KYC analysis endpoint (send-message is used for KYC analysis)
            if (context.Request.Path.StartsWithSegments("/api/AI/send-message", StringComparison.OrdinalIgnoreCase))
            {
                var clientId = GetClientIdentifier(context);
                var now = DateTime.UtcNow;

                if (_lastRequestTimes.TryGetValue(clientId, out var lastRequestTime))
                {
                    var timeSinceLastRequest = now - lastRequestTime;
                    if (timeSinceLastRequest < _minimumInterval)
                    {
                        var waitTime = _minimumInterval - timeSinceLastRequest;
                        _logger.LogWarning($"KYC request throttled for client {clientId}. Must wait {waitTime.TotalSeconds:F1} more seconds");

                        context.Response.StatusCode = 429; // Too Many Requests
                        await context.Response.WriteAsync($"{{\"error\": \"Too many KYC requests. Please wait {waitTime.TotalSeconds:F1} more seconds.\"}}");
                        return;
                    }
                }

                _lastRequestTimes[clientId] = now;

                // Clean up old entries (older than 1 hour)
                var cutoff = now.AddHours(-1);
                var keysToRemove = _lastRequestTimes.Where(kvp => kvp.Value < cutoff).Select(kvp => kvp.Key).ToList();
                foreach (var key in keysToRemove)
                {
                    _lastRequestTimes.TryRemove(key, out _);
                }
            }

            await _next(context);
        }

        private static string GetClientIdentifier(HttpContext context)
        {
            // Use IP address as client identifier
            // In production, you might want to use a more sophisticated approach
            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }
    }
}
