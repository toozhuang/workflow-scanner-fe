/* eslint-disable */
/**
 * date: 2022-01-30, Sun, 18:2
 * author: TooZhun9
 * feature： Database utils for indexedDb
 */
import { IndexedStoreType } from './dto/indexeddb.type';

/**
 * 判断 该 name 的数据库是否存在于 indexedDB 中
 * 返回 1 表示数据库存在 0 表示数据库不存在
 * @param name
 */
const existDB: (name: string) => Promise<number | string> = (name: string) => {
  if (!('indexedDB' in window)) {
    throw new Error('IndexDB is not support in this browser!');
  }

  /**
   * 最终返回的是 true 或者 false
   * 整个逻辑见：
   */
  return new Promise((resolve, reject) => {
    let exist = 1; // 0 表示不存在, 1 表示存在, -1 表示 通过本身创建的存在 2 表示 error 不用管

    const openRequest = indexedDB.open(name);

    /**
     * 这个会发生在 onsuccess 前面 或者后面都不要紧
     * @param e
     */
    openRequest.onupgradeneeded = e => {
      /**
       * version = 1
       * 代表这个db是刚刚创建的
       */
      if (openRequest.result.version === 1) {
        //  当尝试去 open db 且触发了 onupgradeneeded 事件 的时候
        // 如果 open request 的 version 是 1
        // 那么就可以判定这个数据库之前不存在
        // 需要通过另外的创建事件来创建
        // 但是由于 indexed 的本身的局限性
        // 会在这里默认创建 db
        // 于是需要接着去删除 db
        exist = -1;
        resolve(-1);
      }
    };

    openRequest.onsuccess = event => {
      if (exist === 1) {
        resolve(1);
      }
    };
    //  TODO: 暂时不需要考虑 error 的情况
  }).then(value => {
    if (value === -1) {
      // 如果是 -1 的话， 需要删除我们的刚刚 open 时候默认创建的这个数据库
      return new Promise((resolvea, reject) => {
        const DBDeleteRequest = indexedDB.deleteDatabase(name);
        DBDeleteRequest.onsuccess = event => {
          resolvea(0);
        };

        DBDeleteRequest.onerror = event => {
          resolvea('error');
        };
      });
    } else {
      return new Promise((resolveb, rej) => {
        resolveb(1);
      });
    }
  });
};

const openDB = (name: string, version: number) => {
  if (!('indexedDB' in window)) {
    throw new Error('IndexDB is not support in this browser!');
  }

  return new Promise((resolve, reject) => {
    let openDBRequest = indexedDB.open(name, version);

    openDBRequest.onsuccess = e => {
      // @ts-ignore
      let db = event.target.result;
      resolve(db);
    };
    openDBRequest.onerror = e => {
      // @ts-ignore
      let error = event.target.error;
      reject(error);
    };
  });
};

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
      console.log('database version number：==> ', event.oldVersion, stores);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const db = event.target.result;

      if (stores) {
        // db.createObjectStore('toDoList', { keyPath: 'taskTitle' });
        console.log('onupgradeneeded: open asrIDB');
        stores.forEach(store => {
          // 如果不存在这个 db 对象，那么就去创建一个以这个 key 的
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
      console.log('success on open DB with version of ', event.type, stores); // note: 试一下输出的信息是什么
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const db = event.target.result;
      console.log(
        '来了吗',
        stores === [] || stores === undefined || stores === null,
      );
      // TODO: 内部的业务逻辑还不清楚， 等代码的写的过程中就会更加清除
      if (!(stores === [] || stores === undefined || stores === null)) {
        stores.forEach(store => {
          if (store.data !== undefined) {
            const tx = db.transaction([store.name], 'readwrite');
            console.log('来了吗');
            // @ts-ignore
            store.data.forEach(data => {
              const allData = tx.objectStore(store.name).getAll();
              allData.onsuccess = (e: any) => {
                const match = e.target.result.find(
                  (matchData: any) => matchData.id === data.id,
                );
                if (!match) {
                  const another_tx = db.transaction([store.name], 'readwrite');
                  const addReq = another_tx.objectStore([store.name]).add(data);

                  addReq.onsuccess = (e: any) => resolve(db);
                }
              };
            });
          }
        });
      }

      resolve(db);
    };
  });
};
/**
 * 用来返回store的
 * @param dbObject
 * @param stores
 * @param mode
 */
// @ts-ignore
const transaction = (dbObject, stores, mode) => {
  return {
    tx: dbObject.transaction(stores, mode),
    // @ts-ignore
    getStore(name) {
      return new Promise((resolve, reject) => {
        const tx = dbObject.transaction(stores, mode);

        let store = tx.objectStore(name);

        resolve(store);

        tx.onerror = (event: any) => {
          reject(event.target.error);
        };
      });
    },
  };
};
// @ts-ignore
const getAllObjectData = store => {
  return new Promise((resolve, reject) => {
    let dataRequest = store.getAll();
    // @ts-ignore
    dataRequest.onsuccess = event => {
      resolve(event.target.result);
    };
    // @ts-ignore
    dataRequest.onerror = event => {
      reject(event.target.error);
    };
  });
};

// @ts-ignore
const addObjectData = (store, dataBody) => {
  return new Promise((resolve, reject) => {
    let dataRequest = store.add(dataBody);

    // @ts-ignore
    dataRequest.onsuccess = event => {
      // @ts-ignore
      getAllObjectData(store).then(storeData => resolve(storeData));
    };
    // @ts-ignore
    dataRequest.onerror = event => {
      reject(event.target.error);
    };
  });
};

const DB = {
  createDB,
  openDB,
  existDB,
  transaction,
  addObjectData,
  getAllObjectData,
};

export default DB;
