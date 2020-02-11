const bcrypt = require('bcryptjs');
const axios = require('axios');
const cloudinary = require("cloudinary").v2;
const db = require('../db/index.js');

const girlModelObject = {};
    
    girlModelObject.create = (req, res, next) =>{ 
        console.log("Girl  Model create", req.body)
        const {username, email, password, paypal} = req.body;
    girlModelObject
        .findByEmail(email)
        .then(resp=>{
            console.log("After Find by email",resp)
            if(resp){
            res.locals.modelCreds = "Email already in use"
            }else{
            girlModelObject
            .findByUserName(username)
            .then(resp=>{
              if(resp){
                res.locals.modelCreds = "Username already in use"
                next();
              }else{
                const passwordDigest = bcrypt.hashSync(password);
            console.log("passwordDigest", passwordDigest)
            db.oneOrNone(
                'INSERT INTO models (model_name, email, password_digest, online, payment_info, picture_url, tokens, astro_sign, confirmed) VALUES ($1, $2, $3 , $4, $5, $6, $7, $8, $9) RETURNING *;', [username, email, passwordDigest, false, paypal, "modelStockImg.png", 0, null, false])
            .then(resp=>{
                  console.log("After Insert", resp)
                  const respObj= {
                      id: resp.model_id,
                      user_name:resp.model_name,
                      email:resp.email, 
                      paypal:resp.payment_info, 
                      tokens: resp.tokens,
                      astro_sign: resp.astro_sign,
                      picture_url: resp.picture_url,
                      confirmed: resp.confirmed
                  }
                  console.log("respObj", respObj)

                   res.locals.modelCreds = respObj
                next();   
              })
            .catch(err =>{
              console.log("there was an error creating a new user", err)
            })
              }
            })
            .catch(err =>{
              console.log("there was an error finding the record by user", err)
            })
            }
            
        })
        .catch(err=>{
          console.log("there was an error finding the record by email", err)
        })
        
     };

    girlModelObject.findByEmail = email => {
        return db.oneOrNone('SELECT * FROM models WHERE email = $1;', [email]);
    };

    girlModelObject.findByName = username => {
        return db.oneOrNone('SELECT * FROM models WHERE model_name = $1 OR email = $2;', [username, username]);
    };
    girlModelObject.findByUserName = username => {
    return db.oneOrNone('SELECT * FROM users WHERE user_name = $1;', [username]);
    };

    girlModelObject.login = (req, res, next) => {
        console.log('in login', req.body);
        const {user_name:id, password} = req.body;

        girlModelObject
            .findByName(id) // here we're using the nonmiddleware version above, getting back a promise
            .then((userData) => {
                console.log("After FindByName", userData)
                if(userData){
                console.log("User Found")

                    const isAuthed = bcrypt.compareSync(password, userInfo.password_digest);
                            console.log('isAuthed:', isAuthed)
                     if(isAuthed){
                        res.locals.modelCreds = userData; 
                    }else{
                        res.locals.modelCreds = "Password Incorrect"
                    }
                }else{
                console.log("User Not Found")

                  res.locals.modelCreds = "User not Found"; 
                  
                }
               next();
            }).catch(err => {
                console.log('ERROR:', err)
               next(err);

            });
           
    };
    girlModelObject.edit = (req, res, next) =>{
  console.log("Within edit", req.body)
  const {id, ...keys} = req.body 
  const properties = Object.keys(keys)[0]
  console.log("properties", properties)
  console.log("test edit", req.body[properties],
        req.body.id)
  db
    .one(
      `UPDATE MODELS SET ${properties}= $1 WHERE model_id = $2 RETURNING *;`,
      [
        req.body[properties],
        req.body.id
      ]
    )
    .then(resp=>{
        console.log("Ater Edit", resp)
        res.locals.editResp = resp
        next();
    })
    .catch(err => {
            console.log('Edit ERROR:', err)
           next(err);

        });
          

}
girlModelObject.getAll = (req, res, next)=>{
  console.log("Inside getAll")
  db
  .manyOrNone("SELECT * FROM models;")
  .then(resp=>{
    console.log("SELECT ALL FROM MODEL RESPONCE", resp)
    res.locals.models = resp
      next()
  })
  .catch(err=>{
    console.log("there was an error in get all models", err)
    next(err);
  })

}

girlModelObject.uploadImage =(req, res, next)=>{
    cloudinary.config({
      cloud_name: process.env.CLOUDNAME,
      api_key: process.env.APIKEY,
      api_secret:process.env.APISECRET
    })
    const url = "https://api.cloudinary.com/v1_1/thepinkimageserver"
    // const upload_preset = "tkl7opjd"
    console.log("within uploadImage model", req.file)
    next();
    // axios({
    //   method:"POST",
    //   url: url, 
    //   headers:{
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   data: req.body.file
    // })
    // .then(resp=>{
    //   console.log("success image upload", resp)
    //   res.locals.img = resp
    //    next();
    // })
    // .catch(err=>{
    //   console.log("there was an error", err)
    //   next(err)
    // })
    // const cl = new cloudinary.Cloudinary({
    //     cloud_name: "thepinkimageserver",
    //      secure: true});
    // console.log("cl", cl)
    // cl.v2.uploader.upload("/home/my_image.jpg", 
    // function(error, result) {
    //     console.log(result, error)
    // });
   
}
module.exports = girlModelObject;