/**
 * date: 2022-01-29, 周六, 22:30
 * author: TooZhun9
 * feature： 使用 Browser DB 存储转码过的文件信息
 */
const createDB = (name: string, version: number, stores: any) => {
  if (!('indexedDB' in window)) {
    throw new Error('IndexedDB is not support in this browser');
  }

  return new Promise((resolve, reject) => {
    let openDBRequest = indexedDB.open(name, version);

    openDBRequest.onupgradeneeded = event => {
      let db = event.target.result;
      if (stores) {
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, store.config);
          }
        });
      }
    };
  });
};

const DB = {
  createDB,
};

export default DB;
