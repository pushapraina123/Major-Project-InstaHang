const user=require("../models/user");
function getSignin(req,res){
    return res.json({singin:"please sign in"});
}
async function createUser(req,res){
    const {name,age,email,password}=req.body;
    if(!name||!age||!email||!password)
    return res.json({ error: "All fields are required!" });
    await user.create({
        name,
        age,
        email,
        password
    });
    return res.end("User created Succefully");
} 

async function AuthenticateUser(req,res){
    const {email,password}=req.body;
    if(!email||!password)
    return res.json({error:"All fields are required"});
    try{
        const User=await user.matchPassword(email,password);
        console.log("Authenticated user:",User);
        return res.end("User Logged In Succesfully");
    }catch(error){
        console.error("Error during login:", error.message);
        return res.json({ error: "Invalid username or password!" });
    }
}
module.exports={
    getSignin,
    createUser,
    AuthenticateUser
}