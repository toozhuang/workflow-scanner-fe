import React, { useRef, useState, Suspense } from 'react';

import './asr.scss';

import { Button, Steps, Spin, Divider, Row, Col, Card } from 'antd';
import AsrUpload from '../../components/asr/upload';
import TransformAsr from '../../components/asr/transform';
import TransformStatusStep from '../../components/asr/status';
import { File } from '../../components/asr/file.dto';
import { useAsrDispatch, useAsrState } from '../../context/context';
import { cleanUpAsrStore } from '../../context/action';
import AsrHistory from '../../components/asr-history';
import ErrorBoundary from '../../ErrorBoundary';
import AsrHistoryProvider from '../../context/asr-history-context/asr-history-provider';
import DB from '../../common/indexed-db';
import { useNavigate } from 'react-router-dom';

const { Step } = Steps;

export type AsrUploadProps = {
  uploadFile: uploadFile;
  upload: any;
};

export type AsrTransformProps = {
  file: uploadFile;
  setTaskId: any;
};

export type uploadFile = {
  filePath: string;
  fileInfo: File;
};

/**
 * 字幕服务的主入口
 * 通过drag 文件的方式上传文件
 * 得到链接地址，调用腾讯的的方法
 * 获取到json
 * 一连串的服务
 * 当前还是先做轮训操作
 */

const AsrPage = () => {
  const dispatch = useAsrDispatch();
  const [triggerMe, setTrigger] = useState(false);
  const transformRef = useRef<any>();
  const downloadRef = useRef<any>({ isLoading: false });
  const asrState = useAsrState();
  const currentStep = asrState.currentStep;
  const isLoading = asrState.loading;
  const [downloadAble, setDownloadAble] = useState(false);
  const file = asrState.file;
  const [current, setCurrent] = React.useState(0); // 记录当前正确所处在的位置的 step
  const [buttonDisabled, setButtonClickable] = useState(true); // 默认关闭下一步
  const [fileUrl, setFileUrl] = useState({
    filePath: '',
    fileInfo: {
      uid: '',
      lastModified: 0,
      lastModifiedDate: '',
      name: '',
      size: 0,
      type: '',
      percent: 0,
      originFileObj: {
        uid: '',
      },
      status: '',
      response: '',
    },
  });
  const [taskId, setTaskId] = useState('');

  // useEffect(() => {});

  const submitTask = async () => {
    await transformRef.current.transformAsr();

    next();
  };
  const navigate = useNavigate();

  const reStartTask = async () => {
    await cleanUpAsrStore(dispatch);
    setCurrent(0);
    setTrigger(!triggerMe);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
    setButtonClickable(true);
  };

  const setUpload = (url: uploadFile) => {
    // 设置 url ok
    setFileUrl(url);
    // 设置 button clickable
    setButtonClickable(false);
  };

  const setTransform = (taskId: string) => {
    setTaskId(taskId);
    // 在这里写入文件信息

    setButtonClickable(false);
  };

  const steps = [
    {
      title: '选择录音文件',
      content: (
        <div>
          <AsrUpload />
        </div>
      ),
    },
    {
      title: '提交任务',
      content: (
        <div>
          <TransformAsr
            file={file}
            ref={transformRef}
            setTaskId={setTransform}
          />
        </div>
      ),
    },
    {
      title: '查询并下载',
      content: (
        <TransformStatusStep
          setDownloadAble={setDownloadAble}
          ref={downloadRef}
        />
      ),
    },
  ];

  const generateStatus = (index: number) => {
    if (index === current) {
      return 'process';
    } else if (index > current) {
      return 'wait';
    } else if (index < current) {
      return 'finish';
    }
  };

  /**
   * 在 asr page 引入一个局部的 store
   * 专门在这里使用
   */
  return (
    <div>
      <Spin spinning={asrState.loading}></Spin>
      <h2> 语音转字幕服务 </h2>
      <div className="asr-container">
        {/*current={current}*/}
        <Steps size="small">
          {steps.map((item, index) => (
            <Step
              key={item.title}
              status={generateStatus(index)}
              title={item.title}
            />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && current !== 1 && (
            <Button
              type="primary"
              disabled={currentStep === current}
              onClick={() => next()}
            >
              Next
            </Button>
          )}

          {current === 1 && (
            <Button
              type="primary"
              disabled={currentStep !== current}
              onClick={() => submitTask()}
            >
              提交任务
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary"
              disabled={!downloadAble}
              style={{ margin: '0 20px' }}
              onClick={() => downloadRef.current.fileDownload()}
            >
              下载文件
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary"
              style={{ margin: '0 20px' }}
              disabled={isLoading}
              onClick={() => reStartTask()}
            >
              重新开始
            </Button>
          )}
        </div>
      </div>
      {/*<ErrorBoundary>*/}
      {/*<Suspense fallback={<p>loading....</p>}>*/}
      <AsrHistoryProvider>
        <AsrHistory trigger={triggerMe} />
      </AsrHistoryProvider>
      {/*</Suspense>*/}
      {/*</ErrorBoundary>*/}
    </div>
  );
};

export default AsrPage;
