export interface apiError {
  message: string;
}

export interface errorType {
  unexpectedError?: boolean;
  networkError?: boolean;
  newVersion?: boolean;
}
