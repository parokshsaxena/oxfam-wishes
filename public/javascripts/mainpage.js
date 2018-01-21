/** @jsx React.DOM */

try{//to handle cases where socket.io/socket.io.js is forbidden from places say office
	var socket = io.connect();
}catch(err){
	console.log("Socket connection is not available.");
}

var MessageBox = React.createClass({

	render : function(){
		message = this.props.messageDetails.message;
		time = this.props.messageDetails.time;
		username = this.props.messageDetails.username;
		image = this.props.messageDetails.image;
		if(image == undefined || ( image.match(/\.(jpeg|jpg|gif|png)/) == null )){
			image = "";
		}		
		console.log(image)
		return(
			<div className="well well-sm center-block " style={{"border-radius" : "10px", "background-color" : "#fcf8e3"}}>
				<h5 className="text-center">{message}</h5><small> - {username} ( {time} )</small>
				<div>
				{ image !="" &&
					<img className="img-responsive center-block" style={{"max-width" : "50%"}} src={image}></img>
				}
				</div>
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
			      <div className="modal-header bg-success">
			        <button type="button" className="close" data-dismiss="modal">&times;</button>
			        <h5 className="modal-title">Your wishes will motivate us. Keep them coming!</h5>
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
			        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.saveMessage}>Save</button>
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
			data : [],
			listItems : [
				{
					"name" : "Wishes",
					"selected" : true,
					"code" : "wishes"
				},
				{
					"name" : "Team Status",
					"selected" : false,
					"code" : "status"
				},
				{
					"name" : "Write Your Wishes",
					"selected" : false,
					"code" : "write"
				},
				{
					"name" : "Last Year Wishes",
					"selected" : false,
					"code" : "lastYear"
				}
			]
		}
	},

	componentWillMount : function(){
		url = "/oxfam-wishes/api/mainpagedata/getUserMessages"
		$.ajax({
			url : url,
			type : 'GET',
			success : function(data){
				console.log(data)
				this.setState({
					data : data
				})
			}.bind(this)
		})
	},
	componentDidMount : function(){
		var that = this;
		if( socket != undefined)
		{
			socket.on("wishes-updated",function(){
				console.log("wishes-updated")
				that.showWishes();
			});
			socket.on("teamstatus-updated", function(){
				console.log("teamstatus-updated");
				that.showTeamStatus();
			})	
		}
		
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

	listItemClicked: function(code){
		var self = this;
		return function(){
			var listItems = self.state.listItems;

			listItems.map(function(currItem){
				if(currItem.code == code){
					currItem.selected = true;
				}else{
					currItem.selected = false;
				}
			});
			if(code == "wishes"){
				self.showWishes();
			}else if(code == "status"){
				self.showTeamStatus();
			}else if(code == 'lastYear'){
				self.showLastYearWishes();
			}

			self.setState({
				listItems : listItems
			});
		}
		
	},

	showLastYearWishes : function(){
		url = "/oxfam-wishes/api/mainpagedata/getLastYearUserMessages"
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
		var self = this;
		rows = [];
		this.state.data.forEach(function(eachMessageDetail){
			rows.push(<MessageBox messageDetails={eachMessageDetail}/>);
		})

		var allListItems = this.state.listItems;
		var listItemsHtml = allListItems.map(function(currItem){
			var finalClass = currItem.selected ?  "col-sm-1 active" : "col-sm-1";
			if( currItem.code == "write"){
				return <li role="presentation" className={ finalClass } data-toggle="modal" data-target="#messageModal"><a className="text-success">{ currItem.name }</a></li>;
			}else{
				return <li role="presentation" className={ finalClass } onClick={ self.listItemClicked(currItem.code) } ><a className="text-success">{ currItem.name }</a></li>
			}
		});

		return(
			<div >
				<div className="navbar" style={{"margin-bottom":"0px"}}>
					<ul className="nav nav-pills nav-justified bg-info">
						<li role="presentation" className="col-sm-1" ><a className="text-success" href="#wishes">Wishes</a></li>
						<li role="presentation" className="col-sm-1" ><a className="text-success" href="#teamStatus">Team Status</a></li>
						<li role="presentation" className="col-sm-1" ><a className="text-success" href="#writeWishes">Write your wishes</a></li>
						<li role="presentation" className="col-sm-1" ><a className="text-success" href="#lastyearwishes">Last year wishes</a></li>
					</ul>
				</div>

				<div className="navbar navbar-fixed-top">
					<ul className="nav nav-pills nav-justified bg-info">
						{ listItemsHtml }	
					</ul>
				</div>

				<div className="well" >
					<b>
						<p>Three of our teams, <a className="text-info" href="https://trailwalker.oxfamindia.org/TEAM3164">What Were We Thinking (GS) </a>
						( Paroksh, Apoorv, Ayush, Pratik ), <a className="text-info" href="https://trailwalker.oxfamindia.org/TEAM3159">Cakewalk (GS) </a> 
						( Jainam, Sai Natraj, Vivin, Pratul ) and <a className="text-info" href="https://trailwalker.oxfamindia.org/TEAM3162">Misfits (GS) </a>
						( Utkarsh, Shashank, Sudarshini, Sameer )  are participating in Oxfam'18, 2nd Feb. Wish them luck!</p>
						<p>You can also browse through some of our last year's video/content : <a className="text-info" href="https://www.youtube.com/watch?v=IQh9vdL_tDo&t=28s">Preparation Video </a>, 
						<a className="text-info" href="https://medium.com/@parokshsaxena/the-reason-behind-our-mission-100-km-oxfam-walk-26d3df622969#.nf9d7794o">Our motivation </a>,
						<a className="text-info" href="https://www.facebook.com/paroksh.saxena/media_set?set=a.10211683889000819.1073741850.1475123275&type=3">Oxfam 2017 </a>		
						</p>
					</b>
				</div>

				<div style={{"padding-left":"40px","padding-right":"40px"}}>
					<div>
						{rows}
					</div>

					<div id="messageModal" className="modal fade" role="dialog">
					 <CaptureMessageBox />
					</div>	
				</div>
			</div>

		)
	}
})


React.render(<Page /> , document.getElementById('page'));