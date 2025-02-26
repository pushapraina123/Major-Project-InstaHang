const mongoose=require("mongoose");

const userLocationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true
    },
    latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }, { timestamps: true });

const UserLocation=mongoose.model("UserLocation",userLocationSchema);

module.exports=UserLocation;