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
				<span>{message}</span>
				<span>{time}</span>
			</div>
		)
	}
})

var CaptureMessageBox = React.createClass({

	getInitialState : function(){
		return({
			username : "",
			message : ""
		})
	},

	captureName : function(event){
		this.setState({
			username : event.target.value
		})
	},

	captureMessage : function(event){
		this.setState({
			message : event.target.value
		})
	},

	saveMessage : function(){
		console.log(this.state.username);
		console.log(this.state.message);
	},

	render : function(){
		return(
			 <div className="modal-dialog">
			    <div className="modal-content">
			      <div className="modal-header">
			        <button type="button" className="close" data-dismiss="modal">&times;</button>
			        <h4 className="modal-title">Your wishes will motivate us. Keep them coming!</h4>
			      </div>
			      <div className="modal-body">
				      <form>
				      	<div className="form-group">
				      		<input type="text" className="form-control" id="user-name" placeholder="Your Name.."
				      		onChange={this.captureName}>
				      		</input>
				      	</div>
				      	<div className="form-group">
				      		<textarea className="form-control" id="message-text" placeholder="Message.."
				      		onChange={this.captureMessage}>
				      		</textarea>
				      	</div>
				      </form>
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.saveMessage}>Save</button>
			      </div>
			    </div>

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

	showWriteMessageBox : function(){

	},
	render : function(){
		rows = [];
		this.state.data.forEach(function(eachMessageDetail){
			rows.push(<MessageBox messageDetails={eachMessageDetail}/>);
		})

		return(
			<div className="container">
				<div className="navbar navbar-default bg-primary navbar-fixed-top">
				
					<ul className="nav nav-pills nav-justified">
						<li role="presentation" className="col-sm-1 " onClick={this.showWishes}><a href="#wishes">Wishes</a></li>
						<li role="presentation" className="col-sm-1 " onClick={this.showTeamStatus}><a href="#teamStatus">Team Status</a></li>
						<li role="presentation" className="col-sm-1" data-toggle="modal" data-target="#messageModal"><a href="#writeWishes">Write your wishes</a></li>
					</ul>
					
				</div>
				<div>
					{rows}
				</div>

				<div id="messageModal" className="modal fade" role="dialog">
				 <CaptureMessageBox />
				</div>	
			</div>

		)
	}
})


React.render(<Page /> , document.getElementById('page'));