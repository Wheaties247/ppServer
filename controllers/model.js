const router = require("express").Router();
const girl = require("../models/girl.js");
const mailer = require("../models/mailer.js")

router.post("/login", girl.login, (req, res)=>{
	console.log("Login MODEL End", req)

	res.json({modelCreds:res.locals.modelCreds})
})
router.post("/register", 
	girl.create, 
	mailer.registrationEmail,
	(req, res)=>{

	const respdata = res.locals.modelCreds
	console.log("Register MODEL End", respdata)
	
	res.json({modelCreds: respdata})
})
router.get("/confirmAccount/:jwt",
	mailer.confirmAccount,
	(req, res)=>{
		res.redirect("http://localhost:8000/DaGirls")
})
router.put("/edit", girl.edit, (req, res)=>{
	console.log("edit Request Model End", req.body)
	res.json({resp: res.locals.editResp})

})
router.get("/all", girl.getAll, (req, res)=>{
	console.log("ALL Models")
	res.json({resp:"ALL MODELS"})
})
router.post("/imgUpload", girl.uploadImage ,(req, res)=>{
	console.log("Upload Model End")
	res.json("{img:res.locals.resp}")
})
module.exports = router;
