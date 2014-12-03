/** @jsx React.DOM */

var Footer = React.createClass({
	mixins:[ Reflux.listenToMany(Actions) ],
	getInitialState: function () {
		return {value:''};
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

        Actions.recordMessage(msg);

        if (msg[0] == "@") {
            parts = $.ss.splitOnFirst(msg, " ");
            var toName = parts[0].substring(1);
            if (toName == "me") {
                to = activeSub.userId;
            } else {
                var matches = $.grep($("#users .user span"),
                    function (x) { return x.innerHTML.replace(" ", "").toLowerCase() === toName.toLowerCase(); });
                to = matches.length > 0 ? matches[0].getAttribute("data-id") : null;
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
        if (e.keyCode == 13) {
            this.postMsg();
        }
	},
	render: function() {
		return (
			<div id="bottom">
				<input ref="txtMsg" id="txtMsg" 
					   type="text" 
					   value={this.state.value}
					   onChange={this.handleChange}
					   onKeyDown={this.handleKeyDown} />
				<button id="btnSend" style={{marginLeft: 5}} onClick={this.postMsg}>Send</button>
			</div>
		);
	}
});
