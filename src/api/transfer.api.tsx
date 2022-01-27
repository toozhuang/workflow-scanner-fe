import axios from './axios/api';

export const getTransferList = () => {
  return axios.getReq(`/transfer-service/result?status=dealing`, {
    withCredentials: true,
    headers: {},
  });
};

export const updateTransfer = (transferId: string, status = 'complete') => {
  return axios.postReq(
    `/transfer-service/${transferId}`,
    { status },
    { withCredentials: true },
  );
};
