/**
 * 本逻辑采用 pending 轮询的方式
 * 同时为了保证可用性，也会在前端的 localstorage
 * 中放置 一个key
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { fileDownload, getASRStatus } from '../../api/asr.api';
import { Button, Spin } from 'antd';
import { useAsrState } from '../../context/context';

const TransformStatusStep = (inPros: any, ref: any) => {
  const { setDownloadAble } = inPros;
  const [isLoading, setLoading] = useState(true);
  const [isFetch, setFetch] = useState(true);
  const globalState = useAsrState();
  const taskID = globalState.taskId;

  useImperativeHandle(ref, () => ({
    fileDownload: generateAsrFile,
    isLoading: isLoading,
  }));

  useEffect(() => {
    const statusCheck = async () => {
      const {
        data: { Data: data },
      } = await getASRStatus(taskID);
      const { StatusStr } = data;

      if (StatusStr === 'doing' || StatusStr === 'waiting') {
        setLoading(true);
        setFetch(!isFetch);
      }
      if (StatusStr === 'success') {
        setLoading(false);
        setFetch(false);
        setDownloadAble(true);
      }
      if (StatusStr === 'failed') {
        setLoading(false);
      }
    };

    if (isLoading) {
      setTimeout(() => {
        statusCheck().then();
      }, 3000);
    }

    return () => {
      // 修整 fetch 值
      // setFetch(true)
    };
  }, [isLoading, isFetch, taskID]);

  const generateAsrFile = () => {
    fileDownload(taskID, globalState.file.fileInfo.name).then();
  };

  return (
    <div>
      <h2> 翻译文件生成状态 </h2>
      <Spin spinning={isLoading} style={{ margin: '40px' }}></Spin>
      {/*{*/}
      {/*    !isLoading && <div>*/}
      {/*        <Button style={{width:"130px"}} onClick={generateAsrFile}>下载文件</Button>*/}
      {/*    </div>*/}
      {/*}*/}
    </div>
  );
};

export default React.forwardRef(TransformStatusStep);
