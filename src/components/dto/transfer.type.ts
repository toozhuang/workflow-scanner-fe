export type TransferType = {
  workServer: string;
  id: string;
  status: string;
  processRate: number;
  lastModify: string;
  fileName: string;
  workServerId: string;
  type: string;
  errMsg: string;
};

export type FileType = {
  createdTime: string;
  asrListKey: number;
  fileLocation: string;
  fileName: number;
  fileSize: number;
  taskID: number;
};
