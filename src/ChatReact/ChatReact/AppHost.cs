using System;
using System.IO;
using System.Net;
using System.Net.Mime;
using ChatReact.ServiceInterface;
using Funq;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Configuration;
using ServiceStack.Razor;
using ServiceStack.Redis;
using ServiceStack.Text;

namespace ChatReact
{
    public class AppHost : AppHostBase
    {
        public AppHost()
            : base("Chat", typeof(ServerEventsServices).Assembly)
        {
            var customSettings = "~/appsettings.txt".MapHostAbsolutePath();
            AppSettings = File.Exists(customSettings)
                ? (IAppSettings)new TextFileSettings(customSettings)
                : new AppSettings();
        }

        public override void Configure(Container container)
        {
            Plugins.Add(new SharpPagesFeature());
            Plugins.Add(new ServerEventsFeature());

            MimeTypes.ExtensionMimeTypes["jsv"] = "text/jsv";
            
            SetConfig(new HostConfig {
                DebugMode = AppSettings.Get("DebugMode", false),
                DefaultContentType = MimeTypes.Json,
                AllowFileExtensions = { "jsx" },
                UseCamelCase = true,
            });

            this.CustomErrorHttpHandlers.Remove(HttpStatusCode.Forbidden);

            //Register all Authentication methods you want to enable for this web app.            
            Plugins.Add(new AuthFeature(
                () => new AuthUserSession(),
                new IAuthProvider[] {
                    new TwitterAuthProvider(AppSettings),   //Sign-in with Twitter
                    new FacebookAuthProvider(AppSettings),  //Sign-in with Facebook
                    new GithubAuthProvider(AppSettings),    //Sign-in with GitHub OAuth Provider
                }));

            container.RegisterAutoWiredAs<MemoryChatHistory, IChatHistory>();

            var redisHost = AppSettings.GetString("RedisHost");
            if (redisHost != null)
            {
                container.Register<IRedisClientsManager>(new RedisManagerPool(redisHost));

                container.Register<IServerEvents>(c =>
                    new RedisServerEvents(c.Resolve<IRedisClientsManager>()));
                container.Resolve<IServerEvents>().Start();
            }
        }
    }
}