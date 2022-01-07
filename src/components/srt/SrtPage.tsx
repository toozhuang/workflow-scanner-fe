import React, {useState} from 'react'

import {Upload, message, Input, Button} from 'antd';
import { InboxOutlined } from '@ant-design/icons';



const { Dragger } = Upload;

const ref:any = React.createRef<any>();

function SrtPage() {

    const [inputValue,setValue] = useState('https://fengshows-transcodedone.obs.cn-east-2.myhuaweicloud.com/transcodedone/feng-online-sound.mp3')
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
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

    const submit = ()=>{
        const value = ref;
        console.log(value)
        console.log(value.current.state.value)
    }

    return (
        <div>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>
            <div>
                <Input ref={ref}  value={inputValue} onChange={(e)=>setValue(e.target.value)} placeholder="请输入文件的url信息"/> <Button type="primary" onClick={submit}>转换</Button>
            </div>

        </div>
    )
}

export default SrtPage;
