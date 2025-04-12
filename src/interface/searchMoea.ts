export interface SearchMOEAByFiltersParams {
  county?: string;
  state?: string;
  amount?: number;
  nr?: boolean;
  eliminateDups?: boolean;
  pageNo?: number | undefined | null | string;
  size?: number | undefined | null | string;
  order?: string | undefined;
  orderBy?: string | undefined;
}

export interface SearchMoeaByNameValues {
  name: string;
}

export interface SearchMoeaByFilterValues {
  county?: string;
  state?: string;
  amount?: number;
  nr?: boolean;
  eliminateDups?: boolean;
}

export interface SearchMOEAParams {
  county?: string;
  state?: string;
  amount?: number;
  name?: string | undefined;
  nr?: boolean;
  eliminateDups?: boolean;
  pageNo?: number;
  size?: number;
  order?: string | undefined;
  orderBy?: string | undefined;
  filterType: string;
}

export interface SearchMOEAByNameParams {
  name: string | undefined;
  pageNo?: number | undefined | null | string;
  size?: number | undefined | null | string;
  order?: string | undefined;
  orderBy?: string | undefined;
}

export interface MOEASearchItem {
  success: boolean;
  message: string;
  data: {
    records: {
      moeaId: number;
      name: string;
      amount: string;
      researched?: string;
      onr?: string;
      orderNo: string;
      calls: string;
      section: string;
      township: string;
      range: string;
      county: string;
      state: string;
      company?: string;
      notes?: string;
    }[];
    count: number;
  };
}
