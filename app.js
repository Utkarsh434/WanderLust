if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const path = require("path");
const  methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");
const session = require("express-session");
const flash = require("connect-flash");
const passport  = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require("connect-mongo")


const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/reviews");
const userRouter  = require("./routes/user");

const port = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/pubic")))


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true, 
    }
}

// app.get("/",(req,res)=>{
//     res.send("HEMOOOO");
// })




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})





main().then(()=>{
    console.log("Connected to mongoDB");
}).catch((err)=>{
    console.log(err);
})



//Listings
app.use("/listings",listingsRouter);
//Reviews
app.use("/listings/:id/reviews",reviewsRouter);
//user
app.use("/",userRouter);

async function main(){
    await mongoose.connect(dbUrl);
}




// app.get("/testlisting",async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         discription: "By The beach",
//         price:1200,
//         location:"Goa", 
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// })


app.use((err,req,res,next)=>{
    let {statusCode=500 ,message="Something went wrong"} = err;
    res.render("error.ejs" ,{err});
    console.log(err);
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.listen(port , ()=>{
    console.log(`listning to port: ${port}`);
})
