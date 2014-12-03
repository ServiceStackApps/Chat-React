/** @jsx React.DOM */

var User = React.createClass({
    render: function() {
        var user = this.props.user;
        var cls = "user u_" + user.userId;
        return ( 
            <div className={cls}><img src={user.profileUrl || "/img/no-profile64.png"}/>
                <span data-id={user.userId} data-click="privateMsg">
                    {user.displayName}
                </span>
            </div>
        );
    }
});