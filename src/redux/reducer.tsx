/**
 * date: 2022-02-6, Sun, 21:31
 * author: TooZhun9
 * feature： 一个 reducer 包含针对 asr history 的几个case
 */

import {
  createAction,
  createReducer,
  AnyAction,
  PayloadAction,
} from '@reduxjs/toolkit';

export type AsrHistoryState = {
  asrHistoryList: AsrHistory[];
};

type AsrHistory = {
  asrKey: number;
  createTime: string;
  fileLocation: string;
  fileName: string;
  fileSize: number;
  taskID: number;
};

const asrHistoryInitState = {};

/**
 * 获取 history
 */
export const retrieveHistory = createAction('history/retrieve');
/**
 * 删除 一个 history
 */
const deleteAHistory = createAction('history/deleteA');

export const asrHistoryReducer = createReducer(asrHistoryInitState, builder => {
  builder.addCase(retrieveHistory, (state, action) => {
    return '嗷嗷阿胶';
  });
});
