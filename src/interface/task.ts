export interface Response {
  success: boolean;
  message: string;
}

export interface CompleteTaskPayload {
  taskId: number;
}

export interface TasksTabContentProps {
  contactId: string | number | null;
  fileId: string | number | null;
  from: string | null | undefined;
  city: string | null | undefined;
  deedId: string | number | null;
  fileStatus?: string | null | undefined;
}

export interface GetAllTaskQueryParam {
  contactId: string | number | null;
  fileId: string | number | null;
  order: string;
  orderBy: string;
}
export interface GetTaskQueryParam {
  taskId: string | number;
}

export interface GetAllTaskResponse {
  tasks: Array<{
    taskID: number;
    fromUserID: string;
    toUserID: string;
    dateCreated: string;
    dateDue: string;
    dateComplete: string;
    fileID: number;
    contactID: number;
    deedID: number | null;
    orderID: number | null;
    offerID: number | null;
    type: string;
    priority: string;
    result: string;
    memo: string;
    payee: string;
    checkAmount: string;
    address: string;
    city: number;
    state: number;
    zip: number;
    modifyBy: string | null;
    modifyDt: string;
    createdBy: string | null;
    createDate: string;
    FileID: number;
    ContactID: number;
    FromUserID: string;
    ToUserID: string;
    contactName: string;
  }>;
  count: number;
  message: string;
  success: boolean;
  userId: string | null | undefined;
}

export interface GetTaskResponse {
  tasks: {
    taskID: number;
    fromUserID: string;
    toUserID: string;
    dateCreated: string;
    dateDue: string | null | undefined | '';
    dateComplete: string;
    fileID: number;
    contactID: number;
    deedID: number | null;
    orderID: number | null;
    offerID: number | null;
    type: string;
    priority: string;
    result: string;
    memo: string;
    payee: string;
    checkAmount: string;
    address: string;
    city: string;
    state: number;
    zip: number;
    modifyBy: string | null;
    modifyDt: string;
    createdBy: string | null;
    createDate: string;
    FileID: number;
    ContactID: number;
    FromUserID: string;
    ToUserID: string;
    contactName: string;
  };
  message: string;
  success: boolean;
}

export interface DropdownObjectForTypeOfTask {
  taskTypes: Array<object>;
  resultTypes: Array<object>;
  priorityTypes: Array<object>;
  users: Array<object>;
}

export interface CreateTaskPayload {
  ToUserID: string;
  DateDue: string | null | undefined;
  Type: string;
  Memo: string;
  Priority: string;
  City: string | null | undefined;
  FileID: number;
  ContactID: number;
  DeedID?: number;
}

export interface FormValues {
  type: string;
  toUserID: string;
  dateDue: string;
  priority: string;
  city: string | null | undefined;
  memo: string;
  result: string;
  NewTaskToUser: string;
  NewTaskDueDateTime: string;
  NewTaskMemo: string;
  NewTaskPriority: string;
  action?: string;
}

export interface DeleteTaskQueryParams {
  taskId: string | number;
}

export interface UpdateTaskPayload {
  TaskId: string | number;
  DateDue: string | null | undefined;
  Type: string;
  Memo: string;
  Priority: string;
}

export interface TaskFormProps {
  errors?: {
    dateDue?: string;
    type?: string;
    priority?: string;
    NewTaskDueDateTime?: string;
    NewTaskPriority?: string;
  };
  fieldVisibility: {
    showCounty?: boolean;
    showResult?: boolean;
    showDateDue?: boolean;
  };
  isValidating?: boolean;
  mode: string;
  dropDownValue: DropdownObjectForTypeOfTask;
  values: FormValues;
  taskVisibleFields: {
    newTaskField: string[];
    newTaskMemo: string[];
  };
  handleInputChange: (name: string, value: string) => void;
}

export interface CompleteEditTask {
  TaskId: string | number;
  DateDue: string | null | undefined;
  Type: string;
  Memo: string;
  Priority: string;
  Result: string;
  NewTaskToUser: string;
  NewTaskDueDateTime: string;
  NewTaskMemo: string;
  NewTaskPriority: string;
}
