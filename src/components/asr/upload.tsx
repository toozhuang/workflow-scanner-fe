import React, {useEffect, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {Upload, message, Input, Button, Progress, Steps} from 'antd';
import {retrieveNewToken} from "../../api/authentication.api";

const {Dragger} = Upload;




const AsrUpload = (inProps: any) => {
    console.log(inProps)
    const [details, setDetails] = useState({
        OriginPolicy:'',
        Policy:'',
        Signature:'',
    })

    const preUpload = async () => {
        // 这里可以对比一下 detail 中的时间戳和当前的时间戳
        // 来决定要不要在这里上传
        const {data: detail} = await retrieveNewToken();
        setDetails(detail)
    }

    useEffect(() => {

        const getDetail = async () => {
            try {
                const {data} = await retrieveNewToken()
                console.log('嗷嗷叫的来了', data)
                setDetails(data)
                console.log('看看 detail', details)
            } catch (error) {
                console.log('error 就这里： ', error)
            }

        }

        getDetail()
    }, [setDetails])

    const props = {
        name: 'file',
        multiple: true,
        action: 'http://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com',
        data: {
            key: 'audios',
            'x-obs-acl': 'public-read',
            'content-type': 'audio/mpeg',
            policy: details.Policy,
            AccessKeyId: 'IMRYXZQOICTZIAAXM3EI',
            signature: details.Signature
        },
        beforeUpload: () => {
            console.log('我是大帅比')
            preUpload()
        },
        onChange(info: any) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList,info);
                inProps.upload('https://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com/audios')
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
        <h4>1. 上传语音文件</h4>
        <p></p>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或者拖拽来上传文件</p>
            <p className="ant-upload-hint">
            </p>
        </Dragger>
    </>)
}

export default AsrUpload;
