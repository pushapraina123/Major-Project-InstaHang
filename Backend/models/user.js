const mongoose=require("mongoose");
const {createHmac,randomBytes}=require("crypto")
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    UserName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        default:"./images/profileImage.jpg",
    }

},{timestamps:true})
userSchema.pre("save",function(next){
    const user=this;
    const secret=randomBytes(16).toString();
    const hashedPassword=createHmac("sha256",secret)
    .update(user.password)
    .digest("hex");

    this.salt=secret
    this.password=hashedPassword
    next();
})
userSchema.static("matchPassword",async function(email,password){
    try{
        const user=await this.findOne({email});
        if(!user)
        throw new Error("Invalid email pleasr enter correct email");
        const secret=user.salt;
        const checkPassword=createHmac("sha256",secret)
        .update(password)
        .digest("hex");

        if(checkPassword===user.password)
        return {...user,password:undefined,salt:undefined};
        else
        throw new Error("Wrong Password");
    }catch(error){
        throw error;
    }
})
const user=mongoose.model("user",userSchema);

module.exports=user;