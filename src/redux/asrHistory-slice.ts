/**
 * date: 2022-02-22, Tue, 10:47
 * author: TooZhun9
 * feature： 和 ASR History 相关的 store 配置
 */
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import asrHistory from '../components/asr-history';

export interface AsrHistory {
  id: string;
  asrListKey: string;
  taskID?: string;
  fileName: string;
  fileSize?: number;
  fileLocation?: string;
  createTime?: string;
}

const asrHistoryEntity = createEntityAdapter<AsrHistory>({
  selectId: (asrHistoryItem: AsrHistory) => asrHistoryItem.asrListKey,
  // sortComparer: (a, b) => a.fileName.localeCompare(b.fileName),
});

export const asrHistorySlice = createSlice({
  name: 'asrHistoryState', // 这里只是一个 nameSpace
  initialState:
    // asrHistoryEntity.getInitialState(),
    {
      asrHistories: asrHistoryEntity.getInitialState(),
    },
  reducers: {
    addCounter: function (
      state,
      { payload: { initialValue } }: PayloadAction<{ initialValue: number }>,
    ) {
      console.log('看一下是否有 payload 来： ', initialValue);
      asrHistoryEntity.addOne(state.asrHistories, {
        id: '122',
        asrListKey: '123151',
        fileName: '嗷嗷叫',
      });
    },
  },
});

export const asrHistoryAction = asrHistorySlice.actions;

export type AsrHistorySlice = {
  [asrHistorySlice.name]: ReturnType<typeof asrHistorySlice['reducer']>;
};

export const newStateSelecter = asrHistoryEntity.getSelectors();

export const asrHistorySelectors =
  asrHistoryEntity.getSelectors<AsrHistorySlice>(
    state => state[asrHistorySlice.name].asrHistories,
  ); // todo： 这里面有两个
// 一个是 带有泛型的， 一个是不带的， 好多技术范围了啊
