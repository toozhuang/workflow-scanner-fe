/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * date: 2022-01-30, Sun, 22:4
 * author: TooZhun9
 * feature： 看到有开发这么写， 试试这种方式
 */

const promiseSuspender = (aPromise: Promise<any>) => {
  let status = 'pending'; //设定初始状态
  let result = {}; /// 初始 result 设定为 空

  /**
   * 在内部激活 promise
   */
  const suspendThePromise = aPromise
    .then(promiseResult => {
      status = 'success';
      result = promiseResult;
    })
    .catch(error => {
      status = 'error';
      result = error;
    });

  return {
    read() {
      console.log('status: ', status);

      switch (status) {
        case 'pending':
          throw suspendThePromise;
        case 'error':
          return result;
        default:
          console.log('最终古今呢');
          return result;
      }
    },
  };
};

const suspender = (aPromise: Promise<any>) => {
  return {
    data: promiseSuspender(aPromise),
  };
};

export default suspender;
