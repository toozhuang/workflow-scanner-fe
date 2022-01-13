import axios, {AxiosRequestConfig, Method} from 'axios';


interface PendingType {
    url?: string;
    method?: Method;
    params: any;
    data: any;
    cancel: Function;
}

const pending: Array<PendingType> = []; // 全局 pending
const CancelToken = axios.CancelToken;

// 设置超时时间
axios.defaults.timeout = 10000  // 10 s

const httpService = axios.create({responseType: 'json'})


// 当前的鉴权使用 cookie 就够了， 所以不需要拿取别的状态


// 移出重复请求
const removePending = (config: AxiosRequestConfig) => {
    for (const key in pending) {
        const item: number = +key;  //在这里进行 for 的 +1 操作
        const list: PendingType = pending[key];
        // 当前请求在数组中存在时执行函数体
        if (list.url === config.url && list.method === config.method
            && JSON.stringify(list.params) === JSON.stringify(config.params)
            && JSON.stringify(list.data) === JSON.stringify(config.data)) {
            // 执行取消操作
            list.cancel('操作太频繁，请稍后再试');
            // 从数组中移除记录
            pending.splice(item, 1);
        }
    }
};

httpService.interceptors.request.use(
    config => {
        //    后面在这里和 store 进行沟通， 看是否有 token
        // 如果有 token 就在这里添加上
        // 但因为不需要引入 react redux
        // 所以直接使用localhost 来读取就好
        return config
    },
    error => {
        return Promise.reject(error)
    }
)


//  添加响应拦截器
httpService.interceptors.response.use(
    response => {
        //  在这里统一控制 loading 就好

        removePending(response.config)
        const errorCode = response?.data?.errorCode;
        switch (errorCode) {
            case '401':
                // 根据errorCode，对业务做异常处理(和后端约定)
                break;
            default:
                break;
        }

        return response;
    }, error => {
        //    TODO： 后面接着看把 这里
        const response = error.response;

        // 根据返回的http状态码做不同的处理
        switch (response?.status) {
            case 401:
                // token失效
                break;
            case 403:
                // 没有权限
                break;
            case 500:
                // 服务端错误
                break;
            case 503:
                // 服务端错误
                break;
            default:
                break;
        }

        // 超时重新请求
        const config = error.config;
        // 全局的请求次数,请求的间隙
        const [RETRY_COUNT, RETRY_DELAY] = [3, 1000];

        if (config && RETRY_COUNT) {
            // 设置用于跟踪重试计数的变量
            config.__retryCount = config.__retryCount || 0;
            // 检查是否已经把重试的总数用完
            if (config.__retryCount >= RETRY_COUNT) {
                return Promise.reject(response || {message: error.message});
            }
            // 增加重试计数
            config.__retryCount++;
            // 创造新的Promise来处理指数后退
            const backoff = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, RETRY_DELAY || 1);
            });
            // instance重试请求的Promise
            return backoff.then(() => {
                return httpService(config);
            });
        }

        // eslint-disable-next-line
        return Promise.reject(response || {message: error.message});
    }
)

export default httpService;
