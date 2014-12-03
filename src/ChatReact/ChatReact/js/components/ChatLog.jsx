/** @jsx React.DOM */

var ChatLog = React.createClass({
	renderItem: function(o) {
		var user = this.props.users.filter(function(user) { 
			return user.id == o.userId;
		})[0];
		
		var clsId = o.userId ? "u_" + o.userId : "";
		var clsUser = "user " + clsId;

		var clsHighlight = o.msg.indexOf(this.props.activeSub.displayName.replace(" ", "")) >= 0 
			? "highlight " 
			: "";

		var msgId = "m_" + (o.id || "0");
		var clsMsg = 'msg ' + clsHighlight + o.cls;

		var skipUser = this.props.messages[this.props.messages.length -1].userId == o.userId;

		return (
			<div key={msgId} id={msgId} className={clsMsg}>
				{o.userId && !skipUser 
					? <b className={clsUser}>
						<User user={ user || $.extend(o, { displayName: o.userName }) } />
					  </b> 
					: <b className={clsId}>&nbsp;</b>}
				<i>{ $.ss.tfmt12(new Date()) }</i>
				<div>{o.msg}</div>
			</div>
		);
	},
	render: function() {
		return (
			<div id="log">
				{this.props.messages.map(this.renderItem)}
			</div>
		);
	}
});
