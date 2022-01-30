/**
 * date: 2022-01-30, Sun, 18:2
 * author: TooZhun9
 * feature： Database utils for indexedDb
 */
import { IndexedStoreType } from './dto/indexeddb.type';

const createDB = (
  name: string,
  version: number,
  stores: IndexedStoreType[],
) => {
  if (!('indexedDB' in window)) {
    throw new Error('IndexDB is not support in this browser!');
  }

  /**
   * Note: 暂时不考虑 reject 的情况
   */
  return new Promise(resolve => {
    const openDBRequest: IDBOpenDBRequest = indexedDB.open(name, version);
    /**
     * Db open 时候发生的 event
     * 遍历查看传入的 stores 信息
     * Db 中 如果没有该store
     * 那么就创建一个 该store
     * @param event
     */
    openDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log('database version number： ', event.oldVersion);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const db = event.target.result;

      if (stores) {
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, store.config);
          }
        });
      }
    };

    /**
     * 上面的 createObjectStore 创建成功的时候， 也会
     * 发生一个 event
     * @param event
     */
    openDBRequest.onsuccess = (event: Event) => {
      console.log('success on open DB with version of ', event.type); // note: 试一下输出的信息是什么
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const db = event.target.result;

      // if (!(stores === [] || stores === undefined || stores === null)) {
      //   stores.forEach(store => {
      //     if (store.data !== undefined) {
      //       const tx = db.transaction([store.name], 'readwrite');
      //
      //       store.data.forEach(data => {
      //         const allData = tx.objectStore(store.name).getAll();
      //         allData.onsuccess = e => {
      //           const match = e.target.result.find(
      //             matchData => matchData.id === data.id,
      //           );
      //           if (!match) {
      //             const another_tx = db.transaction([store.name], 'readwrite');
      //             const addReq = another_tx.objectStore([store.name]).add(data);
      //
      //             addReq.onsuccess = e => resolve(db);
      //           }
      //         };
      //       });
      //     }
      //   });
      // }

      resolve(db);
    };
  });
};

const DB = {
  createDB,
};

export default DB;
