import axios from 'axios';

import dev_env from '../config.env'
import prod_env from '../config.prod'


const isDev = process.env.NODE_ENV === 'development';
const URL = isDev ? dev_env.apiService.transferScannerService : prod_env.apiService.transferScannerService


export const getTransferList = () => {
    return axios.get(`${URL}/transfer-service/result?status=dealing`, {
        withCredentials: true,
        headers: {
        }
    })
}

export const updateTransfer = (transferId: string,status:string='complete') => {
    return axios.post(`${URL}/transfer-service/${transferId}`,
        {status},
        {withCredentials: true,}
    )
}
