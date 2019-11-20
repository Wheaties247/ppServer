const bcrypt = require('bcryptjs');

const db = require('../db/index.js');

const userModelObject = {};

userModelObject.create = (req, res, next) =>{ 
	console.log("user Model create", req.body)
    const {username, email, password} = req.body;
userModelObject
    .findByEmail(email)
    .then(resp=>{
        console.log("After Find by email",resp)
        if(resp){
        res.locals.userCreds = "User already created"
        }else{
        const passwordDigest = bcrypt.hashSync(password);
        console.log("passwordDigest", passwordDigest)
        db.oneOrNone(
            'INSERT INTO users (user_name, email, password_digest, tokens, payment_info) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [username, email, passwordDigest, 0, ""])
        .then(resp=>{
              console.log("After Insert", resp)
              const respObj= {user_name:resp.user_name , email:resp.email, tokens: resp.tokens, paypal: resp.payment_info}
              console.log("respObj", respObj)

               res.locals.userCreds = respObj
        next();
               
          })
        }

    })

 };

userModelObject.findByEmail = email => {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1;', [email]);
};

userModelObject.findByName = username => {
    return db.oneOrNone('SELECT * FROM users WHERE user_name = $1 OR email = $2;', [username, username]);
};

userModelObject.login = (req, res, next) => {
    console.log('IN LOGIN', req.body);
    const {username:id, password} = req.body;
    console.log(
      `ID param: ${id}
      PASSWORD param: ${password}`);

    userModelObject
        .findByName(id) // here we're using the nonmiddleware version above, getting back a promise
        .then((userData) => {
            console.log("After FindByName", userData)
            if(userData){
                const isAuthed = bcrypt.compareSync(password, userData.password_digest);
                        console.log('isAuthed:', isAuthed)
                 if(isAuthed){
                    res.locals.userCreds = userData; 
                }else{
                    res.locals.userCreds = "Password Incorrect"
                }  
            }else{
                 res.locals.userCreds = "User not Found"; 
            }
           next();
        }).catch(err => {
            console.log('ERROR:', err)
           next(err);

        });
       
};
module.exports = userModelObject;
