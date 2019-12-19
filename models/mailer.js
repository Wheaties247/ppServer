const db = require('../db/index.js');
// const nodemailer = require('nodemailer');  
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');


 
const mailerObject = {};
	mailerObject.registrationEmail = (req, res, next)=>{
		if(res.locals.userCreds!=="User already created"){
			const token = jwt.sign(req.body.username, process.env.SECRET_TOKEN)
			console.log("within Mailer", req)
			const transporter = nodemailer.createTransport({
		    service: "gmail",
		    auth: {
		      user: process.env.EMAIL, // generated ethereal user
		      pass: process.env.PASS // generated ethereal password
		    }
		  	});

		  	const url = `http://localhost:7770/users/confirmAccount/${token}`
		  	const mailOptions = {
		  		from:process.env.EMAIL,
		  		// req.body.email
		  		to:"timothylowe247@gmail.com",
		  		subject:"Welcome to the Playhouse",
		  		text:`
		  		Welcome ${req.body.username} to The Pink Playhouse 

		  		In order to activate your account please click this link ${url}
		  		`
		  	}
		  	transporter.sendMail(mailOptions, (error, info)=>{
		  		if(error){
		  			console.log(error);
		  		}else{
		  			console.log("email sent:", info.response)
		  		}
		  	})
		}
		
		next();
	} 
	mailerObject.confirmAccount =(req, res, next)=>{
		console.log("in Verify", req.params)
		jwt.verify(req.params.jwt, process.env.SECRET_TOKEN, (err, user)=>{
			console.log("in verify", user)
			if(err){
				res.sendStatus(403)
				next()

			}else{
				db
				.one('UPDATE USERS SET confirmed= true WHERE user_name = $1 RETURNING *;',[
						user
					])
				.then(resp=>{
					console.log("confirm account responce",resp)
				next()

				})
				.catch(err=>{
					console.log("there was an error in confirm Account ", err)
				})
			}
		})
	}
	mailerObject.editVerification =(req, res, next)=>{
		console.log("edit Verify", req)

		const { 
			user_id,
   			user_name,
		    email,
		    tokens,
		    payment_info,
		    password_digest,
		    confirmed
 				} = res.locals.editResp
		const transporter = nodemailer.createTransport({
		    service: "gmail",
		    auth: {
		      user: process.env.EMAIL, // generated ethereal user
		      pass: process.env.PASS // generated ethereal password
		    	}
		  	});
		const msg = `
		  		There has been a recent change to your account information, here are your new account details:
		  		User Name : ${user_name}
		  		Email Address : ${email} 
		  		Current tokens : ${tokens}
		  		Payment Info : ${payment_info}

		  		
		  		`
		const mailOptions = {
		  		from:process.env.EMAIL,
		  		// req.body.email
		  		to:"timothylowe247@gmail.com",
		  		subject:"The Pink Playhouse - Account Changes",
		  		text: msg
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
