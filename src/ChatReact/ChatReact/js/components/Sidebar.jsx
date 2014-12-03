/** @jsx React.DOM */

var Sidebar = React.createClass({
	render: function() {
		return (
			<div id="right">
				<div id="users">
				{this.props.users.map(function(user) { 
					return <User key={user.userId} user={user} />;
				})}
				</div>
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