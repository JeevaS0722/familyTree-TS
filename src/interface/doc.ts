export interface Response {
  message: string;
  success: boolean;
}

export interface GetDocQueryParams {
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
}

export interface GetGeneratedDocSignedUrlQuery {
  docId: number;
}

export interface GetGeneratedDocByIdQuery {
  docId: number;
}

export interface GetGeneratedDocSignedUrlResponse extends Response {
  data: {
    url: string;
  };
}

export interface GetGeneratedDocByIdResponse extends Response {
  name: string;
  id: number;
  date: string;
  progress: string;
}

export interface GetGenerateDocData {
  name: string;
  id: number;
  date: string;
  progress: string;
}

export interface GetGeneratedDocResponse extends Response {
  data: {
    count: number;
    records: {
      name: string;
      id: number;
      date: string;
      progress: string;
    }[];
  };
}
