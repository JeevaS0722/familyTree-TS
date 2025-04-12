export enum severity {
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
}

export interface snackbar {
  open?: boolean;
  verticalPosition?: 'top' | 'bottom';
  horizonalPosition?: 'center' | 'left' | 'right';
  message: string;
  severity: severity;
  persist?: boolean;
}
