namespace backend.Models
{
    public class RiskAssessment
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public int Score { get; set; }
        public RiskLevel Level { get; set; }
        public DateTime AssessedAt { get; set; }
        public string Notes { get; set; }
    }

}
