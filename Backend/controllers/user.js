const user=require("../models/user");
function getSignin(req,res){
    return res.json({singin:"please sign in"});
}
async function createUser(req, res) {
    const {name, UserName, email, password} = req.body;
    
    if(!name || !UserName || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    
    try {
        await user.create({
            name,
            UserName,
            email,
            password
        });
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("User creation error:", error);
        if (error.code === 11000) {  // Duplicate key error
            return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Server error" });
    }
}

async function AuthenticateUser(req,res){
    const {email,password}=req.body;
    if(!email||!password)
    return res.status(400).json({error:"All fields are required"});
    try{
        const User=await user.matchPassword(email,password);
        console.log("Authenticated user:",User);
        return res.status(200).end("User Logged In Succesfully");
    }catch(error){
        console.error("Error during login:", error.message);
        return res.status(401).json({ error: "Invalid email or password!" });
    }
}
module.exports={
    getSignin,
    createUser,
    AuthenticateUser
}