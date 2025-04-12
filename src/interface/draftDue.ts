import { TableColumns, TableData } from './common';

export interface DraftDueSectionProps {
  onLoadingChange?: (loading: boolean) => void;
}

export interface GoalsSectionProps {
  active?: number;
  handleChange?: (index: number) => void;
  isMobileOrTablet?: boolean;
  section?: 'newWells' | 'offers' | 'deals';
}

export interface GoalsSectionAdditionalProps {
  section: 'newWells' | 'offers' | 'deals';
  viewMode: 'list' | 'bar';
  data: TableData[];
  columns: TableColumns[];
  count: number;
  initialLoading: boolean;
  loading: boolean;
  onCellValueChanged: (event: any) => Promise<void>;
  onHeaderValueChange: (field: string, newValue: string) => void;
  handleViewModeToggle: (
    mode: 'list' | 'bar',
    section: 'newWells' | 'offers' | 'deals'
  ) => void;
  renderBarChart: (
    data: TableData[],
    columns: TableColumns[],
    section: 'newWells' | 'offers' | 'deals'
  ) => JSX.Element;
  getTableRowBackgroundColor: () => string;
  isGoalCountLoading: boolean;
}

export interface AddFileNoteResponse {
  success: boolean;
  message: string;
  data?: {
    noteId?: string | null;
  };
}
export interface GetGoalCountResponse {
  success: boolean;
  message: string;
  data: {
    WellCountDetails: WellCountDetails[];
    OffersCountDetails: OffersCountDetails[];
    DealsCountDetails: DealsCountDetails[];
    chipActions: chipActions[];
  };
}

export interface UpdateGoalResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    goal: string;
    year: number;
    january: number | null;
    february: number | null;
    march: number | null;
    april: number | null;
    may: number | null;
    june: number | null;
    july: number | null;
    august: number | null;
    september: number | null;
    october: number | null;
    november: number | null;
    december: number | null;
    total: number | null;
    createdBy: string;
    createDate: string;
    modifyBy: string;
    modifyDt: string;
  };
}

export interface WellCountDetails {
  goal: string;
  year: number;
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
  total: number | null;
  createdBy: string;
  createDate: string;
  modifyBy: string;
  modifyDt: string;
}

export interface OffersCountDetails {
  goal: string;
  year: number;
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
  total: number | null;
  createdBy: string;
  createDate: string;
  modifyBy: string;
  modifyDt: string;
}

export interface DealsCountDetails {
  goal: string;
  year: number;
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
  total: number | null;
  createdBy: string;
  createDate: string;
  modifyBy: string;
  modifyDt: string;
}

export interface UpdateGoalRequest {
  year: number;
  goal: string;
  section: 'well' | 'offers' | 'deals';
  january?: number | null;
  february?: number | null;
  march?: number | null;
  april?: number | null;
  may?: number | null;
  june?: number | null;
  july?: number | null;
  august?: number | null;
  september?: number | null;
  october?: number | null;
  november?: number | null;
  december?: number | null;
}
