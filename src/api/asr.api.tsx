import axios from './axios/api'


export const createASRTask = (fileUrl: string) => {
    return axios.postReq(`/asr-service-api/upload`,
        {url:fileUrl},
        {withCredentials: true,}
    )
}

export const getASRStatus = (taskId:string)=>{
    console.log(`upload/status/${taskId}`)
    return axios.getReq(`/asr-service-api/upload/status/${taskId}`,{withCredentials: true,})
}
