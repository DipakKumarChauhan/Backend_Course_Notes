import {v2 as cloudinary}   from "cloudinary";

import fs from "fs"; // using this to get file path

import dotenv from "dotenv";
dotenv.config();

// Used to see errors in the cloudinary
// console.log("🔹 Debugging Cloudinary ENV Variables:");
// console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
// console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    secure: true,
    api_key:process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET
    
})

const uploadONCloudinary = async (localFilePath) => {

   try {
    if(!localFilePath) {
        console.log("Local file path is missing");
        return null; 
    }
    console.log("📂 Uploading file:", localFilePath);
    // check if file exists)

    // upload file to cloudinary
   const response =  await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
    })

    // if file has beem uploaded successfully we do
    
   // console.log("File uploaded successfully on cloudinary: ", response.url)
   fs.unlinkSync(localFilePath); // It will remove the locally saved temporary file as the upload operation got successful
   return response;


   }catch (error){
    console.error("Error uploading file on cloudinary", error);
    fs.unlinkSync(localFilePath); // It will remove the locally saved temporary file as the upload operation got failed
    return null;

   }


}


export  {uploadONCloudinary} ;

