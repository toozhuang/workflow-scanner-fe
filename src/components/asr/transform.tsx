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
        我是大帅比
            <Button onClick={diao}>我是个按钮</Button>
        </>
    )
}

export default TransfromAsr
