import React, {useEffect, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {Upload, message, Input, Button, Progress, Steps, Divider, UploadProps} from 'antd';
import {retrieveNewToken} from "../../api/authentication.api";

import './upload.scss'
import {File} from "./file.dto";
import {AsrUploadProps} from "../../pages/asr";
import {useAsrDispatch, useAsrState} from "../../context/context";
import {completeFileUpload, getSignature} from "../../context/action";

const {Dragger} = Upload;


/**
 * 使用 dispatch
 * @param inProps
 * @constructor
 */
const AsrUpload = () => {

    const globalStore = useAsrState()
    const dispatch = useAsrDispatch()   // 返回 asr 使用的 dispatch 在 async 中进行dispatch 操作

    const [fileName, setFileName] = useState('')

    // TODO : 这里要考虑获取 signature 失败的情况
    const preUpload = async (file: any, dispatch: any) =>{
        console.log(file)
        setFileName(file.name)
        await getSignature(dispatch)
    }

    const props = {
        name: 'file',
        multiple: false,
        action: globalStore.bucket.endpoint,
        disabled: false,
        accept: 'audio/*',
        maxCount: 1,
        data: {
            key: fileName,
            // globalStore.bucket.key,
            'x-obs-acl': 'public-read',
            'content-type': 'audio/mpeg',
            policy: globalStore.bucket.Policy,
            AccessKeyId: 'IMRYXZQOICTZIAAXM3EI',  // TODO: 动态载入这个地方， 要从配置文件去拿取
            signature: globalStore.bucket.Signature
        },
        beforeUpload: async (file: any) => {
            await preUpload(file, dispatch)
        },
        onChange: async (info: any) => {
            const {status} = info.file;

            if (status !== 'uploading') {

            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                // 上传成功就要dispath 上传成功的 action 这个地方要确定一下上传的url
                await completeFileUpload(
                    {
                        filePath: `${globalStore.bucket.endpoint}/${info.file.name}`,
                        fileInfo: info.file
                    }, dispatch)

            } else if (status === 'error') {
                //TODO: 针对上传失败的 dispatch
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: any) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    };


    return (<>


        <Divider><h3>上传语音文件</h3></Divider>

        <Dragger {...props} style={{
            minHeight: '300px',
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column"
        }}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或者拖拽来上传文件</p>
            <div className="ant-upload-text upload-format-small">
                <p className="upload-format-small ">
                    (只能选择单个文件)
                </p>
            </div>
            <p className="ant-upload-hint">
            </p>
        </Dragger>
    </>)
}

export default AsrUpload;
