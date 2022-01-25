export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'


export type AxiosRequest ={
    baseURL?: string;
    url: string;
    data?: any;
    params?: any;
    method?: Method;
    headers?: any;
    timeout?: number;
    responseType?: ResponseType;
    withCredentials?: boolean;
}

export type CustomAxiosResponse ={
    status: boolean,
    message: string,
    data: any,
    origin?: object
}
