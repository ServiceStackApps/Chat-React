/** @jsx React.DOM */

var source = new EventSource('/event-stream?channel=' + AppData.channel + '&t=' + new Date().getTime()); //disable cache
source.onerror = function (e) {
	console.log(e);
	Actions.logError(e);
};

var ChatApp = React.createClass({
	mixins:[ 
		Reflux.listenTo(MessagesStore,"onMessagesUpdate"), 
		Reflux.listenTo(HistoryStore,"onHistoryUpdate"),
		Reflux.listenTo(UsersStore,"onUsersUpdate")
	],
	templates: {
		youtube: '<iframe width="640" height="360" src="//www.youtube.com/embed/{id}?autoplay=1" frameborder="0" allowfullscreen></iframe>',
		generic: '<iframe width="640" height="360" src="{id}" frameborder="0"></iframe>'
	},
	componentDidMount: function() {
		var $this = this;

		$.ss.eventReceivers = { "document": document };
		$(source).handleServerEvents({
			handlers: {
				onConnect: function (u) {
					$this.setState({ activeSub: u });

					Actions.didConnect();

					$.getJSON("/channels/" + $this.props.channel + "/history", function (r) {
						Actions.addMessages(r.results);
					});

					$this.refreshUsers();
				},
				onReconnect: function () {
					console.log("onReconnect", { newEventSource: this, errorArgs: arguments });
				},
				onJoin: this.refreshUsers,
				onLeave: this.refreshUsers,
				chat: function (m, e) {
					console.log('chat', m);
					Actions.addMessages([m]);
				}
			},
			receivers: {
				tv: {
					watch: function (id) {
						if (id.indexOf('youtube.com') >= 0) {
							var qs = $.ss.queryString(id);
							$("#tv").html(templates.youtube.replace("{id}", qs["v"])).show();
						}
						else if (id.indexOf('youtu.be') >= 0) {
							var v = $.ss.splitOnLast(id, '/')[1];
							$("#tv").html(templates.youtube.replace("{id}", v)).show();
						} else {
							$("#tv").html(templates.generic.replace("{id}", id)).show();
						}
					},
					off: function () {
						$("#tv").hide().html("");
					}
				}
			}
		});
	},
	getInitialState: function () {
		return {
			isAuthenticated: this.props.isAuthenticated, 
			messages: [], 
			history: [], 
			users: [],
			announce: '',
			activeSub: null
		};
	},	
    refreshUsers: function() {
        $.getJSON("/event-subscribers?channel=" + this.props.channel, function (users) {
            usersMap = {};
            $.map(users, function (user) { 
				usersMap[user.userId] = user; 
			});
            Actions.setUsers($.map(usersMap, function(user) { 
				return user; 
			}));
        });
    },
	onMessagesUpdate: function(messages) {
		this.setState({ messages: messages });
	},
	onHistoryUpdate: function(history) {
		this.setState({ history: history });
	},
	onUsersUpdate: function(users) {
		this.setState({ users: users });
	},
	showError: function(errorMsg) {
		this.announce(errorMsg);
	},
	announce: function(msg) {
		var $el = $(this.refs.announce.getDOMNod());
		this.setState({ announce: msg }, function() {
			$el.fadeIn('fast');
		});

		setTimeout(function() { 
			$el.fadeOut('slow');
			this.setState({ announce: '' });
		});
	},
	render: function() {
		return (
			<div>
				<Header channel={this.props.channel} 
						isAuthenticated={this.props.isAuthenticated} 
						activeSub={this.state.activeSub} />

				<div ref="announce" id="announce"></div>
				<div id="tv"></div>
				<Sidebar users={this.state.users} />

				<ChatLog messages={this.state.messages} 
						 users={this.state.users} 
						 activeSub={this.state.activeSub} />

				<Footer channel={this.props.channel} 
						 activeSub={this.state.activeSub} />
			</div>
		);
	}
});

React.render(
	<ChatApp channel={AppData.channel} isAuthenticated={AppData.isAuthenticated} />,
	document.getElementById('app')
);

