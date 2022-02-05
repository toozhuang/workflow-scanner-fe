/**
 * 本逻辑采用 pending 轮询的方式
 * 同时为了保证可用性，也会在前端的 localstorage
 * 中放置 一个key
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { fileDownload, getASRStatus } from '../../api/asr.api';
import { Button, Spin } from 'antd';
import { useAsrState } from '../../context/context';
import { useLocation } from 'react-router';
import DB from '../../common/indexed-db';

const TransformStatusStep = (inPros: any, ref: any) => {
  const { setDownloadAble } = inPros;
  const [isLoading, setLoading] = useState(true);
  const [isFetch, setFetch] = useState(true);
  const [errorMessage, setMsg] = useState('');
  const [downloadAble, setAble] = useState(false);
  const globalState = useAsrState();
  const taskID = globalState.taskId;
  const { pathname } = useLocation();

  useImperativeHandle(ref, () => ({
    fileDownload: generateAsrFile,
    isLoading: isLoading,
  }));

  useEffect(() => {
    const statusCheck = async () => {
      let tid = taskID;
      if (!taskID) {
        tid = pathname.split('/')[2];
      }
      try {
        const {
          data: { Data: data },
        } = await getASRStatus(tid);
        const { StatusStr } = data;

        if (StatusStr === 'doing' || StatusStr === 'waiting') {
          setLoading(true);
          setFetch(!isFetch);
        }
        if (StatusStr === 'success') {
          setLoading(false);
          setFetch(false);
          if (setDownloadAble) setDownloadAble(true);
          setAble(true);
        }
        if (StatusStr === 'failed') {
          setLoading(false);
        }
      } catch (e: any) {
        console.log('错误吗： ', e);
        setMsg(e.data.error);
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

  const generateAsrFile = async () => {
    let tid = taskID;
    if (!taskID) {
      tid = pathname.split('/')[2];
    }
    let name = '';
    if (!globalState.file.fileInfo) {
      const db = await DB.openDB('asrIDB', 1);
      // 判断是否存在 对应的 list ， 如果不存在就创建一个 TODO:
      // asrListKey
      const menuStore = await DB.transaction(
        db, // transaction on our DB
        ['asrList'], // object stores we want to transact on
        'readwrite', // transaction mode
      ).getStore('asrList'); // retrieve the store we want

      const res: any = await DB.getObjectData(menuStore, Number.parseInt(tid));
      console.log(res);
      name = res.fileName;
    } else {
      name = globalState.file.fileInfo.name;
    }
    fileDownload(tid, name).then();
  };

  return (
    <div>
      <h2> 翻译文件生成状态 </h2>
      {downloadAble && <h3>完成转换</h3>}
      {isLoading && <h3>转换中</h3>}
      <Spin spinning={isLoading} style={{ margin: '40px' }} />

      {errorMessage && <div>{errorMessage}</div>}
      {!setDownloadAble && downloadAble && (
        <Button onClick={generateAsrFile}>下载</Button>
      )}
    </div>
  );
};

export default React.forwardRef(TransformStatusStep);
