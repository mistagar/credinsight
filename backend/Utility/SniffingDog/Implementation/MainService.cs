using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel;
using backend.Utility.SniffingDog.Interface;

namespace backend.Utility.SniffingDog.Implementation
{
    public class MainService : IMainService
    {
        private readonly IChatCompletionService _chatService;
        private readonly Kernel _kernel;
        private readonly ChatHistory _chatHistory;

        public MainService (Kernel kernel)
        {
            _kernel = kernel;
            _chatService = kernel.GetRequiredService<IChatCompletionService>();
            _chatHistory = new ChatHistory();

            // Add default system instruction, but keep it generic
            _chatHistory.AddSystemMessage("You are a helpful AI assistant.");
        }

        public void AddSystemMessage(string message)
        {
            _chatHistory.AddSystemMessage(message);
        }

        public async Task<string> SendMessageAsync(string userInput)
        {
            _chatHistory.AddUserMessage(userInput);

            ChatMessageContent reply = await _chatService.GetChatMessageContentAsync(
                _chatHistory,
                kernel: _kernel
            );

            _chatHistory.AddAssistantMessage(reply.ToString());
            return reply.ToString();
        }

        public IEnumerable<ChatMessageContent> GetChatHistory()
        {
            return _chatHistory;
        }
    }
}
