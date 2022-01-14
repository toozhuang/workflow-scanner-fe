import React, {useState} from "react";

import './asr.scss'

import {Upload, message, Input, Button, Progress, Steps, Spin} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import AsrUpload from "../../components/asr/upload";
import TransfromAsr from "../../components/asr/transform";
import TransformStatusStep from "../../components/asr/status";
import {File} from "../../components/asr/file.dto";
import {useAsrState} from "../../context/context";

const {Dragger} = Upload;

const {Step} = Steps;


export type AsrUploadProps = {
    uploadFile: uploadFile,
    upload: Function
}


export type AsrTransformProps = {
    url: uploadFile,
    setTaskId: Function,
}

export type uploadFile = {
    path: string,
    fileDetail: File
}


/**
 * 字幕服务的主入口
 * 通过drag 文件的方式上传文件
 * 得到链接地址，调用腾讯的的方法
 * 获取到json
 * 一连串的服务
 * 当前还是先做轮训操作
 */

const AsrPage = () => {

    const asrState = useAsrState()
    const [current, setCurrent] = React.useState(0);
    const [buttonClickable, setButtonClickable] = useState(true) // 默认关闭下一步
    const [fileUrl, setFileUrl] = useState({
        path: '',
        fileDetail: {
            uid: '',
            lastModified: 0,
            lastModifiedDate: '',
            name: '',
            size: 0,
            type: '',
            percent: 0,
            originFileObj: {
                uid: ''
            },
            status: '',
            response: '',
        }
    })
    const [taskId, setTaskId] = useState('')

    const next = ({action:string}={action:'NONE'}) => {
        setCurrent(current + 1);
        // setButtonClickable(true)
    };

    const prev = () => {
        setCurrent(current - 1);
        setButtonClickable(true)
    };

    const setUpload = (url: uploadFile) => {
        // 设置 url ok
        setFileUrl(url)
        // 设置 button clickable
        setButtonClickable(false)
    }

    const setTransform = (taskId: string) => {
        setTaskId(taskId)
        setButtonClickable(false)
    }


    const steps = [
        {
            title: '选择录音文件',
            content: <div>
                <AsrUpload uploadFile={fileUrl} upload={setUpload}></AsrUpload>
            </div>
            ,
        },
        {
            title: '提交任务',
            content: <div>
                <TransfromAsr url={fileUrl}
                              setTaskId={setTransform}/>
            </div>,
        },
        {
            title: '查询并下载',
            content:
                <TransformStatusStep
                    taskId={taskId}
                ></TransformStatusStep>,
        },
    ];


    console.log('显示一下 state： ', asrState)

    /**
     * 在 asr page 引入一个局部的 store
     * 专门在这里使用
     */
    return (
        <div>
            <Spin spinning={asrState.loading}  >

            </Spin>
            <h2> 语音转字幕服务 </h2>
            <div className="asr-container">
                {/*current={current}*/}
                <Steps size="small">
                    {steps.map(item => (
                        <Step key={item.title} status="finish" title={item.title}/>
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" disabled={buttonClickable} onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {/* TODO: 完成什么时候 显示*/}
                    {/*{current === steps.length - 1 && (*/}
                    {/*    <Button type="primary" onClick={() => message.success('Processing complete!')}>*/}
                    {/*        Done*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                    {current > 0 && (
                        <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                </div>
            </div>


        </div>
    )
}

export default AsrPage
