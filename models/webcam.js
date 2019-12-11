const db = require('../db/index.js');

const webcamModelObject = {};

webcamModelObject.connect = (req, res, next) =>{
	console.log("webcam Connect model");
	next();
}
module.exports = webcamModelObject;
