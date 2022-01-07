import React from 'react'
import {Button} from "antd";
import {createASRTask} from "../../api/asr.api";

const TransfromAsr = (inPros:any)=>{

    const diao = async ()=>{
        const result = await createASRTask(inPros.url)
        console.log(result)
    }

    return (
        <>
            <p></p><p></p><p></p>
            <h3>开始运翻译</h3>
            <Button onClick={diao}>我是个按钮</Button>
        </>
    )
}

export default TransfromAsr
