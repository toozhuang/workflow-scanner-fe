export type AsrStateType = {
    bucket: Object, // 以后这个地方要确定这个存储的到底是什么类型
    filePath: string,
    taskId: string,
    currentStep: Number,
    loading: boolean,
}

export type AsrActionType = {
    type: string,
    payload: {
        step: Number,
        content: object,
    },
    error: string
}
