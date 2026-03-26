const express=require("express");
const router=express.Router();
const authController=require("../controllers/authController");


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout",authController.logout);
router.post("/forgetPassword", authController.forgotPassword);
router.patch("/resetPassword/:token",authController.resetPassword);

router.get("/me",authController.protect ,authController.getUserProfile);
router.put("/password/update",
    authController.protect ,
    authController.updatePassword
);

module.exports=router;