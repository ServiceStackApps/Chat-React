var User = React.createClass({
    privateMsg: function(e) {
		Actions.setText("@" + e.target.innerHTML + " ");
    },
    render: function() {
        return ( 
            <div className="user">
                <img src={this.props.user.profileUrl || "/img/no-profile64.png"}/>
                <span onClick={this.privateMsg}>
                    {this.props.user.displayName}
                </span>
            </div>
        );
    }
});