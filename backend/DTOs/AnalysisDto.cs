namespace backend.DTOs
{
    public class TransactionAnalysisRequest
    {
        public string CustomerId { get; set; } = string.Empty;
        public List<TransactionForAnalysis> Transactions { get; set; } = new();
    }

    public class TransactionForAnalysis
    {
        public string TransactionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }

    public class LocationAnalysisRequest
    {
        public string CustomerId { get; set; } = string.Empty;
        public List<LoginActivityForAnalysis> LoginActivities { get; set; } = new();
    }

    public class LoginActivityForAnalysis
    {
        public string TransactionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string IPAddress { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
