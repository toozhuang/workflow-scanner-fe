import Axios from './axios';

import axios from 'axios';

export const createASRTask = (fileUrl: string) => {
  return Axios.postReq(
    `/asr-service-api/upload`,
    { url: fileUrl },
    { withCredentials: true },
  );
};

export const getASRStatus = (taskId: string) => {
  return Axios.getReq(`/asr-service-api/upload/status/${taskId}`, {
    withCredentials: true,
  });
};

// TODO: 这里要替换一下
export const fileDownload = (taskId: string, downloadFileName: string) => {
  return axios(
    `http://172.19.223.200:3230/asr-service-api/upload/generate/${taskId}`,
    {
      method: 'GET',
      withCredentials: true,
      headers: {
        'content-type': 'application/text',
        responseType: 'blob',
      },
    },
  ).then(res => {
    // application/octet-stream
    const type = 'application/octet-stream';
    // let type = result.type
    // const buf = Buffer.from(result, 'binary')
    console.log('res:::', res);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const blob = new Blob([res.data], { type });
    const fileName = `${downloadFileName}.srt`;
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      console.log('URL.createObjectURL(blob);L:', URL.createObjectURL(blob));
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    } else {
      // navigator.msSaveBlob(blob, fileName);
    }

    //
    // let blob = new Blob([res], {type: type})
    // let fileName = res.headers.filename || '未知文件.srt'
    // let URL = window.URL || window.webkitURL
    // let objectUrl = URL.createObjectURL(blob)
    // console.log(objectUrl)
    // if (fileName) {
    //     var a = document.createElement('a')
    //     // safari doesn't support this yet
    //     if (typeof a.download === 'undefined') {
    //         // @ts-ignore
    //         window.location = objectUrl
    //     } else {
    //         a.href = objectUrl
    //         a.download = fileName
    //         document.body.appendChild(a)
    //         a.click()
    //         a.remove();
    //         message.success(`${fileName} 已下载`);
    //     }
    // }
  });

  // return res.blob().then(blob =>
  //     Promise.resolve({
  //         blob,
  //         res,
  //     }),
  // );
  // });
};
