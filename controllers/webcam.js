const router = require("express").Router();

const webcam = require("../models/webcam.js");

router.get("/:modelId", (req, res)=>{
	console.log("Webcam Route")
	res.json({msg: "connected"})
})

module.exports = router;
