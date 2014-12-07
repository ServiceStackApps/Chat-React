var Footer = React.createClass({
    mixins:[ 
        Reflux.listenTo(Actions.userSelected,"userSelected"), 
        Reflux.listenTo(Actions.setText,"setText")
    ],
    getInitialState: function () {
        return {
            value:'',
            historyIndex: -1,
            msgHistory: []
        };
    },  
    componentDidMount: function() {
        this.refs.txtMsg.getDOMNode().focus();
    },
    postMsg: function(){
        var txtMsg = this.refs.txtMsg.getDOMNode();
        var msg = txtMsg.value, 
            parts, 
            to = null,
            activeSub = this.props.activeSub;

        if (msg) {
            this.state.msgHistory.push(msg);
        }

        if (msg[0] == '@') {
            parts = $.ss.splitOnFirst(msg, " ");
            var toName = parts[0].substring(1);
            if (toName == "me") {
                to = activeSub.userId;
            } else {
                var toUser = this.props.users.filter(function(user) { 
                    return user.displayName === toName.toLowerCase();
                })[0];
                to = toUser ? toUser.userId : null;
            }
            msg = parts[1];
        }
        if (!msg || !activeSub) return;
        var onError = function (e) {
            if (e.responseJSON && e.responseJSON.responseStatus)
                Actions.showError(e.responseJSON.responseStatus.message);
        };

        if (msg[0] == "/") {
            parts = $.ss.splitOnFirst(msg, " ");
            $.post("/channels/" + this.props.channel + "/raw", { 
                    from: activeSub.id, 
                    toUserId: to, 
                    message: parts[1], 
                    selector: parts[0].substring(1) 
                }, 
                function(){}
            ).fail(onError);
        } else {
            $.post("/channels/" + this.props.channel + "/chat", { 
                    from: activeSub.id, 
                    toUserId: to, 
                    message: msg, 
                    selector: "cmd.chat" 
                }, 
                function(){}
            ).fail(onError);
        }

        this.setState({ value: '' });
    },
    userSelected: function(user) {
        this.setText("@" + user.displayName + " ");
    },
    setText: function(txt) {
        var txtMsg = this.refs.txtMsg.getDOMNode();
        this.setState({ value: txt }, function(){
            txtMsg.focus();
        });
    },
    handleChange: function(e) {
        this.setState({ value: e.target.value });
    },
    handleKeyDown: function(e) {
        var $this = this;
        var keycode = e.keyCode;
        var value = this.state.value;

        if ($.ss.getSelection()) {
            if (keycode == '9' || keycode == '13' || keycode == '32' || keycode == '39') {
                
                value += ' ';
                this.setState({ value: value }, function() {
                    var txtMsg = $this.refs.txtMsg.getDOMNode();
                    if (txtMsg.setSelectionRange) 
                        txtMsg.setSelectionRange(value.length, value.length);
                });
        
                e.preventDefault();
                return;
            }
        }

        var msgHistory = this.state.msgHistory;
        if (keycode == '13') { //enter
            this.state.historyIndex = -1;
            this.postMsg();
        } else if (keycode == '38') { //up arrow
            this.state.historyIndex = Math.min(++this.state.historyIndex, msgHistory.length);
            this.setState({ value: this.state.msgHistory[msgHistory.length - 1 - this.state.historyIndex] });
            e.preventDefault();
        }
        else if (keycode == '40') { //down arrow
            this.state.historyIndex = Math.max(--this.state.historyIndex, -1);
            this.setState({ value: msgHistory[msgHistory.length - 1 - this.state.historyIndex] });
        } else {
            this.state.historyIndex = -1;
        }
    },
    handleKeyUp: function(e) {
        var $this = this;
        var value = this.state.value,
            activeSub = this.props.activeSub;

        if (!$.ss.getSelection() && value[0] == '@' && value.indexOf(' ') < 0) {
            var partialVal = value.substring(1);

            var matchingNames = this.props.users
                .map(function (x) { return x.displayName.replace(" ", ""); })
                .filter(function (x) {
                    return x.substring(0, partialVal.length).toLowerCase() === partialVal.toLowerCase()
                        && x.toLowerCase() != activeSub.displayName.toLowerCase();
                  });

            if (matchingNames.length > 0) {
                value += matchingNames[0].substring(partialVal.length);

                this.setState({ value: value }, function() {
                    var txtMsg = $this.refs.txtMsg.getDOMNode();
                    if (txtMsg.setSelectionRange) 
                        txtMsg.setSelectionRange(partialVal.length + 1, value.length);
                });
            }
        }
    },
    render: function() {
        return (
            <div id="bottom">
                <input ref="txtMsg" id="txtMsg" 
                       type="text" 
                       value={this.state.value}
                       onChange={this.handleChange}
                       onKeyDown={this.handleKeyDown}
                       onKeyUp={this.handleKeyUp} />
                <button id="btnSend" style={{marginLeft: 5}} onClick={this.postMsg}>Send</button>
            </div>
        );
    }
});
