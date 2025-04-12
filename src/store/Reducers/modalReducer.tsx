import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import React, { ReactElement } from 'react';

const initialState: {
  open: boolean;
  message?: ReactElement | string;
  title?: string;
  showButton: boolean;
  showTitle: boolean;
  action?: () => void;
  actionDelay?: number;
  showDashboardLink?: boolean;
} = {
  open: false,
  message: <></>,
  title: '',
  showButton: false,
  showTitle: true,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (
      state,
      action: PayloadAction<{
        open?: boolean;
        message?: ReactElement | string;
        title?: string;
        showButton?: boolean;
        showTitle?: boolean;
        action?: () => void;
        actionDelay?: number;
        showDashboardLink?: boolean;
      }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.title = action.payload.title;
      state.showButton = action.payload.showButton || false;
      state.showTitle = action.payload.showTitle || true;
      state.action = action.payload.action;
      state.actionDelay = action.payload.actionDelay;
      state.showDashboardLink = action.payload.showDashboardLink;
    },
    close: state => {
      state.open = false;
    },
  },
});

export const { close, open } = modalSlice.actions;

export default modalSlice.reducer;
