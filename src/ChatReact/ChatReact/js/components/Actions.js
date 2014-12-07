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
    "setText"
]);

var MessagesStore = Reflux.createStore({
    init: function () {
        this.listenToMany(Actions);
        this.anonMsgId = -1;
        this.messages = [];
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
            $this.messages.push({
                id: m.id || $this.anonMsgId--,
                userId: m.fromUserId,
                userName: m.fromName,
                msg: m.message,
                cls: m.cls || (m.private ? ' private' : '')
            });
        });
        this.trigger(this.messages);
    },
    removeAllMessages: function () {
        this.messages = [];
        this.trigger(this.messages);
    }
});

var UsersStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.refreshUsers, this.refreshUsers);
        this.users = [];
    },
    refreshUsers: function () {
        var $this = this;
        $.getJSON(AppData.channelSubscribersUrl, function (users) {
            var usersMap = {};
            $.map(users, function (user) {
                usersMap[user.userId] = user;
            });
            $this.users = $.map(usersMap, function (user) { return user; });
            $this.trigger($this.users);
        });
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
    Actions.addMessages([{ message: "[event " + e.type + " message: " + msg + "]", cls: "event" }]);
});
