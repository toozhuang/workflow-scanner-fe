import axios from 'axios'

export const login = (userDetail:any)=>{
    return axios.post('http://ump-api.phoenixtv.com/user/login',{"username":`${userDetail.email}`,"password":`${userDetail.password}`,"autoLogin":false,"t":1639318605049})
}
