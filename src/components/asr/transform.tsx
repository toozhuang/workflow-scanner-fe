/**
 * TODO： 可以在这里显示更多的 file 的信息
 */
import React, {useState} from 'react'
import {Button,Statistic} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {createASRTask} from "../../api/asr.api";

const TransfromAsr = (inPros:any)=>{

    const [display,setDisplay] = useState(false)

    const transformAsr = async ()=>{
        const {data:{Data:data}} = await createASRTask(inPros.url)
        console.log(data.TaskId,inPros) //TaskId
        inPros.setTaskId(data.TaskId)
        setDisplay(true)
    }

    return (
        <div style={{minHeight:'300px',display:"flex",alignContent:"center",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
            <p></p><p></p><p></p>
            {!display&&<h3>开启云端翻译</h3>}
            {display&&<h3>提交成功</h3>}
            <p></p><p></p><p></p>
            {!display && <Button style={{width:"130px"}} disabled={display} onClick={transformAsr}>确认</Button>}
        </div>
    )
}

export default TransfromAsr
