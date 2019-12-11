// const db = require('../db/index.js');
// const nodemailer = require('nodemailer');  
const nodemailer = require("nodemailer");


 
const mailerObject = {};
mailerObject.confimation = (req, res, next)=>{
	console.log("within Mailer", req.body)
	const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Timothylowe247", // generated ethereal user
      pass: process.env.PASS // generated ethereal password
    }
  	});
  	const mailOptions = {
  		from:"Timothylowe247@gmail.com",
  		to:"Timothylowe247@gmail.com",
  		subject:"Test",
  		text:"IT WORKED"
  	}
  	transporter.sendMail(mailOptions, (error, info)=>{
  		if(error){
  			console.log(error);
  		}else{
  			console.log("email sent:", info.response)
  		}
  	})
	next();
} 
module.exports = mailerObject;

// mailerObject.confimation = (req, res, next)=>{
// 	console.log("within Mailer")

// 	let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: , // generated ethereal user
//       pass: testAccount.pass // generated ethereal password
//     }
//   });

//   // send mail with defined transport object
//   transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
//   })
//   .then(resp=>{
//   	console.log("Mailer reponce", resp)
//   })
//   .catch(err=>{
//   	console.log("Mailer Error", err)
//   })

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...