const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.route("/signup")
    .get(userController.renderSignupForm)  //render signupForm
    .post(wrapAsync(userController.signup));//signup action

router.route("/login")
    .get(userController.renderLoginForm)  //render loginForm   
    .post(saveRedirectUrl,passport.authenticate('local',//login action using passport
            {failureRedirect:"/login" ,
            failureFlash:true
        }),userController.login);


router.get("/logout",userController.logout);


//passport login karwa raha hai humne jo login likha 
//userControlles me woto login k baad kya karna hai wo hai  

 


module.exports = router;