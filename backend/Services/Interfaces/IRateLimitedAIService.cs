using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel;

namespace backend.Services.Interfaces
{
    public interface IRateLimitedAIService
    {
        Task<string> SendMessageWithRetryAsync(string userInput, int maxRetries = 3);
        Task<bool> IsServiceAvailableAsync();
        void AddSystemMessage(string message);
        IEnumerable<ChatMessageContent> GetChatHistory();
    }
}
