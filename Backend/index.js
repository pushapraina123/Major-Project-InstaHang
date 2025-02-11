const express=require("express");
const app=express();
const route=require("./routes/user")
const mongoose=require("mongoose");
const cors=require("cors");
const port=8000;

mongoose.connect("mongodb://localhost:27017/InstaHang_Users").then(()=>{
    console.log("Database Connected");
});
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use("/user",route);
app.get("/",(req,res)=>{
    return res.end("HOMEPAGE");
})
app.listen(port,()=>{
    console.log(`Server Started at ${port}`);
})

