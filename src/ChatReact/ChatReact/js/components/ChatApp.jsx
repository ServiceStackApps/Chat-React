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
		var links = this.props.isAuthenticated
			? null
			: <div>
				<a href="/auth/twitter" className="twitter"></a>
				<a href="/auth/facebook" className="facebook"></a>
				<a href="/auth/github" className="github"></a>				
			  </div>;

		return (
			<div id="top">
				<a href="https://github.com/ServiceStackApps/LiveDemos">
					<img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/img/artwork/logo-32-inverted.png" 
	 					 style={{height: '28px', padding: '10px 0 0 0' }} />
				</a>
				<div id="social">
					<div id="welcome"></div>					
					{links}
				</div>
				<ul id="channels" style={{margin: '0 0 0 30px'}}>
					<li>
						{this.props.channel}
					</li>
					<li style={{background: 'none', padding: '0 0 0 5px'}}>
						<button onClick={this.openChannel}>+</button>
						<span style={{fontSize: '13px', color: '#ccc'}} onclick={this.clearHistory}>clear</span>
					</li>
				</ul>
			</div>
		);
	}
});

var Sidebar = React.createClass({
	render: function() {
		return (
			<div id="right">
				<div id="users"></div>
				<div id="examples" data-click="sendCommand">
					<span style={{position: 'absolute', top: '2px', right: '7px'}} data-click="toggleExamples">hide</span>
					<h4><a href="https://github.com/ServiceStackApps/Chat#global-event-handlers">Example Commands</a></h4>
					<div>/cmd.announce This is your captain speaking ...</div>
					<div>/cmd.toggle$#channels</div>
					<h4><a href="https://github.com/ServiceStackApps/Chat#modifying-css-via-jquery">CSS</a></h4>
					<div>/css.background-image url(http://bit.ly/1oQqhtm)</div>
					<div>/css.background-image url(http://bit.ly/1yIJOBH)</div>
					<div>@@me /css.background #eceff1</div>
					<div>/css.background$#top #673ab7</div>
					<div>/css.background$#bottom #0091ea</div>
					<div>/css.background$#right #fffde7</div>
					<div>/css.color$#welcome #ff0</div>
					<div>/css.visibility$img,a hidden</div>
					<div>/css.visibility$img,a visible</div>
					<h4><a href="https://github.com/ServiceStackApps/Chat#receivers">Receivers</a></h4>
					<div>/tv.watch http://youtu.be/518XP8prwZo</div>
					<div>/tv.watch https://servicestack.net/img/logo-220.png</div>
					<div>@@me /tv.off</div>
					<div>/document.title New Window Title</div>
					<div>/cmd.addReceiver window</div>
					<div>/window.location http://google.com</div>
					<div>/cmd.removeReceiver window</div>
					<h4><a href="https://github.com/ServiceStackApps/Chat#jquery-events">Triggers</a></h4>
					<div>/trigger.customEvent arg</div>
				</div>
			</div>
		);
	}
});

var Footer = React.createClass({
	setFocus: function(){
		this.value = this.value;
	},
	render: function() {
		return (
			<div id="bottom">
				<input type="text" id="txtMsg" onFocus={this.setFocus} />
				<button id="btnSend">Send</button>
			</div>
		);
	}
});

var ChatApp = React.createClass({
	getInitialState: function () {
		return {isAuthenticated: false};
	},	
	clearHistory: function() {
		$('#log').html('');
	},
	render: function() {
		return (
			<div>
				<Header channel={this.props.channel}
						isAuthenticated={this.props.isAuthenticated} 
						clearHistory={this.clearHistory} />
				<div id="announce"></div>
				<div id="tv"></div>
				<Sidebar/>
				<div id="log"></div>
				<Footer/>
			</div>
		);
	}
});

React.render(
	<ChatApp channel={AppData.channel} isAuthenticated={AppData.isAuthenticated} />,
	document.getElementById('app')
);
