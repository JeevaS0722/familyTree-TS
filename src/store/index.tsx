import { configureStore } from '@reduxjs/toolkit';
import { authAPI, authHelperAPI } from './Services/auth';
import authReducer from './Reducers/auth';
import snackbarReducer from './Reducers/snackbar';
import { fileApi } from './Services/fileService';
import { commonApi } from './Services/commonService';
import { employeeApi } from './Services/employeeService';
import { contactApi } from './Services/contactService';
import { legalApi } from './Services/legalService';
import { dashboardAPI } from './Services/dashboardService';
import { userAPI } from './Services/userService';
import userReducer from './Reducers/userReducer';
import dashboardReducer from './Reducers/dashboardReducer';
import { searchApi } from './Services/searchService';
import { taskApi } from './Services/taskService';
import { offerApi } from './Services/offerService';
import selectedContactsReducer from './Reducers/selectContactReducer';
import tabReducer from './Reducers/tabReducer';
import { orderApi } from './Services/orderService';
import { addressApi } from './Services/addressService';
import { documentApi } from './Services/documentService';
import recentOfferReducer from './Reducers/recentOfferReducer';
import { docApi } from './Services/docService';
import { notificationApi } from './Services/notificationService';
import notificationReducer from './Reducers/notificationReducer';
import { deedApi } from './Services/deedService';
import { divisionApi } from './Services/divisionService';
import { operatorApi } from './Services/operatorService';
import { suspenseAPI } from './Services/suspenseService';
import { recordingApi } from './Services/recordingService';
import { taxApi } from './Services/taxService';
import searchOperatorReducer from './Reducers/searchOperatorReducer';
import searchDeedReducer from './Reducers/searchDeedReducer';
import searchReducer from './Reducers/searchReducer';
import { noteAPI } from './Services/noteService';
import { wellApi } from './Services/wellService';
import { MOEAAPI } from './Services/moeaService';
import searchMoeaReducer from './Reducers/searchMoea';
import { wellMasterApi } from './Services/wellMasterService';
import timezoneReducer from './Reducers/timezoneSliceReducer';
import { requestCheckApi } from './Services/requestCheckService';
import modalReducer from './Reducers/modalReducer';
import errorReducer from './Reducers/errorReducer';
import appReducer from './Reducers/appReducer';
import tableReducer from './Reducers/tableReducer';
import { familyTreeApi } from './Services/familyTreeService';

const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [authHelperAPI.reducerPath]: authHelperAPI.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [legalApi.reducerPath]: legalApi.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [docApi.reducerPath]: docApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [deedApi.reducerPath]: deedApi.reducer,
    [noteAPI.reducerPath]: noteAPI.reducer,
    auth: authReducer,
    snackbar: snackbarReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    selectedContacts: selectedContactsReducer,
    tab: tabReducer,
    recentOffers: recentOfferReducer,
    notification: notificationReducer,
    searchOperator: searchOperatorReducer,
    searchDeed: searchDeedReducer,
    searchFilters: searchReducer,
    searchMoea: searchMoeaReducer,
    modal: modalReducer,
    error: errorReducer,
    app: appReducer,
    [divisionApi.reducerPath]: divisionApi.reducer,
    [operatorApi.reducerPath]: operatorApi.reducer,
    [suspenseAPI.reducerPath]: suspenseAPI.reducer,
    [recordingApi.reducerPath]: recordingApi.reducer,
    [taxApi.reducerPath]: taxApi.reducer,
    [wellApi.reducerPath]: wellApi.reducer,
    [MOEAAPI.reducerPath]: MOEAAPI.reducer,
    [wellMasterApi.reducerPath]: wellMasterApi.reducer,
    serverTimezone: timezoneReducer,
    [requestCheckApi.reducerPath]: requestCheckApi.reducer,
    table: tableReducer,
    [familyTreeApi.reducerPath]: familyTreeApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authAPI.middleware,
      authHelperAPI.middleware,
      fileApi.middleware,
      commonApi.middleware,
      employeeApi.middleware,
      contactApi.middleware,
      legalApi.middleware,
      dashboardAPI.middleware,
      userAPI.middleware,
      searchApi.middleware,
      taskApi.middleware,
      offerApi.middleware,
      deedApi.middleware,
      orderApi.middleware,
      addressApi.middleware,
      docApi.middleware,
      notificationApi.middleware,
      divisionApi.middleware,
      operatorApi.middleware,
      suspenseAPI.middleware,
      recordingApi.middleware,
      noteAPI.middleware,
      taxApi.middleware,
      wellApi.middleware,
      MOEAAPI.middleware,
      wellMasterApi.middleware,
      documentApi.middleware,
      requestCheckApi.middleware,
      familyTreeApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
