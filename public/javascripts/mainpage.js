/** @jsx React.DOM */

var MessageBox = React.createClass({

	render : function(){
		message = this.props.messageDetails.message;
		time = this.props.messageDetails.time;
		username = this.props.messageDetails.username;
		return(
			<div className="well well-sm center-block " style={{"border-radius" : "10px"}}>
				<h4 className="text-center">{message}</h4><small> - {username} ( {time} )</small>
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

		url = "/oxfam-wishes/api/mainpagedata/addUserMessage";
		data = {
			message : this.state.message,
			username : this.state.username
		};

		$.ajax({
			url : url,
			type: "POST",
			contentType : 'application/json',
			data : JSON.stringify(data),
			success : function(result){
				console.log("Successfully saved ",result)
			}.bind(this),
			error : function(result){
				console.log("Failure ",result)
			}

		})
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
			type : "wishes",
			data : []
		}
	},

	componentWillMount : function(){
		url = "/oxfam-wishes/api/mainpagedata/getUserMessages"
		$.ajax({
			url : url,
			type : 'GET',
			success : function(data){
				console.log("Inside this")
				console.log(data)
				this.setState({
					data : data
				})
			}.bind(this)
		})
	},

	showWishes : function(){
		url = "/oxfam-wishes/api/mainpagedata/getUserMessages"
		$.ajax({
			url : url,
			type : 'GET',
			success : function(data){
				this.setState({
					data : data
				})
			}.bind(this)
		})		
	},

	showTeamStatus : function(){
		url = "/oxfam-wishes/api/mainpagedata/getTeamStatus"
		$.ajax({
			url : url,
			type : 'GET',
			success : function(data){
				this.setState({
					data : data
				})
			}.bind(this)
		})
		
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