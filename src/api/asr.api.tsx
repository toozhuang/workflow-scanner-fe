import axios from './axios/api'


export const createASRTask = (fileUrl: string) => {
    return axios.postReq(`/asr-service-api/upload`,
        {url:fileUrl},
        {withCredentials: true,}
    )
}
