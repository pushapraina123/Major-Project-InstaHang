const express=require("express");
const route=express.Router();
const {getSignin,createUser,AuthenticateUser}=require("../controllers/user")

route.get("/signup",getSignin);

route.post("/signup",createUser);

route.post("/login",AuthenticateUser);

module.exports=route;