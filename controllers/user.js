const router = require("express").Router();
const user = require("../models/user.js");
const mailer = require("../models/mailer.js")
router.post("/login", user.login, (req, res)=>{
	// console.log("user login", req)

	res.json({userCreds:res.locals.userCreds})
})
router.post("/register",
	user.create, 
	mailer.registrationEmail,
	 (req, res)=>{

	const respdata = res.locals.userCreds
	console.log("user register", respdata)
	
	res.json({userCreds: respdata})
})
router.get("/confirmAccount/:jwt",
	mailer.confirmAccount,
	(req, res)=>{
		res.redirect("http://localhost:8000/UserLoginRegister")
})
router.put("/edit", 
	user.edit, 
	mailer.editVerification,
	(req, res)=>{
	console.log("Put Request user", req.body)
	res.json({resp: res.locals.editResp})
})
module.exports = router;
