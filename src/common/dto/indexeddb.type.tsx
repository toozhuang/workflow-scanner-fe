/**
 * date: 2022-01-30, Sun, 18:40
 * author: TooZhun9
 * feature： Types used in Indexed Database in the Browser
 */
export type IndexedStoreType = {
  name: string; // store 的名称， 即位于这个 db 中的 一个 类似于 一个 collection
  config: {
    keyPath: string; // 这个 collection 的设定的 key 是什么
  };
  data?: any; // 即是否会在创建的时候放一些值进来
};
