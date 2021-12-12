import axios from 'axios';

export const getTransferList = ()=>{
    return axios.get('http://localhost:3000/transfer-service/result?status=dealing')
}
