using System.Collections.Generic;
using ChatReact.ServiceModel.Types;
using ServiceStack;

namespace ChatReact.ServiceModel
{
    [Route("/chathistory")]
    public class GetChatHistory : IReturn<GetChatHistoryResponse>
    {
        public string[] Channels { get; set; }
        public long? AfterId { get; set; }
        public int? Take { get; set; }
    }

    public class GetChatHistoryResponse
    {
        public List<ChatMessage> Results { get; set; }
        public ResponseStatus ResponseStatus { get; set; }
    }
}