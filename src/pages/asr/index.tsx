import React, {useState} from "react";

import './asr.scss'

import {Upload, message, Input, Button, Progress, Steps} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import AsrUpload from "../../components/asr/upload";
import TransfromAsr from "../../components/asr/transform";

const { Dragger } = Upload;

const { Step } = Steps;

const DEMOURL = 'https://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com/audios'

/**
 * 字幕服务的主入口
 * 通过drag 文件的方式上传文件
 * 得到链接地址，调用腾讯的的方法
 * 获取到json
 * 一连串的服务
 * 当前还是先做轮训操作
 */

const AsrPage = ()=>{


    const [inputValue,setValue] = useState('https://fengshows-transcodedone.obs.cn-east-2.myhuaweicloud.com/transcodedone/feng-online-sound.mp3')
    const props = {
        name: 'file',
        multiple: true,
        action: 'http://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com',
        data:{
            key:'dashuaibi',
            'x-obs-acl':'public-read',
            'content-type':'text/plain',
            policy:'eyJleHBpcmF0aW9uIjoiMjAyMi0wMS0wN1QwNjo1NzowOVoiLCAiY29uZGl0aW9ucyI6W3sieC1vYnMtYWNsIjoicHVibGljLXJlYWQifSx7ImNvbnRlbnQtdHlwZSI6InRleHQvcGxhaW4ifSxbInN0YXJ0cy13aXRoIiwgIiRidWNrZXQiLCAiIl0sWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIiJdLF19',
            AccessKeyId:'IMRYXZQOICTZIAAXM3EI',
            signature:'Lqlg7zRvnIl/z9OwY0CdcoCU1XM='
        },
        onChange(info:any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e:any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [current, setCurrent] = React.useState(0);
    const [fileUrls, setFileUrls] = useState([])

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: '第一步',
            content:  <div>
                <AsrUpload urls={fileUrls} upload={setFileUrls}></AsrUpload>
            </div>
            ,
        },
        {
            title: 'Second',
            content: <div>
                <TransfromAsr url={DEMOURL}>

                </TransfromAsr>
            </div>,
        },
        {
            title: 'Last',
            content: <div>
                x
            </div>,
        },
    ];



    return (
        <div>
            <h2> 语音转字幕服务 </h2>
            <div className="asr-container">
                {/*current={current}*/}
                <Steps >
                    {steps.map(item => (
                        <Step key={item.title} status="wait" title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                </div>
            </div>





























            {/*<h4>1. 上传语音文件</h4>*/}
            <p></p>
            {/*<Dragger {...props}>*/}
            {/*    <p className="ant-upload-drag-icon">*/}
            {/*        <InboxOutlined />*/}
            {/*    </p>*/}
            {/*    <p className="ant-upload-text">点击或者拖拽来上传文件</p>*/}
            {/*    <p className="ant-upload-hint">*/}
            {/*    </p>*/}
            {/*</Dragger>*/}



            {/*<form action="http://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com" method="post"*/}
            {/*      encType="multipart/form-data">*/}

            {/*    Object key*/}
            {/*    <input type="text" name="key" value="objectkey"/>*/}
            {/*    <p></p>*/}
            {/*        ACL*/}
            {/*        <input type="text" name="x-obs-acl" value="public-read"/>*/}
            {/*    <p></p>*/}
            {/*            Content-Type*/}

            {/*            <input type="text" name="content-type" value="text/plain"/>*/}
            {/*    <p></p>*/}

            {/*                <input type="hidden" name="policy"*/}
            {/*                       value="eyJleHBpcmF0aW9uIjoiMjAyMi0wMS0wNlQxNjo0MjowOVoiLCAiY29uZGl0aW9ucyI6W3sieC1vYnMtYWNsIjoicHVibGljLXJlYWQifSx7ImNvbnRlbnQtdHlwZSI6InRleHQvcGxhaW4ifSxbInN0YXJ0cy13aXRoIiwgIiRidWNrZXQiLCAiIl0sWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIiJdLF19"/>*/}

            {/*                <input type="hidden" name="AccessKeyId" value="IMRYXZQOICTZIAAXM3EI"/>*/}

            {/*                <input type="hidden" name="signature" value="v8pXt69NGOpQCvPpcZ1lWHN+0fM="/>*/}


            {/*                <input name="file" type="file"/>*/}
            {/*                <input name="submit" value="Upload" type="submit"/>*/}
            {/*</form>*/}
        </div>
    )
}

export default AsrPage
