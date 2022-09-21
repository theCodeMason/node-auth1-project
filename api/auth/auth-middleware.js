// const db = require('../../data/db-config');
const User = require('../users/users-model');
/*
  If the user does not have a session saved in the server
  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) { 
  if(!req.session.user){
    next({message: "You shall not pass!", status: 401})
  } else {
    next();
  }
}

/*
  If the username in req.body already exists in the database
  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const user = await User.findBy({username: req.body.username});
    if(!user.length) {
      next()
    }
    else {
      next({message: "Username taken", status: 422})
    }
  } catch(err){
    next(err)
  }
  
  // const { username } = req.body;

  // const taken = await User.findBy(username)
  // if(taken != null) {
  //   res.status(422).json({message: "Username taken"});
  // } else {
  //   next();
  //   return;
  // }
}

/*
  If the username in req.body does NOT exist in the database
  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const user = await User.findBy({username: req.body.username});
    if(user.length) {
      req.user = user[0]
      next()
    }
    else {
      next({message: "Invalid credentials", status: 401})
    }
  } catch(err) {
    next(err)
  }
  // const { username } = req.body;

  // const exists = User.findBy(username);
  // if(exists == null){
  //   next()
  // }
  // next()
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if(!req.body.password || req.body.password <= 3){
    next({message: " Password must be longer than 3 chars", status: 422})
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,

}
