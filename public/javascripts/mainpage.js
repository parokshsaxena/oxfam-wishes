/** @jsx React.DOM */

var dataWishes = [{
	message : "This is my message for your team",
	time : "14jan 12 pm"
},
{
	message : "This is my 2nd message for your team",
	time : "14jan 3 pm"
},
{
	message : "This is my message for your team",
	time : "14jan 12 pm"
},
{
	message : "This is my 2nd message for your team",
	time : "14jan 3 pm"
},
{
	message : "This is my message for your team",
	time : "14jan 12 pm"
},
{
	message : "This is my 2nd message for your team",
	time : "14jan 3 pm"
},
{
	message : "This is my message for your team",
	time : "14jan 12 pm"
},
{
	message : "This is my 2nd message for your team",
	time : "14jan 3 pm"
},
{
	message : "This is my message for your team",
	time : "14jan 12 pm"
},
{
	message : "This is my 2nd message for your team",
	time : "14jan 3 pm"
},]

var dataTeamStatus = [{
	message : "team message 1",
	time : "14jan 12 pm"
},
{
	message : "team message 2",
	time : "14jan 12 pm"
},
{
	message : "team message 1",
	time : "14jan 12 pm"
},
{
	message : "team message 2",
	time : "14jan 12 pm"
},
{
	message : "team message 1",
	time : "14jan 12 pm"
},
{
	message : "team message 2",
	time : "14jan 12 pm"
},
{
	message : "team message 1",
	time : "14jan 12 pm"
},
{
	message : "team message 2",
	time : "14jan 12 pm"
},]
/*var Messages = React.createClass({

})*/

var MessageBox = React.createClass({

	render : function(){
		message = this.props.messageDetails.message;
		time = this.props.messageDetails.time;
		return(
			<div className="well well-sm center-block">
				<p>{message}</p>
				<p>{time}</p>
			</div>
		)
	}
})


/**Renders messages depending upon type is wishes or teamStatus*/
var Page = React.createClass({
	getInitialState : function(){
		return {
			type : "wishes"
		}
	},

	componentWillMount : function(){
		this.setState({
			data : dataWishes
		})
	},

	showWishes : function(){
		this.setState({
			data : dataWishes
		})
	},

	showTeamStatus : function(){
		this.setState({
			data : dataTeamStatus
		})
	},

	render : function(){
		rows = [];
		this.state.data.forEach(function(eachMessageDetail){
			rows.push(<MessageBox messageDetails={eachMessageDetail}/>);
		})

		return(
			<div>
				<div className="navbar navbar-default bg-primary navbar-fixed-top">
				
					<ul className="nav nav-pills nav-justified">
						<li role="presentation" className="col-sm-1 " onClick={this.showWishes}><a href="#wishes">Wishes</a></li>
						<li role="presentation" ClassName="col-sm-1 " onClick={this.showTeamStatus}><a href="#teamStatus">Team Status</a></li>
						<li role="presentation" ClassName="col-sm-1"><a href="#Check1">Write your wishes</a></li>
					</ul>
					
					</div>
					<div>
						{rows}
					</div>
				
			</div>
		)
	}
})


React.render(<Page /> , document.getElementById('page'));