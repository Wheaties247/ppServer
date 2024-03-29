const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const exphbs = require('express-handlebars');
const fileupload = require('express-fileupload');
  
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 7770;


app.use(morgan("dev"));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json())
app.use(fileupload());

const userControl = require('./controllers/user.js')
const modelControl = require('./controllers/model.js')
const webcamControl = require('./controllers/webcam.js')
app.use('/users', userControl);
app.use('/models', modelControl);
app.use('/webcams', webcamControl);

app.listen(PORT, () => console.log("Server listening on port", PORT));
