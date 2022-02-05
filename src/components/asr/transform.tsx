/**
 * 纯展示组件， 上传的动作在外面
 * 或者可以试试在这个里面写上传的动作
 * 但是通过 ref 拿到上传的这个方法在外面使用
 * TODO: 但是还没考虑 提交失败的情况
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Button, Descriptions } from 'antd';
import { createASRTask } from '../../api/asr.api';
import { AsrTransformProps } from '../../pages/asr';
import { log } from 'util';
import { useAsrDispatch } from '../../context/context';
import { createAsrTask } from '../../context/action';
import { getFilesize } from '../../common/util';

const TransformAsr = (inPros: AsrTransformProps, ref: any) => {
  const [display, setDisplay] = useState(false);

  const dispatch = useAsrDispatch();

  // 选择要暴露的方法给外界
  useImperativeHandle(ref, () => ({
    transformAsr: transformAsr,
  }));

  // TODO: 失败的情况如何处理
  const transformAsr = async () => {
    await createAsrTask(inPros.file, dispatch);
  };

  return (
    <div
      style={{
        minHeight: '300px',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {!display && <h3>开启云端翻译</h3>}
      {!display && (
        <Descriptions
          style={{
            border: '1px solid lightgrey',
            marginBottom: '10px',
            marginTop: '10px',
          }}
          bordered
          column={{ xxl: 2, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="文件名:">
            {inPros.file.fileInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="文件类型">
            {inPros.file.fileInfo.type}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="大小">
            {getFilesize(inPros.file.fileInfo.size)}
          </Descriptions.Item>
          <Descriptions.Item label="位置">
            {inPros.file.filePath}
          </Descriptions.Item>
        </Descriptions>
      )}
      {/*{display && <h3>提交成功</h3>}*/}
      {/*{!display && <Button style={{width: "130px"}}*/}
      {/*                     disabled={display}*/}
      {/*                     onClick={transformAsr}>确认</Button>}*/}
    </div>
  );
};

export default React.forwardRef(TransformAsr);
