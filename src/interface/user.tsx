export interface user {
  username: string;
  password: string;
  stayLoggedIn: boolean;
}

export interface userInfo {
  fullName: string | null;
  teamMateId: string | null;
  department: string | null;
  userId: string;
}
export interface getUserResponse {
  success: boolean;
  message: string;
  data: userInfo;
}

export interface User {
  fullName: string;
  userId: string;
}

export interface userListInfo {
  fullName: string;
  userId: string;
}

export interface getUserListResponse {
  success: boolean;
  message: string;
  data: userListInfo[];
}

export interface loginResponse {
  success: boolean;
  message: string;
  servertimezone?: string;
}
