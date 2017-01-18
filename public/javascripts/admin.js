/** @jsx React.DOM */

var CaptureMessageBox = React.createClass({

	getInitialState : function(){
		return({
			username : "",
			message : "",
			image : "",
			password: ""
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

	captureImage : function(event){
		this.setState({
			image : event.target.value
		})
	},

	capturePassword : function(event){
		this.setState({
			password : event.target.value
		})
	},

	saveMessage : function(){
		console.log(this.state.username);
		console.log(this.state.message);
		console.log(this.state.image);
		
		url = "/oxfam-wishes/api/mainpagedata/addTeamStatus";
		data = {
			message : this.state.message,
			username : this.state.username,
			password : this.state.password				
		};
		if( this.state.image ){
			data.image = this.state.image;
		}

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
			      <div className="modal-header bg-success">
			        <button type="button" className="close" data-dismiss="modal">&times;</button>
			        <h5 className="modal-title">How is the team doing? Keep walking!</h5>
			      </div>
			      <div className="modal-body">
				      <form>
				      	<div className="form-group">
				      		<input type="text" className="form-control" id="user-name" placeholder="Your Name.."
				      		onChange={this.captureName}>
				      		</input>
				      	</div>
				      	<div className="form-group">
				      		<textarea className="form-control" id="message-text" placeholder="Status.."
				      		onChange={this.captureMessage}>
				      		</textarea>
				      	</div>
				      	<div className="form-group">
				      		<input className="form-control" id="image-url" placeholder="image url.."
				      		onChange={this.captureImage}>
				      		</input>
				      	</div>
				      	<div className="form-group">
				      		<input className="form-control" id="password-text" type="password" placeholder="password.."
				      		onChange={this.capturePassword}>
				      		</input>
				      	</div>
				      </form>
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.saveMessage}>Save</button>
			      </div>
			    </div>

			</div>
		)
	}
});

var Admin = React.createClass({

	render : function(){
		return(
			<div>
				<div className="well" data-toggle="modal" data-target="#teamStatusModal">Update Team Status</div>
				<div id="teamStatusModal" className="modal fade" role="dialog">
					<CaptureMessageBox />
				</div>
			</div>
		)
		
	}
})

React.render(<Admin /> , document.getElementById('oxfam-admin'));
