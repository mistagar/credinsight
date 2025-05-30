namespace backend.Models
{
    public class TransactionAnalysis
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid RiskAssessmentId { get; set; }
        public string HealthStatus { get; set; } = string.Empty; // mild, moderate, severe, critical
        public string SuspicionLevel { get; set; } = string.Empty; // mild, moderate, severe, critical
        public string VariationFromNorm { get; set; } = string.Empty; // mild, moderate, severe, critical
        public string Explanation { get; set; } = string.Empty;
        public string TransactionPatterns { get; set; } = string.Empty; // JSON of detected patterns
        public DateTime AnalyzedAt { get; set; }

        // Navigation properties
        public Customer Customer { get; set; }
        public RiskAssessment RiskAssessment { get; set; }
    }
}
