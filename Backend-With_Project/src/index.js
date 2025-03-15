 // require('dotenv').config({path: '.env'}) // we are not using this tough it will work coz in our code we are using es6 import syntax.

import dotenv from "dotenv"; // note sirf itne se nahi chalega dotenv ko config bhi karna hoga

// import mongoose from "mongoose";
//  import {DB_NAME} from "./constants.js";
 // Note above code is commented coz we are not using it in this project. isko use hum tabkarenge jab neeche wala express wala approach use karenge.


 import connectDB from "./db/index.js";
    connectDB() // Note connectDB uses async await and this returns promises on which we can apply .then() , .catch()
    .then(()=>{
        // By this part of code server will start and listen to the port.
        app.listen(process.env.PORT || 8000, ()=> {
            console.log(`App is listinging on port ${process.env.PORT}`);
        })

        app.on("error", (error) => {
            console.log("Error connecting to database");
            throw error
        })
    })
    .catch((error) => {
        console.error("MONGO DB connection error failed !!!", error);
        process.exit(1);
    });

dotenv.config({path: ".env"}); // to use this method we have added script in package.json 





















/* Below code is one approach using express to connect db but we dont use it in this project.


import express from "express";
const app = express();
// In the below line we are using iffy function which executes as aoon as they are called and we are using async function to connect to the database

;(async ()=> {
try {
    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
    // In below line we are checking if express is able to contact to db we are listining to db using app.on() and if error comes it returns error

    app.on("error", (error) => {
        console.log("Error connecting to database");
        throw error
    })

    // In below line we are listining to db through PORT given in env

    app.listen(process.env.PORT, ()=> {
        console.log(`App is listinging on port ${process.env.PORT}`);
    })
}catch(error)
{
    console.error("Error connecting to database", error)
}
})()

*/