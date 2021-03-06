import { login, retrieveNewToken } from '../api/authentication.api';
import { AUTH_COMMAND } from './reducer';
import { uploadFile } from '../pages/asr';
import { createASRTask } from '../api/asr.api';
import { ASR_COMMAND } from './dto/asr.types';
import DB from '../common/indexed-db';

import dayjs from 'dayjs';
import { addRecords } from '../redux/asrHistory-slice';

/**
 * 定义了一套登录的流程， 以及该登录在整个数据流中和react redux 的互动
 * @param dispatch
 * @param loginPayload
 */
export async function loginUser(dispatch: any, loginPayload: any) {
  dispatch({ type: AUTH_COMMAND.REQUEST_LOGIN });
  try {
    const { data, status, message } = await login(loginPayload);
    if (status) {
      const payload = {
        user: data.userInfo,
        token: data.token,
      };
      dispatch({ type: AUTH_COMMAND.LOGIN_SUCCESS, payload });
      localStorage.setItem('currentUser', JSON.stringify(data));
    } else {
      dispatch({ type: AUTH_COMMAND.LOGIN_ERROR, error: message });
    }

    return data;
  } catch (e: any) {
    const { message } = e;
    dispatch({ type: AUTH_COMMAND.LOGIN_ERROR, error: message });
  }
}

export function loginOut(dispatch: any) {
  try {
    localStorage.removeItem('currentUser');
    dispatch({ type: AUTH_COMMAND.LOGOUT });
  } catch (e) {
    console.log('隐私模式下不存在这种操作');
  }
  return true;
}

/**
 * 获取 翻译的状态
 * @param taskId
 */
export async function getAsrStatus(taskId: string, dispatch: any) {
  // dispatch({type: ASR_COMMAND.})
}

export async function cleanUpAsrStore(dispatch: any) {
  dispatch({
    type: ASR_COMMAND.CLEAN_UP_STATE,
  });
}

/**
 * 文件上传完成 dispatch action
 * @param file
 * @param dispatch
 */
export async function completeFileUpload(file: any, dispatch: any) {
  dispatch({
    type: ASR_COMMAND.UPLOAD_SUCCESS,
    payload: {
      content: {
        filePath: file.filePath,
        fileInfo: file.fileInfo,
      },
      currentStep: 1,
    },
  });
}

/**
 * 获取签名
 * @param dispatch
 */
export async function getSignature(dispatch: any) {
  dispatch({ type: ASR_COMMAND.REQUEST_SIGNATURE });
  try {
    const result = await retrieveNewToken();
    dispatch({
      type: ASR_COMMAND.REQUEST_SIGNATURE_SUCCESS,
      payload: {
        content: result.data,
        step: 1, // TODO:  更新为 currentStep
      },
    });
    return result.data;
  } catch (e) {
    dispatch({ type: ASR_COMMAND.REQUEST_SIGNATURE_ERROR });
  }
}

export async function createAsrTask(
  file: uploadFile,
  dispatch: any,
  appDispatch?: any,
) {
  dispatch({ type: ASR_COMMAND.SUBMIT_TRANSLATE_REQUEST });
  try {
    const result = await createASRTask(file.filePath);
    appDispatch(addRecords({ result: result, file: file }));
    console.log('看看这里有没有： ', result);
    try {
      const db = await DB.openDB('asrIDB', 1);
      const menuStore = await DB.transaction(
        db, // transaction on our DB
        ['asrList'], // object stores we want to transact on
        'readwrite', // transaction mode
      ).getStore('asrList'); // retrieve the store we want
      const addResult = await DB.addObjectData(menuStore, {
        // set an unique ID
        // object 的key 就是我们创建数据库的时候 config 的key
        asrListKey: result.data.Data.TaskId,

        // set name to be value of mealName state
        taskID: result.data.Data.TaskId,
        fileName: file.fileInfo.name,
        fileSize: file.fileInfo.size,
        fileLocation: file.filePath,
        createdTime: dayjs().format(),
      });
    } catch (e) {
      console.log('error: in transaction not work', e);
    }
    console.log('看一下 result： =>', result);
    dispatch({
      type: ASR_COMMAND.SUBMIT_TRANSLATE_SUCCESS,
      payload: {
        content: result.data.Data.TaskId,
        currentStep: 2,
      },
    });
    return result.data;
  } catch (e) {
    dispatch({ type: ASR_COMMAND.SUBMIT_TRANSLATE_ERROR });
  }
}
