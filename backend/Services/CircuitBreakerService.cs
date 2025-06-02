using backend.Services.Interfaces;

namespace backend.Services
{
    public class CircuitBreakerService : ICircuitBreakerService
    {
        private readonly object _lock = new object();
        private DateTime _lastFailureTime = DateTime.MinValue;
        private int _consecutiveFailures = 0;
        private readonly TimeSpan _circuitBreakerDelay = TimeSpan.FromMinutes(5);
        private readonly int _maxConsecutiveFailures = 3;

        public bool IsOpen()
        {
            lock (_lock)
            {
                return _consecutiveFailures >= _maxConsecutiveFailures &&
                       DateTime.UtcNow - _lastFailureTime < _circuitBreakerDelay;
            }
        }

        public void RecordSuccess()
        {
            lock (_lock)
            {
                _consecutiveFailures = 0;
            }
        }

        public void RecordFailure()
        {
            lock (_lock)
            {
                _consecutiveFailures++;
                _lastFailureTime = DateTime.UtcNow;
            }
        }

        public TimeSpan GetTimeUntilReset()
        {
            lock (_lock)
            {
                if (!IsOpen())
                    return TimeSpan.Zero;

                var timeUntilReset = _circuitBreakerDelay - (DateTime.UtcNow - _lastFailureTime);
                return timeUntilReset > TimeSpan.Zero ? timeUntilReset : TimeSpan.Zero;
            }
        }
    }
}
