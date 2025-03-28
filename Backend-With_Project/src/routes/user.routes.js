import {Router} from 'express';
import { registerUser, loginUser, logoutUser,refreshAccessToken } from '../controllers/user.controller.js';
import{upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
   // by using middleware we can upload images and files now
    // fields accepts an array of objects, each object has a name and maxCount property
    upload.fields([
        {name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), // this upload comes from multer.middleware.js
    registerUser
)

router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJWT , logoutUser)

runtimeScriptErrors.route("refresh-token").post(refreshAccessToken)

export default router;