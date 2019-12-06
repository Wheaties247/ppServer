const router = require("express").Router();
const girl = require("../models/girl.js");

router.post("/login", girl.login, (req, res)=>{
	console.log("Login MODEL End", req)

	res.json({modelCreds:res.locals.modelCreds})
})
router.post("/register", girl.create, (req, res)=>{

	const respdata = res.locals.modelCreds
	console.log("Register MODEL End", respdata)
	
	res.json({modelCreds: respdata})
})
router.put("/edit", girl.edit, (req, res)=>{
	console.log("edit Request Model End", req.body)
	res.json({resp: res.locals.editResp})

})
router.post("/img_upload", girl.uploadImage ,(req, res)=>{
	console.log("Upload Model End")
	res.json("Upload Model Responce")
})
module.exports = router;
