var User = React.createClass({
    handleClick: function() {
        Actions.userSelected(this.props.user);
    },
    render: function() {
        return ( 
            <div className="user">
                <img src={this.props.user.profileUrl || "/img/no-profile64.png"}/>
                <span onClick={this.handleClick}>
                    {this.props.user.displayName}
                </span>
            </div>
        );
    }
});