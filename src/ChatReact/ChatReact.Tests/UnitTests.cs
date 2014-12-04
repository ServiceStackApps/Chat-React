using System;
using ChatReact.ServiceModel.Types;
using NUnit.Framework;
using ServiceStack;
using ServiceStack.Testing;
using ChatReact.ServiceModel;
using ChatReact.ServiceInterface;

namespace ChatReact.Tests
{
    [TestFixture]
    public class UnitTests
    {
        private readonly ServiceStackHost appHost;

        public UnitTests()
        {
            appHost = new BasicAppHost(typeof(ServerEventsServices).Assembly)
            {
                ConfigureContainer = container =>
                {
                    //Add your IoC dependencies here
                    container.RegisterAutoWiredAs<MemoryChatHistory, IChatHistory>();
                }
            }
            .Init();
        }

        [TestFixtureTearDown]
        public void TestFixtureTearDown()
        {
            appHost.Dispose();
        }

        [Test]
        public void Can_store_and_retrieve_messages_in_ChatHistory()
        {
            appHost.Container.Resolve<IChatHistory>().Log(
                channel:"test", 
                msg: new ChatMessage { Id = 1, DisplayName = "Test", Message = "Test Message" });

            var service = appHost.Container.Resolve<ServerEventsServices>();

            var response = (GetChatHistoryResponse)service.Any(new GetChatHistory { Channel = "test" });

            Assert.That(response.Results.Count, Is.EqualTo(1));
            Assert.That(response.Results[0].Message, Is.EqualTo("Test Message"));
        }
    }
}
