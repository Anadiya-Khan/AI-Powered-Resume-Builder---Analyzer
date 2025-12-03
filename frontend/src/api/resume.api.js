import toast from "react-hot-toast";
import api from "./api";

export const getAllResume = async()=>{
    try {
        const res = await api.get("/resumes/")
        // console.log(res)
        return res
    } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Get All Resume Error")

    }
}

export const createResume = async(resumeData)=>{
    try {
        const res = await api.post("/resumes/create",resumeData)
        return res
    } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Create Resume Error")

    }
}

export const updateResume = async(id,resumeData) =>{
    try{
        const res = await api.put(`/resumes/update/${id}`,resumeData)
        return res
    }catch(error){
        console.log("Error while updating the resume",error)
         toast.error(error.response?.data?.message || "Update Resume Error");
    }
}

export const deleteResume = async(id) =>{
    try {
        const res = await api.delete(`resumes/delete/${id}`)
        return res
    } catch (error) {
         console.log("Error while deleting the resume",error)
         toast.error(error.response?.data?.message || "Delete Resume Error");
    }
}

export const aiGenerateContent = async(data)=>{
    try {
        const res = await api.post("/ai/generate",data)
        console.log(res)
        return res
    } catch (error) {
        console.log(error)
         toast.error(error.response?.data?.message || "Error in ai generated Content");
    }
}

export const exportResumePdf = async(data) => {
    try {
        const res = await api.post('/resumes/pdf', data)
        // make returned url absolute so frontend opens backend-hosted PDF
        if (res?.data?.url && typeof res.data.url === 'string' && res.data.url.startsWith('/')) {
            const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
            res.data.url = base + res.data.url;
        }
        return res
    } catch (error) {
        console.log('PDF export error', error)
        toast.error(error.response?.data?.message || 'Error exporting PDF')
    }
}

export const exportResumePdfStream = async (data) => {
    try {
        const res = await api.post('/resumes/pdf/stream', data, { responseType: 'blob' });
        return res;
    } catch (error) {
        console.log('PDF stream export error', error);
        toast.error(error.response?.data?.message || 'Error exporting PDF');
    }
};
