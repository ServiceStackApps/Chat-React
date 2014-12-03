/** @jsx React.DOM */

var Header = React.createClass({
	getDefaultProps: function() {
		return { isAuthenticated: false };
	},
	openChannel: function(){
		var chan = prompt('Open another Channel in new Window:','ChannelName'); 
		if (chan) 
			window.open('?channel='+chan.replace(/\s+/g,''));
	},
	render: function() {
		return (
			<div id="top">
				<a href="https://github.com/ServiceStackApps/LiveDemos">
					<img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/img/artwork/logo-32-inverted.png" 
	 					 style={{height: '28px', padding: '10px 0 0 0' }} />
				</a>
				<div id="social">
					<div id="welcome">
						{this.props.activeSub 
							? <span>
								<span>Welcome, {this.props.activeSub.displayName}</span>
								<img src={this.props.activeSub.profileUrl} />
							  </span>
							: null} 
					</div>					
					{this.props.isAuthenticated
						? null
						: <span>
							<a href="/auth/twitter" className="twitter"></a>
							<a href="/auth/facebook" className="facebook"></a>
							<a href="/auth/github" className="github"></a>				
						  </span>}
				</div>
				<ul id="channels" style={{margin: '0 0 0 30px'}}>
					<li>
						{this.props.channel}
					</li>
					<li style={{background: 'none', padding: '0 0 0 5px'}}>
						<button onClick={this.openChannel}>+</button>
						<span style={{fontSize: 13, color: '#ccc', paddingLeft: 10}} onClick={Actions.removeAllMessages}>clear</span>
					</li>
				</ul>
			</div>
		);
	}
});