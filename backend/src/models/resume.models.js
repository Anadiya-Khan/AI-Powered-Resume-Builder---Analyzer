import mongoose from "mongoose";

const resumeSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    fullName : {
        type : String
    },
    role :{
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : String
    },
    address : {
        type : String
    },
    links:[{
       type:String
    }],
    professionalSummary:{
        type:String
    },
    education : [
        {
        degree : String,
        institution : String,
        year : String,
        grade : String
        }
    ],
    skills : [String],
    experience : [
        {
            title : String,
            company : String,
            startDate : String,
            endDate : String,
            description : String
        }
    ],
    projects : [
        {
            name : String,
            description : String,
            link : String
        },
    ],
    aiGeneratedContent : String,
},{
    timestamps : true
})

const Resume = mongoose.model("Resume",resumeSchema)

export default Resume