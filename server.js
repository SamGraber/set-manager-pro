var express = require('express');
var _ = require('lodash');
var Firebase = require('firebase');

//Lets define a port we want to listen to
//const
var PORT = 8080;

var app = express();

var serverDirectory = __dirname;

console.log(serverDirectory);

app.use('/views', express.static(serverDirectory + '/output/app/debug/views'));
app.use('/js/app', express.static(serverDirectory + '/output/app/debug'));
app.use('/js/login', express.static(serverDirectory + '/output/login/debug'));
app.use('/libraries', express.static(serverDirectory + '/output/app/debug/libraries'));
app.use('/assets', express.static(serverDirectory + '/output/app/debug/assets'));

app.get('/app*', function (request, response) {
	if (Authenticate (request)) {
		response.sendFile(serverDirectory + '/output/app/debug/index.html');	
	} else {
		response.sendFile(serverDirectory + '/output/login/debug/login.html');
	}
});

app.get('/', function(request, response) {
	return response.redirect('/app/');
});

var server = app.listen(PORT, function() {
	console.log('Listening on port ' + PORT + '...');
});

function Authenticate (request) {
	if (!_.isUndefined(request.query.token)) {
		var ref = new Firebase('https://flickering-torch-2606.firebaseio.com');

		try
		{
			ref.authWithCustomToken(request.query.token, function(error, authData) {
				if (error) {
					return false;
				} else {
					return true;
				}
			});
		} catch (err) {
			return false;
		}
	} else {
		return false;
	}
};