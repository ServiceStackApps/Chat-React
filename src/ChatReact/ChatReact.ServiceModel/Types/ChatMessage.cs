namespace ChatReact.ServiceModel.Types
{
    public class ChatMessage
    {
        public long Id { get; set; }
        public string Channel { get; set; }
        public string FromUserId { get; set; }
        public string FromName { get; set; }
        public string DisplayName { get; set; }
        public string Message { get; set; }
        public string UserAuthId { get; set; }
        public bool Private { get; set; }
    }
}