import {v2 as cloudinary}   from "cloudinary";

import fs from "fs"; // using this to get file path


cloudinary.config({
    cloud_name: process.env.CLOUDINRY_CLOUD_NAME,
    secure: true,
    api_key:process.env.CLOUDINRY_API_KEY ,
    api_secret: process.env.CLOUDINRY_API_SECRET
    
})

const uploadONCloudinary = async (localFilePath) => {

   try {
    if(!localFilePath) return null;

    // upload file to cloudinary
   const response =  await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
    })

    // if file has beem uploaded successfully we do
    
    console.log("File uploaded successfully on cloudinary: ", response.url)
    return response;


   }catch (error){
    fs.unlinkSync(localFilePath); // It will remove the locally saved temporary file as the upload operation got failed
    return null;

   }


}


export  {uploadONCloudinary} ;

