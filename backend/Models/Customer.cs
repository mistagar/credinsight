namespace backend.Models
{
    public class Customer
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        // KYC Information
        public string NationalIdNumber { get; set; }
        public string DocumentType { get; set; } // e.g., Passport, DriverLicense
        public bool IsVerified { get; set; }

        // Risk Info
        public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
        public int RiskScore { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<LoginActivity> LoginActivities { get; set; } = new List<LoginActivity>();

    }

}
