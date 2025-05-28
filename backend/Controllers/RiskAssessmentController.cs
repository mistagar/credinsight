using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RiskAssessmentController : ControllerBase
    {
        private readonly IRiskAssessmentService _riskService;

        public RiskAssessmentController(IRiskAssessmentService riskService)
        {
            _riskService = riskService;
        }

        [HttpPost("assess/{customerId}")]
        public async Task<ActionResult<RiskAssessment>> AssessRisk(Guid customerId)
        {
            var assessment = await _riskService.AssessCustomerRisk(customerId);

            if (assessment == null)
                return NotFound("Customer not found.");

            return Ok(assessment);
        }
    }
}
