var ChatApp = React.createClass({
    mixins:[ 
        Reflux.listenTo(ChannelStore,"onChannelChanged"), 
        Reflux.listenTo(MessagesStore,"onMessagesUpdate"), 
        Reflux.listenTo(UsersStore,"onUsersUpdate"),
        Reflux.listenTo(Actions.announce,"announce"),
        Reflux.listenTo(Actions.showError,"showError")
    ],
    templates: {
        youtube: function(id) {
            var url = '//www.youtube.com/embed/' + id + '?autoplay=1';
            return (
                <iframe width="640" height="360" src={url} frameBorder="0" allowFullScreen></iframe>
            );
        },
        generic: function(url) {
            return (
                <iframe width="640" height="360" src={url} frameBorder="0"></iframe>
            );
        }
    },
    getInitialState: function () {
        return {
            isAuthenticated: this.props.isAuthenticated, 
            tvUrl: null,
            channels: null,
            messages: [], 
            users: [],
            announce: '',
            activeSub: null
        };
    },  
    componentDidMount: function() {
        var $this = this;

        Actions.channelSelected(this.props.channel);
        this.source = new EventSource(this.props.eventStreamUrl); //disable cache
        this.source.onerror = function (e) {
            Actions.logError(e);
        };
        $.ss.eventReceivers = { "document": document };
        $(this.source).handleServerEvents({
            handlers: {
                onConnect: function (u) {
                    $this.setState({ activeSub: u });

                    Actions.didConnect();

                    $.getJSON($this.props.chatHistoryUrl, function (r) {
                        Actions.addMessages(r.results);
                    });

                    Actions.refreshUsers();
                },
                onReconnect: function () {
                    console.log("onReconnect", { newEventSource: this, errorArgs: arguments });
                },
                onJoin: Actions.refreshUsers,
                onLeave: Actions.refreshUsers,
                chat: function (msg, e) {
                    msg.channel = e.channel;
                    Actions.addMessages([msg]);
                }
            },
            receivers: {
                tv: {
                    watch: this.tvOn,
                    off: this.tvOff
                }
            }
        });
    },
    onMessagesUpdate: function(messages) {
        var $this = this;
        this.setState({ messages: messages }, function(){
            if (!$this.refs.chatLog) return;
            $($this.refs.chatLog.refs.log.getDOMNode()).scrollTop(1E10);
        });
    },
    onUsersUpdate: function(users) {
        this.setState({ users: users });
    },
    showError: function(errorMsg) {
        this.announce(errorMsg);
    },
    announce: function(msg) {
        var $this = this,
            $el = $(this.refs.announce.getDOMNode());

        this.setState({ announce: msg }, function() {
            $el.fadeIn('fast');
        });

        setTimeout(function() { 
            $el.fadeOut('slow');
            $this.setState({ announce: '' });
        }, 2000);
    },
    tvOn: function(id) {
        if (id.indexOf('youtube.com') >= 0) {
            var qs = $.ss.queryString(id);
            this.setState({ tvUrl: this.templates.youtube(qs["v"]) });
        }
        else if (id.indexOf('youtu.be') >= 0) {
            var v = $.ss.splitOnLast(id, '/')[1];
            this.setState({ tvUrl: this.templates.youtube(v) });
        } else {
            this.setState({ tvUrl: this.templates.generic(id) });
        }
    },
    tvOff: function() {
        this.setState({ tvUrl: null });
    },
    onChannelChanged: function (channels) {
        var $this = this;
        this.setState({ channels: channels }, function(){
            $this.refs.footer.refs.txtMsg.getDOMNode().focus();
        });
    },
    render: function() {
        if (this.state.channels == null) return null;
        var showTv = this.state.tvUrl ? 'block' : 'none';
        return (
            <div>
                <Header channels={this.state.channels} 
                        isAuthenticated={this.props.isAuthenticated} 
                        activeSub={this.state.activeSub} />

                <div ref="announce" id="announce">{this.state.announce}</div>
                <div ref="tv" id="tv" style={{display: showTv}}>{this.state.tvUrl}</div>
                <Sidebar users={this.state.users} />

                <ChatLog ref="chatLog"
                         messages={this.state.messages} 
                         users={this.state.users} 
                         activeSub={this.state.activeSub} />

                <Footer ref="footer" channel={this.state.channels.selected}  
                        users={this.state.users} 
                        activeSub={this.state.activeSub} />
            </div>
        );
    }
});

React.render(
    <ChatApp channel={AppData.selectedChannel}
             isAuthenticated={AppData.isAuthenticated} 
             eventStreamUrl={AppData.eventStreamUrl}
             chatHistoryUrl={AppData.chatHistoryUrl} />,
    document.getElementById('app')
);
