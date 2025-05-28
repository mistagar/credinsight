namespace backend.Models
{
    public class LoginActivity
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }

        public DateTime LoginTime { get; set; }
        public string IPAddress { get; set; }
        public string Location { get; set; }
        public string Device { get; set; }
        public bool UsedVPNOrProxy { get; set; }
    }

}
