import multer from "multer";

// we got this boiler code from multer documentation
// we are using disk storage here
// we are storing files in public folder


const storage = multer.diskStorage({
    destination: function (req, file, cb)  // cb -> callback
    {
      cb(null,"./public/temp"); 
            // here in parameters we can give error , null and destination jahan files store karni hai hamare case me public me karni hai
    
    },
    filename: function (req, file, cb) {

            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // this line simply adds unique file names to uploaded files

      cb(null, file.originalname);  

            // here in parameters we can give error , null and file name jaisa original name hai waisa hi rakhna hai 

            // here in above case we used original name coz hamari file server pe store hogi ar bahut kam time ke liye hogi but its not best Practice to use original name
             // so we can use uniqueSuffix to make it unique
    }
  })
  
  export const upload = multer({ storage, })