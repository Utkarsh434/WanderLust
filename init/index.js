const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to mongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});//to clean the previously existing data
    initData.data = initData.data.map((obj)=>({...obj,owner:"6675d5e944d90f3b8a464925"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();