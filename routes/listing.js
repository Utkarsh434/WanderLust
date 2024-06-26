const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema , reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const listingController = require("../controllers/listings");
const {isLoggedIn ,isOwner,validateListing} = require("../middleware");
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({storage});


router.route("/")
    .get(wrapAsync(listingController.index)) //index
    .post(                                   //create rout 
        isLoggedIn,
        upload.single("listing[image]"),       //here multer will process our file 
        validateListing,
        wrapAsync(listingController.createListing
    ));
//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
        .get(wrapAsync(listingController.showListing))//show route  
        .put(
            isLoggedIn,
            isOwner,
            upload.single("listing[image]"),            //here multer will process our file
            validateListing,
            wrapAsync(listingController.updateListing))//update rout 
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));// delete listing





//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports =  router; 