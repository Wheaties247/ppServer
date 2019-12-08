const router = require("express").Router();

const webcam = require("../models/webcam.js");

router.get("/:modelId", (req, res)=>{
	console.log("Webcam Route", req.body)

	res.json({msg: "connected"})
})

module.exports = router;
