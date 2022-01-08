import React, {useEffect, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
import {Upload, message, Input, Button, Progress, Steps} from 'antd';
import {retrieveNewToken} from "../../api/authentication.api";

const {Dragger} = Upload;




const AsrUpload = (inProps: any) => {
    console.log(inProps)
    const [details, setDetails] = useState({
        actionEndPoint:'http://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com',
        key:'',
        OriginPolicy:'',
        Policy:'',
        Signature:'',
    })

    const preUpload = async (file:any) => {
        // 这里可以对比一下 detail 中的时间戳和当前的时间戳
        // 来决定要不要在这里上传
        console.log(file)
        const name = file.name;
        const {data: detail} = await retrieveNewToken();
        setDetails({
            actionEndPoint:'http://fengshows-openapi-upload.obs.cn-east-2.myhuaweicloud.com',
            key:name,...detail})
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

        return ()=>{
            console.log('这个是 return了')
            // getDetail()
        }
    }, [setDetails])
// TODO: 这里要设置文件的类型； 类型限制
    const props = {
        name: 'file',
        multiple: true,
        action: details.actionEndPoint,
        data: {
            key: details.key,
            'x-obs-acl': 'public-read',
            'content-type': 'audio/mpeg',
            policy: details.Policy,
            AccessKeyId: 'IMRYXZQOICTZIAAXM3EI',
            signature: details.Signature
        },
        beforeUpload: async (file:any) => {
            console.log('我是大帅比')
            await preUpload(file)
        },
        onChange(info: any) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList,info);
                inProps.upload(`${details.actionEndPoint}/${details.key}`)
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
        <p></p><p></p><p></p>
        <h3>上传语音文件</h3>
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
