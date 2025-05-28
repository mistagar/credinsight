using backend.Models;

namespace backend.Services.Interfaces
{
    public interface IRiskAssessmentService
    {
        Task<RiskAssessment?> AssessCustomerRisk(Guid customerId);
    }
}
