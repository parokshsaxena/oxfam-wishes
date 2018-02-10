# oxfam-wishes
This project aims at creating a web interface where people can wish our team who is participating in oxfam 100km walk event and also track how our team in doing on the race day.

Before you run this project in your local, you will have to set following environment variables (in ~/.bash_profile )
export adminPassword=<ThisPasswordWillGiveYouAdminAccess>
export REDISCLOUD_URL='redis://localhost:6379'

//For connecting to rethinkDatabase. This is specific to rethinkdb hosted on compose.io
//Read tunnel.py file to understand value for each of these below
#export SSH_TUNNEL_TARGET=
#export SSH_TUNNEL_FORWARDS=
#export SSH_TUNNEL_KEY=

#MY Keys ( put in config variables in heroku )
SSH_TUNNEL_FORWARDS=localhost:28015:10.0.8.4:28015
SSH_TUNNEL_KEY= RSA:<ThisisDummyKey>=

SSH_TUNNEL_TARGET = compose@<someIp>:<port>

REDISCLOUD_URL = redis://rediscloud:<redisDetails>:<port>

For deployment, uses
python tunnel.py && npm start

How to Start ( 1st install all dependencies and then start )
> npm install
> npm start


