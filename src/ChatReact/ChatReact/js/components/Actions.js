var Actions = Reflux.createActions([
    "didConnect",
	"addMessages",
	"removeAllMessages",
	"recordMessage",
    "refreshUsers",
	"showError",
    "logError",
    "announce",
    "userSelected",
    "channelSelected",
    "setText"
]);

var ChannelStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.channelSelected, this.changeChannel);
        this.selected = AppData.selectedChannel;
        this.channels = AppData.channels;
    },
    getData: function() {
        return { selected: this.selected, items: this.channels };
    },
    changeChannel: function (channel) {
        if (!channel) return;
        
        if (this.channels.indexOf(channel) < 0) {
            this.channels.push(channel);
        }
        this.selected = channel;
        this.trigger(this.getData());
    }
});

var MessagesStore = Reflux.createStore({
    init: function () {
        this.listenToMany(Actions);
        this.listenTo(ChannelStore, this.onChannelChanged);
        this.anonMsgId = -1;
        this.channels = ChannelStore.getData();
        this.messages = {};
    },
    notifyAll: function() {
        this.trigger(this.messages[this.channels.selected] || []);
    },
    didConnect: function () {
        this.addMessages([{ message: "CONNECTED!", cls: "open" }]);
    },
    logError: function () {
        this.addMessages([{ message: "ERROR!", cls: "error" }]);
    },
    addMessages: function (msgs) {
        var $this = this;
        msgs.forEach(function (m) {
            $.map($this.channels.items, function (channel) {
                if (m.channel && m.channel !== channel)
                    return;

                var channelMsgs = ($this.messages[channel] || ($this.messages[channel] = []));
                channelMsgs.push({
                    id: m.id || $this.anonMsgId--,
                    channel: m.channel,
                    userId: m.fromUserId,
                    userName: m.fromName,
                    msg: m.message,
                    cls: m.cls || (m.private ? ' private' : '')
                });
            });

        });
        this.notifyAll();
    },
    removeAllMessages: function () {
        this.messages = {};
        this.notifyAll();
    },
    onChannelChanged: function (channels) {
        this.channels = channels;
        this.notifyAll();
    }
});

var UsersStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.refreshUsers, this.refreshUsers);
        this.listenTo(ChannelStore, this.onChannelChanged);
        this.channels = ChannelStore.getData();
        this.users = {};
    },
    notifyAll: function () {
        this.trigger(this.users[this.channels.selected] || []);
    },
    refreshUsers: function () {
        var $this = this;

        $.getJSON(AppData.channelSubscribersUrl, function (users) {
            $this.users = {};
            var usersMap = {};
            $.map(users, function (user) { usersMap[user.userId] = user; });
            $.map(usersMap, function (user) {
                user.channels.split(',').map(function (channel) {
                    var channelUsers = ($this.users[channel] || ($this.users[channel] = []));
                    channelUsers.push(user);
                });
            });

            $this.notifyAll();
        });
    },
    onChannelChanged: function (channels) {
        this.channels = channels;
        this.notifyAll();
    }
});

$(document).bindHandlers({
    announce: Actions.announce,
    toggle: function () {
        $(this).toggle();
    },
    sendCommand: function () {
        if (this.tagName != 'DIV') return;
        Actions.setText($(this).html());
    },
    removeReceiver: function (name) {
        delete $.ss.eventReceivers[name];
    },
    addReceiver: function (name) {
        $.ss.eventReceivers[name] = window[name];
    }
}).on('customEvent', function (e, msg, msgEvent) {
    Actions.addMessages([{ message: "[event " + e.type + " message: " + msg + "]", cls: "event", channel:msgEvent.channel }]);
});

