import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import OverlayLoader from '../component/common/OverlayLoader';
import Layout from '../layout/layout';
import FamilyTree from '../pages/file/FamilyTree';

const HomePage = React.lazy(
  () => import(/* webpackChunkName: "homePage" */ '../pages/dashboard/home')
);
const NewFilePage = React.lazy(
  () => import(/* webpackChunkName: "newFilePage" */ '../pages/file/NewFile')
);
const EditFilePage = React.lazy(
  () => import(/* webpackChunkName: "editFilePage" */ '../pages/file/EditFile')
);
const FileSearchPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "fileSearchPage" */ '../pages/search/FileSearch'
    )
);
const CourtSearchPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "fileSearchPage" */ '../pages/search/CourtsSearch'
    )
);
const ReadyForOfferPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "readyForOfferPage" */ '../pages/dashboard/actionItems/readyForOffer'
    )
);
const FileReviewPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "fileReviewPage" */ '../pages/dashboard/actionItems/fileReview'
    )
);
const MyTasksPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "myTasksPage" */ '../pages/dashboard/actionItems/myTasks'
    )
);
const UrgentTasksPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "urgentTasksPage" */ '../pages/dashboard/actionItems/urgentTasks'
    )
);
const TeamMateTasksPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "teamMateTasksPage" */ '../pages/dashboard/actionItems/teamMateTasks'
    )
);
const ResearchTasksPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "researchTasksPage" */ '../pages/dashboard/actionItems/researchTasks'
    )
);
const RequestBefore21DaysPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "requestBefore21DaysPage" */ '../pages/dashboard/actionItems/requestBefore21Days'
    )
);
const AddNewContact = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewContact" */ '../pages/contact/AddNewContact'
    )
);
const EditContact = React.lazy(
  () =>
    import(/* webpackChunkName: "editContact" */ '../pages/contact/EditContact')
);
const SearchResultPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "searchResultPage" */ '../pages/search/SearchResult'
    )
);
const AddNewLegal = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewLegalPage" */ '../pages/legal/AddNewLegal'
    )
);
const NewOfferPage = React.lazy(
  () =>
    import(/*webpackChunkName: "addNewOfferPage" */ '../pages/offer/NewOffer')
);

const CheckedOutPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "checkoutPage" */ '../pages/dashboard/actionItems/checkedOut'
    )
);
const UnreceivedRequestsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "unreceivedRequestsPage" */ '../pages/dashboard/actionItems/unreceivedRequests'
    )
);
const RequestsToSendPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "requestsToSendPage" */ '../pages/dashboard/actionItems/requestsToSend'
    )
);
const OffersToSendPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "offersToSendPage" */ '../pages/dashboard/actionItems/offersToSend'
    )
);
const DeedsPendingPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "deedsPendingPage" */ '../pages/dashboard/actionItems/deedsPending'
    )
);
const OfferCompletePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "offerCompletePage" */ '../pages/offer/offerComplete'
    )
);

const EditLegal = React.lazy(
  () =>
    import(/* webpackChunkName: "addNewLegalPage" */ '../pages/legal/EditLegal')
);

const EditOfferPage = React.lazy(
  () => import(/*webpackChunkName: "editOffer" */ '../pages/offer/EditOffer')
);
const OrderCompletePage = React.lazy(
  () =>
    import(
      /*webpackChunkName: "orderComplete" */ '../pages/order/orderComplete'
    )
);

const RequestLetterPage = React.lazy(
  () =>
    import(
      /*webpackChunkName: "requestLetter" */ '../pages/order/OrderRequestLetter'
    )
);

const EditTaskPage = React.lazy(
  () => import(/*webpackChunkName: "editTask" */ '../pages/task/EditTask')
);

const OfferSearchPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "offerSearchPage" */ '../pages/search/OfferSearch'
    )
);

const OrderCompleteSuccessPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "offerSearchPage" */ '../pages/order/orderComplete/orderCompleteSuccess'
    )
);

const DocumentReportPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "documentReportPage" */ '../pages/document/report'
    )
);

const DocumentViewPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "documentReportPage" */ '../pages/document/view'
    )
);

const OfferLetterPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "offerLetterpage" */ '../pages/offer/offerLetter'
    )
);
const EditDeedPage = React.lazy(
  () => import(/* webpackChunkName: "editDeed" */ '../pages/deed/EditDeed')
);
const AddNewAddress = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewAddressPage" */ '../pages/address/AddNewAddress'
    )
);
const AddNewDivision = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewDivisionPage" */ '../pages/division/AddDivision'
    )
);

const AddNewOrderPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewOrderPage" */ '../pages/order/AddNewOrder'
    )
);

const SearchDeedsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "searchDeedPage" */ '../pages/search/DeedsSearch'
    )
);

const SearchOperatorsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "searchDeedPage" */ '../pages/search/OperatorsSearch'
    )
);
const AddNewSuspensePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewSuspensePage" */ '../pages/deed/suspense/AddSuspense'
    )
);

const EditNewSuspensePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editNewSuspensePage" */ '../pages/deed/suspense/EditSuspense'
    )
);

const EditDivision = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewDivisionPage" */ '../pages/division/EditDivision'
    )
);

const EditOrderPage = React.lazy(
  () =>
    import(/* webpackChunkName: "editOrderPage" */ '../pages/order/EditOrder')
);

const RecyclePage = React.lazy(
  () => import(/* webpackChunkName: "recyclePage" */ '../pages/recycle')
);

const DeadFilePage = React.lazy(
  () => import(/* webpackChunkName: "deadFilePage" */ '../pages/deadFile')
);

const AskResearchPage = React.lazy(
  () => import(/* webpackChunkName: "askResearchPage" */ '../pages/askResearch')
);

const TicklerPage = React.lazy(
  () => import(/* webpackChunkName: "ticklerPage" */ '../pages/tickler')
);
const AddNewRecordingPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewRecordingPage" */ '../pages/recording/AddRecording'
    )
);
const EditRecordingPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editRecordingPage" */ '../pages/recording/EditRecording'
    )
);
const AddDeedNotePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addDeedNotePage" */ '../pages/note/deed/AddNotes'
    )
);
const AddContactNotePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addContactNotePage" */ '../pages/note/contact/AddNotes'
    )
);
const AddFileNotePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addFileNotePage" */ '../pages/note/file/AddNotes'
    )
);

const EditNotePage = React.lazy(
  () =>
    import(/* webpackChunkName: "addFileNotePage" */ '../pages/note/EditNote')
);

const AddNewWellPage = React.lazy(
  () =>
    import(/* webpackChunkName: "AddNewWellPage" */ '../pages/wells/AddWell')
);
const EditWellPage = React.lazy(
  () => import(/* webpackChunkName: "EditWellPage" */ '../pages/wells/EditWell')
);

const AddTaxPage = React.lazy(
  () =>
    import(/* webpackChunkName: "addNewRecordingPage" */ '../pages/tax/AddTax')
);
const EditTaxPage = React.lazy(
  () =>
    import(/* webpackChunkName: "editRecordingPage" */ '../pages/tax/EditTax')
);

const SearchWellMastersPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "searchWellMastersPage" */ '../pages/search/WellMastersSearch'
    )
);

const AddNewOperator = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addNewOperatorPage" */ '../pages/operator/AddOperator'
    )
);
const EditOperator = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editOperatorPage" */ '../pages/operator/EditOperator'
    )
);
const SearchMOEAPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "searchMoeaPage" */ '../pages/search/MoeaSearch'
    )
);
const AddMOEAPage = React.lazy(
  () => import(/* webpackChunkName: "addMOEAPage" */ '../pages/moea/AddMoea')
);
const EditMOEAPage = React.lazy(
  () => import(/* webpackChunkName: "editMOEAPage" */ '../pages/moea/EditMoea')
);

const AddWellMaster = React.lazy(
  () =>
    import(
      /* webpackChunkName: "addWellMasterPage" */ '../pages/wellMaster/AddWellMaster'
    )
);

