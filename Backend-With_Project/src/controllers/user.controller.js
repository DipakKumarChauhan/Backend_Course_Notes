import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadONCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
        const existedUser = User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser){
            throw new ApiError(409, "User with email or username already exists");
        }


   // check for imaages , check for avatar

        const avatarLocalPath =  req.files?.avatar[0]?.path; // this is how we get the path of the image
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
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

export {registerUser};