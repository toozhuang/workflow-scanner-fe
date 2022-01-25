
export enum ASR_COMMAND {
    CLEAN_UP_STATE='CLEAN_UP_STATE',
    REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
    REQUEST_SIGNATURE_SUCCESS = 'REQUEST_SIGNATURE_SUCCESS',
    REQUEST_SIGNATURE_ERROR = 'REQUEST_SIGNATURE_ERROR',
    UPLOAD_REQUEST = 'UPLOAD_REQUEST',
    UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
    UPLOAD_ERROR = 'UPLOAD_ERROR',
    SUBMIT_TRANSLATE_REQUEST = 'SUBMIT_TRANSLATE_REQUEST',
    SUBMIT_TRANSLATE_SUCCESS = 'SUBMIT_TRANSLATE_SUCCESS',
    SUBMIT_TRANSLATE_ERROR = 'SUBMIT_TRANSLATE_ERROR',
    // 下面尝试少写两个状态
    GET_TRANSLATE_RESULT = 'GET_TRANSLATE_RESULT',
    DOWNLOAD_FILE = 'DOWNLOAD_FILE'
}

export type ActionCommand =|
    'CLEAN_UP_STATE'|
    'REQUEST_SIGNATURE'|
    'REQUEST_SIGNATURE_SUCCESS'|
    'REQUEST_SIGNATURE_ERROR'|
    'UPLOAD_REQUEST'|
    'UPLOAD_SUCCESS'|
    'UPLOAD_ERROR'|
    'SUBMIT_TRANSLATE_REQUEST'|
    'SUBMIT_TRANSLATE_SUCCESS'|
    'SUBMIT_TRANSLATE_ERROR'|
    'GET_TRANSLATE_RESULT'|
    'DOWNLOAD_FILE'

export type AsrStateType = {
    bucket: {
        endpoint: string,
        key: string,
        OriginPolicy: string,
        Policy: string,
        Signature: string,
    }
    file:{
        filePath: string,
        fileInfo: any, // TODO： 先给你一个 any吧， 后面要改
    }

    taskId: string,
    currentStep: Number,
    loading: boolean,
}

export type AsrActionType = {
    type: ActionCommand,
    payload: {
        currentStep: Number,
        content: any,
    },
    error: string
}
