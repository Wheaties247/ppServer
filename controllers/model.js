const router = require("express").Router();
const girl = require("../models/girl.js");

router.post("/login", girl.login, (req, res)=>{
	// console.log("user login", req)

	res.json({modelCreds:res.locals.modelCreds})
})
router.post("/register", girl.create, (req, res)=>{

	const respdata = res.locals.modelCreds
	console.log("MODEL register", respdata)
	
	res.json({modelCreds: respdata})
})
router.put("/edit", (req, res)=>{
	console.log("Put Request", req.body)
})
module.exports = router;
