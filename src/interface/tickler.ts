interface ticklerValues {
  ticklerDate: string;
  memo: string;
}

interface ticklerPayload {
  fileId: number;
  memo: string;
  ticklerDate: string;
  contacts: number[];
}

interface ticklerFormProps {
  errors?: {
    ticklerDate?: string;
  };
  isValidating?: boolean;
}

export { ticklerValues, ticklerPayload, ticklerFormProps };
