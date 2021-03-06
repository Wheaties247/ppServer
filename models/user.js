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
        res.locals.userCreds = "Email already in use"
        next();
        }else{
          userModelObject
    .findByUserName(username)
    .then(resp=>{
      if(resp){
        res.locals.userCreds = "Username already in use"
        next();
      }else{
        const passwordDigest = bcrypt.hashSync(password);
          console.log("passwordDigest", passwordDigest)
          db.oneOrNone(
              'INSERT INTO users (user_name, email, password_digest, tokens, payment_info, confirmed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;', [username, email, passwordDigest, 0, "", false ])
          .then(resp=>{
                console.log("After Insert", resp)
                const respObj= 
                {
                 id: resp.user_id,
                 user_name:resp.user_name,
                 email:resp.email, 
                 tokens: resp.tokens, 
                 paypal: resp.payment_info,
                 confirmed: resp.confirmed
               }
                console.log("respObj", respObj)

                 res.locals.userCreds = respObj
        next();
          })           
          .catch(err => {
              console.log('Create ERROR:', err)
             next(err);

          });
        }
    })
    .catch(err => {
              console.log('Create ERROR:', err)
             next(err);
           })
    }
  })
    .catch(err => {
              console.log('Create ERROR:', err)
             next(err);
           })
 };

userModelObject.findByEmail = email => {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1;', [email]);
};
userModelObject.findByUserName = username => {
    return db.oneOrNone('SELECT * FROM users WHERE user_name = $1;', [username]);
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
            console.log('Login ERROR:', err)
           next(err);

        });
       
};
userModelObject.edit = (req, res, next) =>{
  console.log("Within edit", req.body)
  const {id, ...keys} = req.body 
  const properties = Object.keys(keys)[0]
  console.log("properties", properties)
  console.log("test edit", req.body[properties],
        req.body.id)
  db
    .one(
      `UPDATE USERS SET ${properties}= $1 WHERE user_id = $2 RETURNING *;`,
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
userModelObject.getUserInfo = (req, res, next)=>{
  console.log("Within getUserInfo", req.body)
  db
    .oneOrNone(
      `SELECT * from USERS WHERE user_id = $1;`,
      [
        req.body.id
      ]
    )
    .then(resp=>{
      console.log("successful get User Info", resp)
      res.locals.userInfo = resp
      console.log("res.locals", res.locals)
      next();

    })
    .catch(err=>{
      console.log("there was an error in getUserInfo", err)
      next(err);
    })
}
module.exports = userModelObject;
