/**
 * 本逻辑采用 pending 轮询的方式
 * 同时为了保证可用性，也会在前端的 localstorage
 * 中放置 一个key
 */
import React, {useEffect, useState} from 'react'
import {getASRStatus} from "../../api/asr.api";
import {Button, Spin} from "antd";

const TransformStatusStep = (inProps:any)=>{

    const [isLoading,setLoading] = useState(true)
    const [isFetch,setFetch] = useState(true)


    console.log('组件蛤？ ',isLoading,isFetch)


    // if(isLoading){
    //     // statusCheck().then()
    // }


    useEffect(()=>{
        console.log('use Effect active')

        const statusCheck = async ()=>{
            const {data:{Data:data}} = await getASRStatus(inProps.taskId);
            const {StatusStr} = data
            console.log('来了吗？ StatusStr',isFetch, isLoading && isFetch)
            if(StatusStr === 'doing'||StatusStr === 'waiting'){
                setLoading(true)
                console.log( '---->',!isFetch)
                setFetch(!isFetch)
            }
            if(StatusStr ==='success'){
                setLoading(false)
                setFetch(false)
            }
            if(StatusStr ==='failed'){
                setLoading(false)
            }
        }

        if(isLoading){
            setTimeout(()=>{
                statusCheck().then()
            },3000)
        }

        return ()=>{
            // 修整 fetch 值
            console.log('修整 fetch 值')
            // setFetch(true)
            }


    },[isLoading,isFetch])

    const generateAsrFile = ()=>{
        console.log('会在这里创建文件')
    }

    return (
        <div>

             <h2> 翻译文件生成状态 </h2>
            <Spin spinning={isLoading} style={{margin:"40px"}}>
            </Spin>
            {
                !isLoading && <div>
                    <Button style={{width:"130px"}} onClick={generateAsrFile}>下载文件</Button>
                </div>
            }
        </div>
    )
}

export default TransformStatusStep

