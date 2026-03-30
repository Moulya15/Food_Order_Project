//connect Node.js woth cloudinary
//cloudinary is a cloud based image and videomamanegemnt service
//that provides an easy-to-use API for uploading, storing, managing, and delivering media content.
//It allows developers to integrate media management capabilities into their applications without having to worry about the underlying infrastructure.


const cloudinary=require("cloudinary").v2;

cloudinary.config({
    cloud_name:process.env.COUDINARY_CLOUD_NAME,
    api_key:process.env.COUDINARY_API_KEY,
    api_secret:process.env.COUDINARY_API_SECRET,
})
module.exports=cloudinary;