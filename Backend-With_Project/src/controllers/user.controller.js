import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadONCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) =>{
    try
    {
        const user = await User.findById(userId);

        console.log("Fetched user:", user); // Debugging log

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        console.log("Generating tokens...");
        const accessToken  = user.generateAccessToken() //thse are just methodsso we need ()

        const refreshToken =  user.generateRefreshToken()

            // In above code w have just generated the Tokens into the method abhi vo bahar nahi gaya hai
                
            // addding the refresh token to the database

                    user.refreshToken = refreshToken;
                    await user.save({validateBeforeSave: false}); // we are not validating the data before saving it to the database

                    return {accessToken, refreshToken};  
    }
    catch (error) {
        console.error("Error generating tokens:", error); 
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}




const registerUser = asyncHandler(async (req, res) => {
   // Get user details from front-End

   const{fullName , email, username, password} =req.body; //  here we request from body for data
    console.log("email", email);    

   // validation - not empty

        //    if(fullName === "")
        //    {
        //     throw new ApiError(400, "Full Name cannot be empty");

        //    }

        //     We can use this method to check if the user is empty or not but bahut sare if conditions likhne honge 
    
        // better approach
    if([fullName, email, username, password].some((field)=> {field?.trim ===""})) 
    {
        throw new ApiError(400, "All fields are required");
    }


   //check if user already exists

                // User comes from user.model.js and is directly connected to DB and can call DB when it wants to.
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser){
            throw new ApiError(409, "User with email or username already exists");
        }


   // check for imaages , check for avatar
   console.log("req.files:", req.files);
   console.log("req.files?.avatar:", req.files?.avatar);
   
        const avatarLocalPath =  req.files?.avatar[0]?.path || null; // this is how we get the path of the image
        //const coverImageLocalPath = req.files?.coverImage[0]?.path || null;
        let coverImageLocalPath ;

        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
        {
            coverImageLocalPath = req.files.coverImage[0].path;
        }
        
        if(!avatarLocalPath)
        {
            throw new ApiError(400, "Avatar is required");
        }


   // upload them to cloudinary, avatar

    const avatar =  await uploadONCloudinary(avatarLocalPath);
    const coverImage =  await uploadONCloudinary(coverImageLocalPath);

    if(!avatar) 
    {
        throw new ApiError(400, "Failed to upload avatar");
    }

    
   
   // create user object - create entry in db 

   const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

    
   // remove password and refresh token field from response

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken")

    


   //check for user creation
   if(!createdUser)
    {
        throw new ApiError(500, "something went wrong while registering user");
    }

   // return response.
   
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )



});

const loginUser = asyncHandler(async (req, res) => {
// get data from req body
    const {email , username, password} =req.body;
    if(!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

// usernam or email data input lo

    const user =  await User.findOne( // findOne is a mongoose method used to find data in DB
        {
        $or: [{username}, {email}] // by this line we can search for either one of them in DB we dont need to write two cases
        })  
//find the user
    if(!user)
        {
            throw new ApiError(404, "User does not exist");
        }
//check if password is correct

        // Note we can not use User in place of user coz User is a mongoose model and user is a data from DB User will give functionsof mongoose not what we nee 
       
        const mactchPass =  await user.isPasswordCorrect(password);

        if(!mactchPass)
        {
            throw new ApiError(401, "Invalid user credentials");
        }


//access and refresh token

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);;

//send cookies
        // WE DO BELOW STEP coz humne user._id liya hai {accessToken, refreshToken} isme but abhi bhi user object khali hai tho usko bharna hoga
        // Here we are again calling DB but if you think its expensive we can simply update is.

        const logggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
        // By default cookies ko koi bhi modify kar sakta hai on frontend se But BY enabling Options true only server can modify cookies
        const options = {
            httpOnly: true, 
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user: logggedInUser,accessToken,refreshToken
                },
                "User Logged In successfuly"
            )
        )

});

const logoutUser = asyncHandler(async(req,res) => {

   const updatedRefreshToken= await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken",options)
    .json (
        new ApiResponse(200 ,  {} , "User Logged out")
    )
});

const refreshAccessToken = asyncHandler(async(req,res) => {

    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken // we do req.body if somone is using mobile and sending info to body

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,  "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user =  User.findById(decodedTokem?._id); // we can do this coz when we made refresh Token we we gave it the access to id
    
        if(!user)
            {
                throw new ApiError(401,  "Invalid RefreshToken")
            }
    
        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError(401 , "Refresh token is expired or used")
        }
    
        const options ={
            httpOnly : true,
            secure: true
        }
    
       const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res.
        status(200)
        .cookie("accessToken", accessToken , options)
        .cookie("refreshToken",newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshtoken: newrefreshToken},
                "access token refreshed"
    
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Tokens")
    }    



});
 
export {registerUser, loginUser , logoutUser,refreshAccessToken};