var User = React.createClass({
    render: function() {
        return ( 
            <div className="user"><img src={this.props.user.profileUrl || "/img/no-profile64.png"}/>
                <span data-id={this.props.user.userId} data-click="privateMsg">
                    {this.props.user.displayName}
                </span>
            </div>
        );
    }
});