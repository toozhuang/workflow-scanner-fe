/**
 * date: 2022-02-22, Tue, 10:47
 * author: TooZhun9
 * feature： 和 ASR History 全局配置 - 包含了 reducer， state 等 store 的一个 slice
 * 可以看到描述为
 * 一个接受 initial state， an object of reducer functions and a slice name
 * 会返回/generated 和 state reducer 一一对应的 action creators action types
 * 针对 asr history 组件的 store 目前有
 * 1. init state （无所谓
 * 2. fetch 获取 db 中的所有 db
 * 3. 添加数据到 db （一个 添加的动作 同时获取新的 state
 * 4. 删除 store 中的 record ， 可以理解成删除了db中的 record以后 重新获取一遍（更保险）
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import DB from '../common/indexed-db';

export interface AsrHistory {
  id: string;
  asrListKey: string;
  taskID?: string;
  fileName: string;
  fileSize?: number;
  fileLocation?: string;
  createTime?: string;
}

export const deleteRecords = createAsyncThunk(
  'asr-history/delete',
  async () => {
    return '1791412296';
  },
);

const asrHistoryEntity = createEntityAdapter<AsrHistory>({
  selectId: (asrHistoryItem: AsrHistory) => asrHistoryItem.asrListKey,
  // sortComparer: (a, b) => a.fileName.localeCompare(b.fileName),
});

export const fetchRecords = createAsyncThunk(
  'asr-history/fetchAll',
  async () => {
    let hasDB;
    try {
      hasDB = await DB.existDB('asrIDB');
      console.log(hasDB);
    } catch (error) {
      console.log('这就是 哈市DB, ', error);
    }
    if (hasDB === 0) {
      console.log('create db');
      // 没有的话 就创建一个
      await DB.createDB('asrIDB', 1, [
        { name: 'asrList', config: { keyPath: 'asrListKey' } },
      ]);
      console.log('这里return 一下');
      return [];
    } else {
      console.log('transaction here');
      // 已经存在该数据库
      let db;
      try {
        db = await DB.openDB('asrIDB', 1);
        console.log('db:', db);
      } catch (e) {
        console.log('error of open db');
        console.log(e);
      }

      // 判断是否存在 对应的 list ， 如果不存在就创建一个 TODO:
      // asrListKey
      const menuStore = await DB.transaction(
        db, // transaction on our DB
        ['asrList'], // object stores we want to transact on
        'readwrite', // transaction mode
      ).getStore('asrList'); // retrieve the store we want

      const result: any = await DB.getAllObjectData(menuStore);
      return result;
    }
  },
);

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
  extraReducers: builder => {
    builder.addCase(fetchRecords.fulfilled, (state, action) => {
      asrHistoryEntity.removeAll(state.asrHistories);
      asrHistoryEntity.addMany(state.asrHistories, action.payload);
    });
    builder.addCase(deleteRecords.fulfilled, (state, action) => {
      asrHistoryEntity.removeOne(state.asrHistories, action.payload);
    });
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
