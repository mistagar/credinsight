namespace backend.Utility.SniffingDog.Models
{
    public class Transactions
    {
        public string TransactionId { get; set; }
        public string UserId { get; set; }
        public string Category { get; set; } // e.g., "food", "transfer", "airtime"
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
