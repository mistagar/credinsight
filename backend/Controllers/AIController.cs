using backend.Utility.SniffingDog.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IMainService _mainService;

        public AIController(IMainService mainService)
        {
            _mainService = mainService;
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] string userInput)
        {
            if (string.IsNullOrWhiteSpace(userInput))
            {
                return BadRequest("User input cannot be empty.");
            }

            var response = await _mainService.SendMessageAsync(userInput);
            return Ok(response);
        }

        [HttpGet("chat-history")]
        public IActionResult GetChatHistory()
        {
            var history = _mainService.GetChatHistory();
            return Ok(history);
        }

        [HttpPost("add-system-message")]
        public IActionResult AddSystemMessage([FromBody] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest("System message cannot be empty.");
            }

            _mainService.AddSystemMessage(message);
            return NoContent();
        }
    }
}
