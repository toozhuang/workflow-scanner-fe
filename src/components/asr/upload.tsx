import React, {useEffect, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {Upload, message, Input, Button, Progress, Steps, Divider, UploadProps} from 'antd';
import {retrieveNewToken} from "../../api/authentication.api";

import './upload.scss'
import {File} from "./file.dto";
import {AsrUploadProps} from "../../pages/asr";

const {Dragger} = Upload;


/**
 * 使用 dispatch
 * @param inProps
 * @constructor
 */
const AsrUpload = (inProps:AsrUploadProps ) => {
    console.log(inProps)
    const [uploaded, setUploaded] = useState(false)
    const [details, setDetails] = useState({
        actionEndPoint: '',
        key: '',
        OriginPolicy: '',
        Policy: '',
        Signature: '',
    })

    const preUpload = async (file: any) => {
        // 这里可以对比一下 detail 中的时间戳和当前的时间戳
        // 来决定要不要在这里上传
        console.log(file)
        const name = file.name;
        const {data: detail} = await retrieveNewToken();
        setDetails({
            actionEndPoint: detail.endpoint,
            key: name, ...detail
        })
    }

    useEffect(() => {

        const getDetail = async () => {
            try {
                const {data} = await retrieveNewToken()
                setDetails(data)
            } catch (error) {
                // TODO: error hook here
            }

        }

        getDetail().then()

        return () => {

        }
    }, [setDetails])
// TODO: 这里要设置文件的类型； 类型限制
    const props = {
        name: 'file',
        multiple: false,
        action: details.actionEndPoint,
        disabled: uploaded,
        accept:'audio/*',
        maxCount: 1,
        data: {
            key: details.key,
            'x-obs-acl': 'public-read',
            'content-type': 'audio/mpeg',
            policy: details.Policy,
            AccessKeyId: 'IMRYXZQOICTZIAAXM3EI',
            signature: details.Signature
        },
        beforeUpload: async (file: any) => {
            console.log('我是大帅比')
            await preUpload(file)
        },
        onChange(info: any) {
            const {status} = info.file;
            console.log(info)
            if (status !== 'uploading') {
                console.log(status, info.file, info.fileList, info);
                inProps.upload({
                    path: `${details.actionEndPoint}/${details.key}`,
                    fileDetail: info.file
                })

            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                //    这个地方要确定一下上传的url

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
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
