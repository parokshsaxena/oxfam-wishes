/** @jsx React.DOM */


/**Renders messages depending upon type is wishes or teamStatus*/
var Page = React.createClass({
	getInitialState : function(){
		return {
			type : "wishes",
			data : "wishes"
		}
	},

	componentWillMount : function(){
		this.setState({
			data : "wishes"
		})
	},

	showWishes : function(){
		this.setState({
			data : "wishes"
		})
	},

	showTeamStatus : function(){
		this.setState({
			data : "team status"
		})
	},

	render : function(){
		return(
			<div>
				<div className="navbar navbar-default bg-primary">
					<ul className="nav nav-pills nav-justified">
						<li role="presentation" className="col-sm-1 " onClick={this.showWishes}><a href="#wishes">Wishes</a></li>
						<li role="presentation" ClassName="col-sm-1 " onClick={this.showTeamStatus}><a href="#teamStatus">Team Status</a></li>
						<li role="presentation" ClassName="col-sm-1"><a href="#Check1">Write your wishes</a></li>
					</ul>
				</div>
				<div className="paroksh">
					<p>{this.state.data}</p>
				</div>

			</div>
		)
	}
})


React.render(<Page /> , document.getElementById('topbar'));