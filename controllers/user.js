const router = require("express").Router();
const user = require("../models/user.js");

router.post("/login", user.login, (req, res)=>{
	// console.log("user login", req)

	res.json({userCreds:res.locals.userCreds})
})
router.post("/register", user.create, (req, res)=>{

	const respdata = res.locals.userCreds
	console.log("user register", respdata)
	
	res.json({userCreds: respdata})
})
module.exports = router;