const EditWellMaster = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editWellMasterPage" */ '../pages/wellMaster/EditWellMaster'
    )
);

const UploadDocument = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editUploadDocumentPage" */ '../pages/DocumentTab/UploadDocument'
    )
);

const EditDocument = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editEditDocumentPage" */ '../pages/DocumentTab/EditDocument'
    )
);

const DeedReceivedLetterPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "deedReceivedLetterPage" */ '../pages/deed/DeedReceivedLetter'
    )
);

const RequestCheckPage = React.lazy(
  () =>
    import(/* webpackChunkName: "requestCheckPage" */ '../pages/requestCheck')
);

const PrintPage = React.lazy(
  () => import(/* webpackChunkName: "printPage" */ '../pages/print/print')
);

const ReleaseNotePage = React.lazy(
  () => import(/* webpackChunkName: "printPage" */ '../pages/ReleaseNote/index')
);

const ErrorBoundaryFallback = React.lazy(
  () =>
    import(
      /* webpackChunkName: "routes" */ '../pages/Error/ErrorBoundaryFallback'
    )
);

export const PrivateRouter = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundaryFallback />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/newfile',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <NewFilePage />
          </Suspense>
        ),
      },
      {
        path: '/editfile/:fileId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditFilePage />
          </Suspense>
        ),
      },
      {
        path: '/family_tree/:fileId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <FamilyTree />
          </Suspense>
        ),
      },
      {
        path: '/newcontact',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewContact />
          </Suspense>
        ),
      },
      {
        path: '/editcontact/:contactId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditContact />
          </Suspense>
        ),
      },
      {
        path: '/offer',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <NewOfferPage />
          </Suspense>
        ),
      },
      {
        path: '/searchfiles',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <FileSearchPage />
          </Suspense>
        ),
      },
      {
        path: '/searchcourts',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <CourtSearchPage />
          </Suspense>
        ),
      },
      {
        path: '/searchdeeds',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <SearchDeedsPage />
          </Suspense>
        ),
      },
      {
        path: '/searchoperators',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <SearchOperatorsPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/readyForOffer',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <ReadyForOfferPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/fileReview',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <FileReviewPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/myTasks',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <MyTasksPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/urgentTasks',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <UrgentTasksPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/teamMateTasks',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <TeamMateTasksPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/researchTasks',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <ResearchTasksPage />
          </Suspense>
        ),
      },
      {
        path: '/newlegal',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewLegal />
          </Suspense>
        ),
      },
      {
        path: '/editlegal/:legalId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditLegal />
          </Suspense>
        ),
      },
      {
        path: '/copylegal/:legalId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditLegal />
          </Suspense>
        ),
      },

      {
        path: '/actionItem/requestBefore21Days',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <RequestBefore21DaysPage />
          </Suspense>
        ),
      },
      {
        path: '/findname',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <SearchResultPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/checkedOut',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <CheckedOutPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/unreceivedRequests',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <UnreceivedRequestsPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/requestsToSend',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <RequestsToSendPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/offersToSend',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <OffersToSendPage />
          </Suspense>
        ),
      },
      {
        path: '/actionItem/deedsPending',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <DeedsPendingPage />
          </Suspense>
        ),
      },
      {
        path: '/offer/complete',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <OfferCompletePage />
          </Suspense>
        ),
      },
      {
        path: '/order/complete/success',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <OrderCompleteSuccessPage />
          </Suspense>
        ),
      },
      {
        path: '/order/requestLetter',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <RequestLetterPage />
          </Suspense>
        ),
      },
      {
        path: '/editoffer/:offerId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditOfferPage />
          </Suspense>
        ),
      },
      {
        path: '/order/complete',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <OrderCompletePage />
          </Suspense>
        ),
      },
      {
        path: '/editTask/:taskId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditTaskPage />
          </Suspense>
        ),
      },
      {
        path: '/task/makeTask',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditTaskPage />
          </Suspense>
        ),
      },
      {
        path: '/searchoffers',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <OfferSearchPage />
          </Suspense>
        ),
      },
      {
        path: '/document/report',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <DocumentReportPage />
          </Suspense>
        ),
      },
      {
        path: '/offer/letter',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <OfferLetterPage />
          </Suspense>
        ),
      },
      {
        path: '/editdeed/:deedId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditDeedPage />
          </Suspense>
        ),
      },
      {
        path: '/newaddress',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewAddress />
          </Suspense>
        ),
      },
      {
        path: '/editaddress/:addressId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewAddress />
          </Suspense>
        ),
      },
      {
        path: '/division/new',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewDivision />
          </Suspense>
        ),
      },
      {
        path: '/order/neworder',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewOrderPage />
          </Suspense>
        ),
      },
      {
        path: '/suspense/new',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewSuspensePage />
          </Suspense>
        ),
      },
      {
        path: '/division/edit/:divisionId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditDivision />
          </Suspense>
        ),
      },
      {
        path: '/editSuspense',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditNewSuspensePage />
          </Suspense>
        ),
      },
      {
        path: '/editorder/:orderId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditOrderPage />
          </Suspense>
        ),
      },
      {
        path: '/file/recycle',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <RecyclePage />
          </Suspense>
        ),
      },
      {
        path: '/newrecording/:deedId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewRecordingPage />
          </Suspense>
        ),
      },
      {
        path: '/file/dead',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <DeadFilePage />
          </Suspense>
        ),
      },
      {
        path: '/file/askResearch',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AskResearchPage />
          </Suspense>
        ),
      },
      {
        path: '/file/tickler',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <TicklerPage />
          </Suspense>
        ),
      },
      {
        path: '/editrecording/:recId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditRecordingPage />
          </Suspense>
        ),
      },
      {
        path: '/deed/newNote',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddDeedNotePage />
          </Suspense>
        ),
      },
      {
        path: '/newtax/:deedId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddTaxPage />
          </Suspense>
        ),
      },
      {
        path: '/contact/newNote',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddContactNotePage />
          </Suspense>
        ),
      },
      {
        path: '/edittax/:taxId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditTaxPage />
          </Suspense>
        ),
      },
      {
        path: '/file/newNote',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddFileNotePage />
          </Suspense>
        ),
      },
      {
        path: '/new_well/:divOrderId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewWellPage />
          </Suspense>
        ),
      },
      {
        path: '/editNote',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditNotePage />
          </Suspense>
        ),
      },
      {
        path: '/editwell/:wellId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditWellPage />
          </Suspense>
        ),
      },
      {
        path: '/searchwellmasters',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <SearchWellMastersPage />
          </Suspense>
        ),
      },
      {
        path: '/newoperator',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddNewOperator />
          </Suspense>
        ),
      },
      {
        path: '/editoperator/:operatorID',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditOperator />
          </Suspense>
        ),
      },
      {
        path: '/searchmoea',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <SearchMOEAPage />
          </Suspense>
        ),
      },
      {
        path: '/newmoea',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddMOEAPage />
          </Suspense>
        ),
      },
      {
        path: '/editmoea/:moeaId',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditMOEAPage />
          </Suspense>
        ),
      },
      {
        path: '/wellMaster/add',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <AddWellMaster />
          </Suspense>
        ),
      },
      {
        path: '/editwellMaster/:wellID',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditWellMaster />
          </Suspense>
        ),
      },
      {
        path: '/dragdrop',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <UploadDocument />
          </Suspense>
        ),
      },
      {
        path: '/edit-document/:doc_id',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <EditDocument />
          </Suspense>
        ),
      },
      {
        path: '/deedReceivedLetter',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <DeedReceivedLetterPage />
          </Suspense>
        ),
      },
      {
        path: '/requestCheck',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <RequestCheckPage />
          </Suspense>
        ),
      },
      {
        path: '/print',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <PrintPage />
          </Suspense>
        ),
      },
      {
        path: '/document/view',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <DocumentViewPage />
          </Suspense>
        ),
      },
      {
        path: '/release-notes',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <ReleaseNotePage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<OverlayLoader open />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
]);
