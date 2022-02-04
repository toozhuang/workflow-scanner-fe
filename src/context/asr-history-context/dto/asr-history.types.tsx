export type HistoryCommand = 'REQUEST_HISTORY_LIST'; // todo: 继续补充

/**
 * TODO: 简单的 history action
 */
export type asrHistoryActionTypes = {
  type: HistoryCommand;
  payload: {
    list: any;
  };
  error: string;
};
