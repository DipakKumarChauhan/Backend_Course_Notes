import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Nte We use app.use jab hame koi middle ware use karna hon  
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    cfedentials:true,
}));

app.use(express.json({limit : "16kb"})); // This is used to parse the incoming request with JSON payloads and has a limit of 16kb

app.use(express.urlencoded({extended:true ,  limit: "16kb"})); // This is used to parse the incoming request with urlencoded payloads (matlab agar url aa rha hai tho usko receive karega) and has a limit of 16kb aur bina kuch dale bhi chaljata bus better practice ke liye dala hai.

// extended: true means hum nested objects use kar sakte hain

app.use(express.static("public")); // This is used to serve static files that we reieve from front end to backend tho unko public directory me rakhne ke kaam ata hai

app.use(cookieParser()); // This is used to parse the incoming request with cookies and we can use the cookies in our application

// note cookie ko browser me store karte hain aur jab bhi hum koi request bhejte hain tho usme cookies bhi bhejte hain aur jab server ko request milti hai tho usme cookies bhi aati hain aur server ko pata chal jata hai ki ye user kaun hai aur uska data kya hai. and server hi cookies padh sakte hain


//#######################################################################################################################################################################################


// Routes

// Routes import
import userRouter from "./routes/user.routes.js";

// Routes declaration

// Note Coz we are writing routes and controllers in different files so we have to import the routes and controllers in the app.js file and then we to use the routes in the app.js file we have to use middleware
// so instead of app.get or app.post we use app.use and then we have to specify the path of the route and then we have to specify the route file

app.use("/api/v1/users", userRouter); // by this code when someone types /users we pass controll to userRouter and wahan vo bolega karna kya hai



export{app};