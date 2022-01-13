/**
 * TODO： 可以在这里显示更多的 file 的信息
 */
import React, {useState} from 'react'
import {Button, Descriptions, Statistic} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {createASRTask} from "../../api/asr.api";
import {AsrTransformProps} from "../../pages/asr";

const getfilesize = (size:number)=> {//把字节转换成正常文件大小
        if (!size)  return "";
        var num = 1024.00; //byte
        if (size < num)
            return size + " B";
        if (size < Math.pow(num, 2))
            return (size / num).toFixed(2) + " KB"; //kb
        if (size < Math.pow(num, 3))
            return (size / Math.pow(num, 2)).toFixed(2) + " MB"; //M
        if (size < Math.pow(num, 4))
            return (size / Math.pow(num, 3)).toFixed(2) + " G"; //G
        return (size / Math.pow(num, 4)).toFixed(2) + " T"; //T
    }

const TransfromAsr = (inPros:AsrTransformProps)=>{

    console.log(inPros.url)

    const [display,setDisplay] = useState(false)

    const transformAsr = async ()=>{
        const {data:{Data:data}} = await createASRTask(inPros.url.path)
        console.log(data.TaskId,inPros) //TaskId
        inPros.setTaskId(data.TaskId)
        setDisplay(true)
    }

    return (
        <div style={{minHeight:'300px',display:"flex",alignContent:"center",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
            {!display&&<h3>开启云端翻译</h3>}
            {!display &&
                <Descriptions
                    style={{border:'1px solid lightgrey',marginBottom:'10px',marginTop:'10px'}}
                    bordered   column={{ xxl: 2, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="文件名:">{inPros.url.fileDetail.name}</Descriptions.Item>
                    <Descriptions.Item label="文件类型">{inPros.url.fileDetail.type}</Descriptions.Item>
                    <Descriptions.Item span={2} label="大小">{getfilesize(inPros.url.fileDetail.size)}</Descriptions.Item>
                    <Descriptions.Item label="位置">
                        {inPros.url.path}
                    </Descriptions.Item>
                </Descriptions>
            }
            {display&&<h3>提交成功</h3>}
            {!display && <Button style={{width:"130px"}} disabled={display} onClick={transformAsr}>确认</Button>}
        </div>
    )
}

export default TransfromAsr
