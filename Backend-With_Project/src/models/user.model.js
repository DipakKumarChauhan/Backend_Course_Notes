import mongoose, {Schema} from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // I have installed Bcryptjs instead of bcrypt so this import statement is changed


// Model Schema

const userSchema = new Schema({ 
username: {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim: true,
    index: true
},

email: {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim: true,
},

fullName: {
    type : String,
    required : true,
    trim: true,
},

avatar: {
    type : String, // Cloudniary URL
    required : true,
},

coverImage : {

    type :String,

},

watchHistory: [
    {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
], // watch History is an array of objects of type Video

password: {
    type: String,
    required: [true, "Password is required"],// We can give custom msg with true field 
    
},

refreshToken :
{
    type : String,
    
}




}, {timestamps: true});



// Password hashing

// this is middle-ware thats why we are using function keyword and it has next too so that we can process next req

userSchema.pre("save" ,async function (next) {

    if(!this.isModified("password")){
        return next();
    }
    // If statement is used to check if password is modified or not coz agar lagaya tho har baar user kuch bhi modify karega password hash hojayega
   // So if if statement helps us to avoid this

    this.password = await bcrypt.hashSync(this.password , 10)
    next()

} )



// Method to compare password using custom Methods
// Checking If password is correct using custom methods

userSchema.methods.isPasswordCorrect = async function (password) {

   return await bcrypt.compare(password, this.password) // this returns true or false

}

userSchema.methods.generateAccessToken = function () {
return jwt.sign(
{
    // we can get id email and all coz they are already stored in database and we can use this keyword
     
    _id: this._id , 
    email: this.email,
    username: this.username,
    fullName: this.fullname
},
process.env.ACCESS_TOKEN_SCERET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY

}
)
};

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            // we can get id email and all coz they are already stored in database and we can use this keyword
             
            _id: this._id , 
            email: this.email,
            username: this.username,
            fullName: this.fullname
        },
        process.env.REFRESH_TOKEN_SCERET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        
        }
        )
}


export const User = mongoose.model("User",userSchema)










// We can also use below code to create a model in mongoose  

// import mongoose from 'mongoose';

// const userSchema =  new mongoose.Schema({


// },{timestamps: true})

// export const UserModel = mongoose.model("User",userSchema)