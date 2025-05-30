namespace backend.Services.Interfaces
{
    public interface ICircuitBreakerService
    {
        bool IsOpen();
        void RecordSuccess();
        void RecordFailure();
        TimeSpan GetTimeUntilReset();
    }
}
