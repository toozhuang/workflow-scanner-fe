import axios from 'axios';

export const getTransferList = () => {
    return axios.get('http://localhost:3000/transfer-service/result?status=dealing', {
        withCredentials: true,
        headers: {
             // 前端并没有直接在 post/get 交互中修改 cookie 的权利
            // Cookie: 'ticket=7f8ecbc31a3453ed7c54da389834126417c5bc2d0cdd7ec167204620bb17f3d316f331d804305f5806235f41d2d5b93f937a0dc7557ef92246566858ad1b84be; webos-ticket=ea4762798e4a2196467a6a6b2d438df7cd537a153ebf475173683e2c421444dc4c92432ad6b1c4b7b1d44c184d7aa27f08d786b60139905a3badb38ad5863451fd6fdaa651ad9344d1d8bf1e92b04eaa',
        }
    })
}

export const updateTransfer = (transferId: string,status:string='complete') => {
    return axios.post(`http://localhost:3000/transfer-service/${transferId}`,{status})
}
