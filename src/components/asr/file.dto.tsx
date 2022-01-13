export interface File {
    uid:              string;
    lastModified:     number;
    lastModifiedDate: string;
    name:             string;
    size:             number;
    type:             string;
    percent:          number;
    originFileObj:    OriginFileObj;
    status:           string;
    response:         string;
}

export interface OriginFileObj {
    uid: string;
}
