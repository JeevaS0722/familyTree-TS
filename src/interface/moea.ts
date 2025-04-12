export interface Response {
  success: boolean;
  message: string;
}

export interface addMOEAPayload {
  name: string;
  amount?: number;
  researched: boolean;
  onr: boolean;
  orderNo: string;
  calls: string;
  section: string;
  township: string;
  range?: string;
  county: string;
  state: string;
  company: string;
  notes: string;
}

export interface editMOEAPayload extends addMOEAPayload {
  moeaId: number;
}

export interface getMOEAResponse extends Response {
  data: {
    moeaId: number;
    name: string;
    amount: number;
    researched: boolean;
    onr: boolean;
    orderNo: string;
    calls: string;
    section: string;
    township: string;
    range: string;
    county: string;
    state: string;
    company: string;
    notes: string;
  };
}

export interface getMOEAQueryParams {
  moeaId: number;
}

export interface deleteMOEAPayload {
  moeaId: number;
}

export interface moeaValues {
  moeaId?: number;
  name: string;
  amount?: number;
  researched: boolean;
  onr: boolean;
  orderNo: string;
  calls: string;
  section: string;
  township: string;
  range: string;
  county: string;
  state: string;
  company: string;
  notes: string;
}

export interface moeaFormProps {
  errors?: {
    name?: string;
  };
  isValidating: boolean;
}
