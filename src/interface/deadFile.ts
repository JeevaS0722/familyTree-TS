interface deadFileValues {
  memo: string;
  reason: string;
}

interface deadFilePayload {
  fileId: number;
  memo: string;
  reason: string;
}

export { deadFileValues, deadFilePayload };
