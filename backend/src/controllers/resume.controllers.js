import Resume from "../models/resume.models.js";

export const createResume = async(req,res)=>{
    try {
        const {fullName , email , phone , address,links,education,skills,experience,projects} = req.body

        const userId = req.user.id;  // will get the user id 

        const resume  = await Resume.create({
            userId,fullName , email , phone , address,links,education,skills,experience,projects
        })
        await resume.save()
        res.status(201).json({
            success : true,
            data : {
                message : "Resume created successfully",
                resume
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message})
    }
}
export const getAllResumes = async(req,res)=>{
    try {
        const userId = req.user.id;
         if(!userId){
            return res.status(401).json({success:false,message : "User not found"})
        }
        const resumes = await Resume.find({userId})
        return res.status(200).json({success:true , resumes})
    } catch (error) {
        console.log("Error in getallResumes",error)
        return res.status(500).json({message : error.message})
    }
}
export const updateResumes = async(req,res)=>{
    try {
        const id = req.params.id; // will take the resume id
        const userId = req.user.id;

        // find the resume and ensure that it belongs to the longin user 
        const resume = await Resume.findOne({_id : id,userId})

        if(!resume) return res.status(404).json({message : "Resume not found"})
        
        Object.assign(resume,req.body); // updates all the fields

        await resume.save()

        res.status(200).json({
        success: true,
        message: "Resume updated successfully",
        resume
    });
    } catch (error) {
        console.log("Error in UpdatesResumes",error)
        return res.status(500).json({message : error.message})
    }
}

export const deleteResume = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const resume = await Resume.findOneAndDelete({ _id: id, userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: error.message });
  }
};
