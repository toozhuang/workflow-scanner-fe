/**
 * 纯展示组件， 上传的动作在外面
 * 或者可以试试在这个里面写上传的动作
 * 但是通过 ref 拿到上传的这个方法在外面使用
 * TODO: 但是还没考虑 提交失败的情况
 */
import React, { useImperativeHandle, useState } from 'react';
import { Descriptions } from 'antd';
import { AsrTransformProps } from '../../pages/asr';
import { useAsrDispatch } from '../../context/context';
import { createAsrTask } from '../../context/action';
import { getFilesize } from '../../common/util';
import { useAppDispatch } from '../../redux/store';

const TransformAsr = (inPros: AsrTransformProps, ref: any) => {
  const [display, setDisplay] = useState(false);

  const dispatch = useAsrDispatch();
  const appDispatch = useAppDispatch();

  // 选择要暴露的方法给外界
  useImperativeHandle(ref, () => ({
    transformAsr: transformAsr,
  }));

  // TODO: 失败的情况如何处理
  const transformAsr = async () => {
    try {
      await createAsrTask(inPros.file, dispatch, appDispatch);
    } catch (e) {
      console.log('error: ', e);
    }
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
          <Descriptions.Item label="大小">
            {getFilesize(inPros.file.fileInfo.size)}
          </Descriptions.Item>
          <Descriptions.Item label="位置">
            {inPros.file.filePath}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

export default React.forwardRef(TransformAsr);
