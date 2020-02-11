const db = require('../db/index.js');
// const io = module.exports.io = require('socket.io')(app);
// const SocketManager = require('./socketManager.js');

const webcamModelObject = {};

webcamModelObject.connect = (req, res, next) =>{
	console.log("webcam Connect model", req.params);
	// io.on('connect', SocketManager);2

	next();
}
module.exports = webcamModelObject;
