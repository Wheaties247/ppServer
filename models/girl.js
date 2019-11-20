const bcrypt = require('bcryptjs');

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
            res.locals.modelCreds = "User already created"
            }else{
            const passwordDigest = bcrypt.hashSync(password);
            console.log("passwordDigest", passwordDigest)
            db.oneOrNone(
                'INSERT INTO models (model_name, email, password_digest, online, payment_info, picture_url, tokens, astro_sign) VALUES ($1, $2, $3 , $4, $5, $6, $7, $8) RETURNING *;', [username, email, passwordDigest, false, paypal, "modelStockImg.png", 0, null])
            .then(resp=>{
                  console.log("After Insert", resp)
                  const respObj= {
                      user_name:resp.model_name,
                      email:resp.email, 
                      paypal:resp.payment_info, 
                      tokens: resp.tokens,
                      astro_sign: resp.astro_sign,
                      picture_url: resp.picture_url
                  }
                  console.log("respObj", respObj)

                   res.locals.modelCreds = respObj
                next();   
              })
            }
            
        })
        
     };

    girlModelObject.findByEmail = email => {
        return db.oneOrNone('SELECT * FROM models WHERE email = $1;', [email]);
    };

    girlModelObject.findByName = username => {
        return db.oneOrNone('SELECT * FROM models WHERE model_name = $1 OR email = $2;', [username, username]);
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

module.exports = girlModelObject;