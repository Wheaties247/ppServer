// const db = require('../db/index.js');
// const nodemailer = require('nodemailer');  
	const sgMail = require('@sendgrid/mail');

 
const mailerObject = {};

mailerObject.confimation = (req, res, next)=>{
	console.log("within Mailer")

	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
	  to: 'timothylowe247@gmail.com',
	  from: 'test@example.com',
	  subject: 'Sending with Twilio SendGrid is Fun',
	  text: 'and easy to do anywhere, even with Node.js',
	  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	};
	sgMail.send(msg);
	next();
} 
module.exports = mailerObject;
