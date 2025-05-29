using Microsoft.SemanticKernel;

namespace backend.Utility.SniffingDog.Interface
{
    public interface IMainService
    {
        Task<string> SendMessageAsync(string userInput);
        IEnumerable<ChatMessageContent> GetChatHistory();
        void AddSystemMessage(string message);
    }
}
