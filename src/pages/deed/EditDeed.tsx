/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { Field, Form, Formik, FormikProps } from 'formik';
import { Deed, EditDeedFormInterface } from '../../interface/deed';
import ContactInfo from '../contact/ContactInfo';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import {
  AltData,
  EmailData,
  PhoneData,
  TitleData,
} from '../../interface/contact';
import {
  useEditDeedMutation,
  useLazyGetDeedQuery,
} from '../../store/Services/deedService';
import { formatDateByMonth, convertToMMDDYYYY } from '../../utils/GeneralUtil';
import { severity } from '../../interface/snackbar';
import { open } from '../../store/Reducers/snackbar';
import {
  useDeleteEmailMutation,
  useDeletePhoneMutation,
  useEditContactMutation,
} from '../../store/Services/contactService';
import moment from 'moment';
import { editDeedSchema } from '../../schemas/editDeedSchema';
import { editContactSchema } from '../../schemas/editContact';
import { useGetUserQuery } from '../../store/Services/userService';
import { clearTabName } from '../../store/Reducers/tabReducer';
import { concatContactName } from '../../utils/contact/utils';
import useDateTime from '../../hooks/useDateTime';
import LazyTab from '../../component/common/wrapper/LazyTab';
import MultiLineTabs from '../../component/CustomTab';
import OverlayLoader from '../../component/common/OverlayLoader';
import { StyledInputLabel } from '../../component/common/CommonStyle';
import EditDeedForm from './EditDeedForm';
import Tooltip from '@mui/material/Tooltip';
import * as Yup from 'yup';
import CustomModel from '../../component/common/CustomModal';
import { DeleteCannotDone } from '../../utils/constants';

const DocumentTab = React.lazy(
  () =>
    import(/* webpackChunkName: "DocumentTab" */ '../DocumentTab/documentTab')
);

const LegalTable = React.lazy(
  () => import(/* webpackChunkName: "legalTable" */ '../legal/LegalTable')
);
const PaymentTab = React.lazy(
  () => import(/* webpackChunkName: "paymentTab" */ './PaymentTab')
);
const CheckListTab = React.lazy(
  () => import(/* webpackChunkName: "checkListTab" */ './CheckListTab')
);
const CurativeTab = React.lazy(
  () => import(/* webpackChunkName: "curativeTab" */ './CurativeTab')
);
const LazyTaskTabContent = React.lazy(
  () =>
    import(/* webpackChunkName: "taskTabContent" */ '../task/TasksTabContent')
);
const LazyNoteTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "noteTabContent" */ '../note/deed/NotesTabContent'
    )
);
const LazyDivisionTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "divisionTabContent" */ '../division/DivisionTabContent'
    )
);
const LazySuspenseTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "suspenseTabContent" */ './suspense/SuspenseTabContent'
    )
);
const LazyRecordingTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "recordingTabContent" */ '../recording/RecordingTabContent'
    )
);

const LazyTaxTabContent = React.lazy(
  () => import(/* webpackChunkName: "taxTabContent" */ '../tax/TaxTabContent')
);

const LazyWellSectionFiles = React.lazy(
  () =>
    import(/* webpackChunkName: "wellSectionTabContent" */ './WellSectionFiles')
);

let initialValues: EditDeedFormInterface = {
  fileID: 0,
  contactID: 0,
  fileName: '',
  grantor: '',
  whose: null,
  fileStatus: '',
  returnedTo: '',
  returnDt: '',
  returnDate: '',
  deedState: '',
  deedCounty: '',
  paperFile: false,
  titleFailed: 0,
  titleFailedReason: '',
  totalPurchased: 0,
  complete: false,
  ckLegals: false,
  revisions: false,
  revRcvd: false,
  revRcvdNA: false,
  curativeNeed: false,
  curativeRcvd: false,
  curativeNA: false,
  quietTitle: false,
  qtComplete: false,
  qtNA: false,
  onlineCtyRecDt: '',
  onlineResearchDt: '',
  draftAmount1: 0,
  dueDt1: '',
  datePaid1: '',
  checkNo1: '',
  paid1: false,
  draftAmount2: 0,
  dueDt2: '',
  datePaid2: '',
  checkNo2: '',
  paid2: false,
  relationship: '',
  ownership: '',
  lastName: '',
  firstName: '',
  contactName: '',
  sSN: '',
  dOB: '',
  deceased: false,
  decDt: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  email: [],
  visit: false,
  dNC: false,
  ticklered: '',
  fastTrack: false,
  company: '',
  modifyBy: '',
  modifyDt: '',
  totalNMAOwned: 0,
  phone: [],
  fundsNA: false,
  drillingInfo: null,
  checked: null,
  recComplete: false,
  taxesDue: false,
  taxNA: false,
  taxEntityCk: false,
  taxPartialOwn: false,
  wellFComp: false,
  wellFNA: false,
  sectionFComp: false,
  sectionFNA: false,
  listWellFiles: '',
  listSectFiles: '',
  altName: [],
  title: [],
};

const EditDeed: React.FC = () => {
  const { deedId } = useParams();
  const { formatDateTime } = useDateTime();
  const { t } = useTranslation('editDeed');
  const { t: ec } = useTranslation('editContact');
  useGetUserQuery('');
  const dispatch = useAppDispatch();
  const [deedDetailsData, setDeedDetailsData] = React.useState(initialValues);
  const navigate = useNavigate();
  const [phone, setPhone] = React.useState<PhoneData[]>([]);
  const [email, setEmail] = React.useState<EmailData[]>([]);
  const [altName, setAltName] = React.useState<AltData[]>([]);
  const [title, setTitle] = React.useState<TitleData[]>([]);
  const [actionType, setActionType] = React.useState('');
  const [editContact] = useEditContactMutation();
  const [editDeed] = useEditDeedMutation();

  const phone1Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const phone2Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const phone3Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const errorCountyRef = React.useRef<HTMLDivElement>(null);
  const [deletePhone] = useDeletePhoneMutation();
  const [deleteEmail] = useDeleteEmailMutation();

  const [error, setError] = React.useState<string>('');
  const [deleteModalState, setDeleteModalState] = React.useState({
    open: false,
    type: '', // "phone" or "email"
    index: null,
    title: '',
    header: '',
  });
  const openDeleteModal = (
    type: 'phone' | 'email',
    index: number,
    header: string,
    title: string
  ) => {
    const formikEntry = formikRef.current.values[type][index];
    const currentEntry = type === 'phone' ? phone[index] : email[index];
    const originalEntry = formikRef.current.initialValues[type]?.[index];
    const idField = type === 'phone' ? 'phoneID' : 'Id';

    const currentDesc = formikEntry?.phoneDesc || formikEntry?.emailDesc;
    const originalDesc = originalEntry?.phoneDesc || originalEntry?.emailDesc;
    // Check if it's a new unsaved entry (no ID) or completely empty
    const isNewOrEmpty =
      !currentEntry[idField] ||
      (type === 'phone'
        ? !currentEntry.areaCode &&
          !currentEntry.prefix &&
          !currentEntry.phoneID &&
          !currentEntry.phoneNo &&
          !currentDesc
        : !currentEntry.email && !currentEntry.Id && !currentDesc);

    // Check if existing record has been modified
    const hasUnsavedChanges =
      currentEntry[idField] &&
      (type === 'phone'
        ? currentEntry.areaCode !== originalEntry?.areaCode ||
          currentEntry.prefix !== originalEntry?.prefix ||
          currentEntry.phoneNo !== originalEntry?.phoneNo ||
          currentDesc !== originalDesc
        : currentEntry.email !== originalEntry?.email ||
          currentDesc !== originalDesc);
    if (isNewOrEmpty) {
      // Delete immediately if new or empty
      const updatedEntries = [...(type === 'phone' ? phone : email)];
      updatedEntries.splice(index, 1);

      if (type === 'phone') {
        setPhone(updatedEntries);
      } else {
        setEmail(updatedEntries);
      }

      formikRef.current.setFieldValue(type, updatedEntries);
      return;
    } else if (hasUnsavedChanges) {
      // Show error for modified existing records
      dispatch(
        open({
          severity: severity.error,
          message: DeleteCannotDone,
        })
      );
      return;
    }
    const detailTitle =
      type === 'phone'
        ? `Delete Phone: ${currentEntry.areaCode || ''}-${currentEntry.prefix || ''}-${currentEntry.phoneNo || ''} ${currentDesc ? `(${currentDesc})` : ''}`
        : `Delete Email: ${currentEntry.email || ''} ${currentDesc ? `(${currentDesc})` : ''}`;

    // Show confirmation for unmodified existing records
    setDeleteModalState({
      open: true,
      type,
      index,
      header: detailTitle.trim() || header,
      title,
    });
  };
  const closeDeleteModal = () => {
    setDeleteModalState({
      open: false,
      type: '',
      index: null,
      title: '',
      header: '',
    });
  };

  const addNewPhone = () => {
    setPhone([
      ...phone,
      { areaCode: '', prefix: '', phoneNo: '', phoneDesc: '' },
    ]);
  };
  const addNewEmail = () => {
    setEmail([...email, { email: '', emailDesc: '' }]);
  };
  const addNewAltName = () => {
    setAltName([...altName, { altName: '', altNameFormat: '' }]);
  };
  const addNewTitle = () => {
    setTitle([
      ...title,
      { individuallyAndAs: false, title: '', preposition: '', entityName: '' },
    ]);
  };

  const handleEmailChange = (
    index: number,
    key: keyof EmailData,
    value: string
  ) => {
    if (key === 'email' || key === 'emailDesc') {
      const updatedEmail = [...email];
      updatedEmail[index][key] = value;
      setEmail(updatedEmail);
    }
  };

  const handleTitleChange = (
    index: number,
    key: keyof TitleData,
    value: string
  ) => {
    const updatedTitle = [...title];
    updatedTitle[index][key] = value;
    setTitle(updatedTitle);
  };
  useEffect(() => {
    dispatch(clearTabName());
  }, []);
  const handlePhoneChange = (
    index: number,
    key: keyof PhoneData,
    value: string
  ) => {
    if (
      key === 'phoneNo' ||
      key === 'areaCode' ||
      key === 'prefix' ||
      key === 'phoneDesc'
    ) {
      const updatedPhone = [...phone];

      updatedPhone[index][key] = value;

      setPhone(updatedPhone);
      if (key === 'areaCode' && value.length === 3) {
        phone2Ref.current[index]?.focus();
      } else if (key === 'prefix' && value.length === 3) {
        phone3Ref.current[index]?.focus();
      }
    }
  };
  const handleAltNameChange = (
    index: number,
    key: keyof AltData,
    value: string
  ) => {
    if (key === 'altName' || key === 'altNameFormat') {
      const updateAltName = [...altName];
      updateAltName[index][key] = value;
      setAltName(updateAltName);
    }
  };
  const handleDeedDetailsData = (
    deed: Deed,
    totalPurchased: number,
    totalNMAOwned: number
  ) => {
    setDeedDetailsData({
      fileID: deed?.fileID,
      contactID: deed?.contactID,
      fileName: deed?.FilesModel.fileName,
      grantor: deed?.ContactsModel.grantor,
      whose: deed?.FilesModel.whose,
      fileStatus: deed?.FilesModel.fileStatus,
      returnedTo: deed?.FilesModel.returnedTo,
      returnDt: deed?.FilesModel.returnDt
        ? formatDateByMonth(deed?.FilesModel.returnDt).toString()
        : undefined,
      returnDate: deed?.returnDate
        ? formatDateByMonth(deed?.returnDate).toString()
        : undefined,
      paperFile: deed?.FilesModel.paperFile,
      titleFailed: deed?.titleFailed,
      titleFailedReason: deed?.titleFailedReason,
      deedCounty: deed?.county,
      deedState: deed?.state,
      complete: !!deed?.complete,
      ckLegals: !!deed?.ckLegals,
      revisions: !!deed?.revisions,
      revRcvd: !!deed?.revRcvd,
      revRcvdNA: !!deed?.revRcvdNA,
      curativeNeed: !!deed?.curativeNeed,
      curativeRcvd: !!deed?.curativeRcvd,
      curativeNA: !!deed?.curativeNA,
      quietTitle: !!deed?.quietTitle,
      qtComplete: !!deed?.qtComplete,
      qtNA: !!deed?.qtNA,
      paid1: !!deed?.paid1,
      paid2: !!deed?.paid2,
      fundsNA: !!deed?.fundsNA,
      recComplete: !!deed?.recComplete,
      taxesDue: !!deed?.taxesDue,
      taxNA: !!deed?.taxNA,
      taxEntityCk: !!deed?.taxEntityCk,
      taxPartialOwn: !!deed?.taxPartialOwn,
      draftAmount1: deed?.draftAmount1,
      draftAmount2: deed?.draftAmount2,
      onlineCtyRecDt: deed?.FilesModel?.onlineCtyRecDt
        ? formatDateByMonth(deed?.FilesModel?.onlineCtyRecDt).toString()
        : null,
      onlineResearchDt: deed?.FilesModel?.onlineResearchDt
        ? formatDateByMonth(deed?.FilesModel?.onlineResearchDt).toString()
        : null,
      dueDt1: deed?.dueDt1
        ? formatDateByMonth(deed?.dueDt1).toString()
        : undefined,
      datePaid1: deed?.datePaid1
        ? formatDateByMonth(deed.datePaid1).toString()
        : undefined,
      checkNo1: deed?.checkNo1,
      dueDt2: deed?.dueDt2
        ? formatDateByMonth(deed?.dueDt2).toString()
        : undefined,
      datePaid2: deed?.datePaid2
        ? formatDateByMonth(deed?.datePaid2).toString()
        : null,
      checkNo2: deed?.checkNo2,
      totalPurchased: totalPurchased,
      totalNMAOwned: totalNMAOwned,
      relationship: deed?.ContactsModel?.relationship,
      ownership: String(deed?.ContactsModel?.ownership),
      lastName: deed?.ContactsModel?.lastName,
      firstName: deed?.ContactsModel?.firstName,
      contactName:
        deed?.ContactsModel?.lastName + ', ' + deed?.ContactsModel?.firstName,
      sSN: deed?.ContactsModel?.sSN,
      dOB: convertToMMDDYYYY(deed?.ContactsModel?.dOB),
      deceased: deed?.ContactsModel?.deceased,
      decDt: convertToMMDDYYYY(deed?.ContactsModel?.decDt),
      address: deed?.ContactsModel?.address,
      city: deed?.ContactsModel?.city,
      state: deed?.ContactsModel?.state,
      zip: deed?.ContactsModel?.zip,
      visit: deed?.ContactsModel?.visit,
      dNC: deed?.ContactsModel?.dNC,
      ticklered: deed?.ContactsModel?.ticklered
        ? formatDateByMonth(deed?.ContactsModel?.ticklered).toString()
        : null,
      fastTrack: deed?.ContactsModel?.fastTrack,
      company: deed?.FilesModel.company,
      drillingInfo: !!deed?.drillingInfo,
      checked: !!deed?.checked,
      modifyBy: deed?.FilesModel.modifyBy,
      modifyDt: formatDateTime(deed?.FilesModel.modifyDt).toString(),
      phone: deed?.ContactsModel?.PhonesModels?.map(phone => {
        const modifyPhone = {
          areaCode: phone.phoneNo.substring(0, 3),
          prefix: phone.phoneNo.substring(3, 6),
          phoneNo: phone.phoneNo.substring(6),
          phoneID: phone.phoneID,
          contactID: phone.contactID,
          phoneDesc: phone.phoneDesc,
        };

        return modifyPhone;
      }),
      email: deed?.ContactsModel?.EmailsModels.map(email => {
        const modifyEmail = {
          Id: email.Id,
          email: email.email,
          contactId: email.contactId,
          emailDesc: email.emailDesc,
        };
        return modifyEmail;
      }),
      altName: deed?.ContactsModel?.AlternativeNamesModels?.map(altName => {
        const modifyAltName = {
          Id: altName.Id,
          altName: altName.altName,
          contactId: altName.contactId,
          altNameFormat: altName.altNameFormat,
        };
        return modifyAltName;
      }),
      title: deed?.ContactsModel?.TitlesModels?.map(title => {
        const modifyTitle = {
          Id: title.Id,
          contactID: title.contactID,
          individuallyAndAs: title.individuallyAndAs,
          title: title.title,
          preposition: title.preposition,
          entityName: title.entityName,
        };
        return modifyTitle;
      }),
      wellFComp: deed?.wellFComp,
      wellFNA: deed?.wellFNA,
      sectionFComp: deed?.sectionFComp,
      sectionFNA: deed?.sectionFNA,
      listWellFiles: deed?.listWellFiles,
      listSectFiles: deed?.listSectFiles,
    });
    initialValues = {
      ...initialValues,
      fileName: deed?.FilesModel.fileName,
      grantor: deed?.ContactsModel.grantor,
      whose: deed?.FilesModel.whose,
      fileStatus: deed?.FilesModel.fileStatus,
      returnedTo: deed?.FilesModel.returnedTo,
      returnDt: deed?.FilesModel.returnDt
        ? formatDateByMonth(deed?.FilesModel.returnDt).toString()
        : undefined,
      returnDate: deed?.returnDate
        ? formatDateByMonth(deed?.returnDate).toString()
        : undefined,
      paperFile: deed?.FilesModel.paperFile,
      titleFailed: deed?.titleFailed,
      titleFailedReason: deed?.titleFailedReason,
      deedCounty: deed?.county,
      deedState: deed?.state,
      totalPurchased: totalPurchased,
      totalNMAOwned: totalNMAOwned,
      complete: !!deed?.complete,
      ckLegals: !!deed?.ckLegals,
      revisions: !!deed?.revisions,
      revRcvd: !!deed?.revRcvd,
      revRcvdNA: !!deed?.revRcvdNA,
      curativeNeed: !!deed?.curativeNeed,
      curativeRcvd: !!deed?.curativeRcvd,
      curativeNA: !!deed?.curativeNA,
      quietTitle: !!deed?.quietTitle,
      qtComplete: !!deed?.qtComplete,
      qtNA: !!deed?.qtNA,
      paid1: !!deed?.paid1,
      paid2: !!deed?.paid2,
      fundsNA: !!deed?.fundsNA,
      recComplete: !!deed?.recComplete,
      draftAmount1: deed?.draftAmount1,
      draftAmount2: deed?.draftAmount2,
      onlineCtyRecDt: deed?.FilesModel?.onlineCtyRecDt
        ? formatDateByMonth(deed?.FilesModel?.onlineCtyRecDt).toString()
        : null,
      onlineResearchDt: deed?.FilesModel?.onlineResearchDt
        ? formatDateByMonth(deed?.FilesModel?.onlineResearchDt).toString()
        : null,
      dueDt1: deed?.dueDt1
        ? formatDateByMonth(deed?.dueDt1).toString()
        : undefined,
      datePaid1: deed?.datePaid1
        ? formatDateByMonth(deed?.datePaid1).toString()
        : undefined,
      checkNo1: deed?.checkNo1,
      dueDt2: deed?.dueDt2
        ? moment(deed.dueDt2, 'YYYYMMDD').format('YYYY-MM-DD')
        : undefined,
      datePaid2: deed?.datePaid2
        ? formatDateByMonth(deed?.datePaid2).toString()
        : null,
      checkNo2: deed?.checkNo2,
      relationship: deed?.ContactsModel?.relationship,
      ownership: String(deed?.ContactsModel?.ownership),
      lastName: deed?.ContactsModel?.lastName,
      firstName: deed?.ContactsModel?.firstName,
      contactName:
        deed?.ContactsModel?.lastName + ', ' + deed?.ContactsModel?.firstName,
      sSN: deed?.ContactsModel?.sSN,
      dOB: convertToMMDDYYYY(deed?.ContactsModel?.dOB),
      deceased: deed?.ContactsModel?.deceased,
      decDt: convertToMMDDYYYY(deed?.ContactsModel?.decDt),
      address: deed?.ContactsModel?.address,
      city: deed?.ContactsModel?.city,
      state: deed?.ContactsModel?.state,
      zip: deed?.ContactsModel?.zip,
      visit: deed?.ContactsModel?.visit,
      dNC: deed?.ContactsModel?.dNC,
      ticklered: deed?.ContactsModel?.ticklered,
      fastTrack: deed?.ContactsModel?.fastTrack,
      company: deed?.FilesModel.company,
      drillingInfo: !!deed?.drillingInfo,
      checked: !!deed?.checked,
      modifyBy: deed?.FilesModel.modifyBy,
      modifyDt: formatDateTime(deed?.FilesModel.modifyDt).toString(),
      phone: deed?.ContactsModel?.PhonesModels?.map(phone => {
        const modifyPhone = {
          areaCode: phone.phoneNo.substring(0, 3),
          prefix: phone.phoneNo.substring(3, 6),
          phoneNo: phone.phoneNo.substring(6),
          phoneID: phone.phoneID,
          contactID: phone.contactID,
          phoneDesc: phone.phoneDesc,
        };

        return modifyPhone;
      }),
      email: deed?.ContactsModel?.EmailsModels.map(email => {
        const modifyEmail = {
          Id: email.Id,
          email: email.email,
          contactId: email.contactId,
          emailDesc: email.emailDesc,
        };
        return modifyEmail;
      }),
      altName: deed?.ContactsModel?.AlternativeNamesModels?.map(altName => {
        const modifyAltName = {
          Id: altName.Id,
          altName: altName.altName,
          contactId: altName.contactId,
          altNameFormat: altName.altNameFormat,
        };
        return modifyAltName;
      }),
      title: deed?.ContactsModel?.TitlesModels?.map(title => {
        const modifyTitle = {
          Id: title.Id,
          contactID: title.contactID,
          individuallyAndAs: title.individuallyAndAs,
          title: title.title,
          preposition: title.preposition,
          entityName: title.entityName,
        };
        return modifyTitle;
      }),
      wellFComp: deed?.wellFComp,
      wellFNA: deed?.wellFNA,
      sectionFComp: deed?.sectionFComp,
      sectionFNA: deed?.sectionFNA,
      listWellFiles: deed?.listWellFiles,
      listSectFiles: deed?.listSectFiles,
    };
    if (initialValues.phone) {
      setPhone(initialValues.phone);
    }
    if (initialValues.email) {
      setEmail(initialValues.email);
    }
    if (initialValues.altName) {
      setAltName(initialValues.altName);
    }
    if (initialValues.title) {
      setTitle(initialValues.title);
    }
  };

  const [getDeed, { data: deedDetails, isLoading }] = useLazyGetDeedQuery();

  React.useEffect(() => {
    const fetchDeedDetails = async () => {
      await getDeed({ deedId: Number(deedId) });
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchDeedDetails();
  }, [getDeed, deedId]);
  React.useEffect(() => {
    if (deedDetails && deedDetails?.deed) {
      handleDeedDetailsData(
        deedDetails?.deed,
        deedDetails?.totalPurchased,
        deedDetails?.totalNMAOwned
      );
    }
  }, [deedDetails]);
  const checkPhoneValuesEmpty = (obj: Partial<PhoneData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof PhoneData] !== '') {
        return false;
      }
    }
    return true;
  };
  const checkEmailValuesEmpty = (obj: Partial<EmailData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof EmailData] !== '') {
        return false;
      }
    }
    return true;
  };
  const checkAltNameEmpty = (obj: Partial<AltData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof AltData] !== '') {
        return false;
      }
    }
    return true;
  };
  const handleTabChange = () => {
    void getDeed({ deedId: Number(deedId) });
  };

  const checkTitleEmpty = (obj: Partial<TitleData>): boolean => {
    return (
      !obj.title?.trim() && !obj.preposition?.trim() && !obj.entityName?.trim()
    );
  };

  const onSubmit = async (values: EditDeedFormInterface) => {
    if (!error) {
      try {
        if (actionType === 'saveDeed') {
          const data = {
            deedId: Number(deedId),
            fileId: values.fileID,
            whose: values.whose,
            fileStatus: values.fileStatus,
            returnedTo: values.returnedTo,
            paperFile: values.paperFile,
            returnDt: values.returnDt ? values.returnDt : '',
            returnDate: values.returnDate,
            deedCounty: values.deedCounty,
            deedState: values.deedState,
            titleFailedReason: values.titleFailedReason,
            complete: values.complete,
            ckLegals: values.ckLegals,
            revisions: values.revisions,
            revRcvd: values.revRcvd,
            revRcvdNA: values.revRcvdNA,
            curativeNeed: values.curativeNeed,
            curativeRcvd: values.curativeRcvd,
            curativeNA: values.curativeNA,
            quietTitle: values.quietTitle,
            qtComplete: values.qtComplete,
            qtNA: values.qtNA,
            onlineCtyRecDt: values.onlineCtyRecDt
              ? values.onlineCtyRecDt
              : null,
            onlineResearchDt: values.onlineResearchDt
              ? values.onlineResearchDt
              : null,
            draftAmount1: values.draftAmount1,
            dueDt1: values.dueDt1,
            datePaid1: values.datePaid1 ? values.datePaid1 : null,
            checkNo1: values.checkNo1,
            paid1: values.paid1,
            draftAmount2: values.draftAmount2,
            dueDt2: values.dueDt2 ? values.dueDt2 : null,
            datePaid2: values.datePaid2 ? values.datePaid2 : null,
            checkNo2: values.checkNo2,
            paid2: values.paid2,
            fundsNA: values.fundsNA,
            recComplete: values.recComplete,
            drillingInfo: !!values?.drillingInfo,
            checked: !!values?.checked,
            taxesDue: values.taxesDue,
            taxNA: values.taxNA,
            taxEntityCk: values.taxEntityCk,
            taxPartialOwn: values.taxPartialOwn,
            wellFComp: values.wellFComp,
            wellFNA: values.wellFNA,
            sectionFComp: values.sectionFComp,
            sectionFNA: values.sectionFNA,
            listWellFiles: values.listWellFiles,
            listSectFiles: values.listSectFiles,
          };
          const response = await editDeed(data);
          if ('data' in response) {
            if (response?.data?.success) {
              void getDeed({ deedId: Number(deedId) });
              dispatch(
                open({
                  severity: severity.success,
                  message: response?.data?.message,
                })
              );
            }
          }
        } else if (actionType === 'saveContact') {
          const data = {
            contactID: values.contactID,
            fileID: values?.fileID,
            relationship: values.relationship,
            ownership: values.ownership,
            lastName: values.lastName,
            firstName: values.firstName,
            sSN: values.sSN,
            dOB: values?.dOB || '',
            deceased: values.deceased,
            decDt: values.decDt || '',
            address: values.address,
            city: values.city,
            state: values.state,
            zip: values.zip,
            visit: values.visit,
            dNC: values.dNC,
            ticklered: values.ticklered || '',
            fastTrack: values.fastTrack,
            whose: values.whose,
            fileStatus: values.fileStatus,
            returnedTo: values.returnedTo,
            returnDt: values.returnDt
              ? formatDateByMonth(values.returnDt.toString()).toString()
              : '',
            paperFile: values.paperFile,
            phone: values.phone?.filter(obj => !checkPhoneValuesEmpty(obj)),
            email: values.email?.filter(obj => !checkEmailValuesEmpty(obj)),
            altName: values.altName?.filter(obj => !checkAltNameEmpty(obj)),
            title: values.title?.map(obj => {
              if (!obj.individuallyAndAs && checkTitleEmpty(obj)) {
                return { Id: obj.Id }; // Send only the ID to the backend for deletion
              }
              return obj;
            }),
          };

          const response = await editContact(data);
          if ('data' in response) {
            if (response?.data?.success) {
              void getDeed({ deedId: Number(deedId) });
              dispatch(
                open({
                  severity: severity.success,
                  message: response?.data?.message,
                })
              );
            }
          }
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'unaccepted error occurred',
          })
        );
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  let validationSchema;
  if (actionType === 'saveDeed') {
    validationSchema = editDeedSchema(t);
  } else if (actionType === 'saveContact') {
    validationSchema = editContactSchema(ec);
  }
  const formikRef = React.useRef<FormikProps<EditDeedFormInterface>>(null);
  const handleItemDelete = async () => {
    const { type, index } = deleteModalState;

    const currentEntry = type === 'phone' ? phone[index] : email[index];
    const idField = type === 'phone' ? 'phoneID' : 'Id';
    try {
      const response =
        type === 'phone'
          ? await deletePhone({ phoneId: Number(currentEntry?.[idField]) })
          : await deleteEmail({ emailId: Number(currentEntry?.[idField]) });

      if ('data' in response) {
        if (response?.data?.success) {
          void getDeed({ deedId: Number(deedId) });
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          closeDeleteModal();
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
    }
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      {isLoading || !deedDetailsData?.fileID ? (
        <OverlayLoader open />
      ) : (
        <Box>
          <Grid
            container
            sx={{
              mt: 2,
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid item xs={12} sm={4}>
              <Link
                id="goToFileView"
                className="hover-link-span text-decoration-none"
                to={`/editfile/${Number(deedDetailsData?.fileID)}`}
              >
                <KeyboardBackspaceIcon
                  sx={{
                    fontSize: '20px',
                  }}
                />
                {t('goToFile')}
              </Link>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: { xs: 2, sm: 0 } }}>
              <Box
                display="flex"
                justifyContent={{ xs: 'flex-start', sm: 'center' }}
                alignItems="center"
              >
                <Link
                  id="goToContactView"
                  className="hover-link-span text-decoration-none"
                  to={`/editcontact/${Number(deedDetailsData?.contactID)}`}
                >
                  <KeyboardBackspaceIcon
                    sx={{
                      fontSize: '20px',
                    }}
                  />
                  {t('goToContact')}
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: { xs: 2, sm: 0 } }}>
              <Box
                display="flex"
                justifyContent={{ xs: 'flex-start', sm: 'center' }}
                alignItems="center"
              >
                <Tooltip title="Print Deed">
                  <Button
                    id="printDeed"
                    onClick={() => {
                      navigate('/print?deedId=' + deedId, {
                        state: {
                          deedId: Number(deedId),
                          isFileView: false,
                        },
                      });
                    }}
                    sx={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      minWidth: 0,
                      color: '#1997c6',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textTransform: 'none', // Disable uppercase transformation
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                      '&:focus-visible': {
                        outline: '1px solid #FFFF', // Custom border color
                        outlineOffset: '2px', // Optional spacing around the border
                        borderRadius: '2px', // Matches Material-UI's default border-radius
                      },
                    }}
                    disableRipple // Disable Material-UI ripple effect
                  >
                    <LocalPrintshopIcon sx={{ color: '#1997c6', mr: 1 }} />
                    {t('print')}
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 2 }}>
            <Typography
              component="h6"
              id="deedView"
              className="header-title-h6"
            >
              {t('deedView')}
            </Typography>
          </Grid>
          <Formik
            innerRef={formikRef}
            initialValues={deedDetailsData}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}
            validate={values => {
              let schema;
              if (actionType === 'saveDeed') {
                schema = editDeedSchema(t);
              } else if (actionType === 'saveContact') {
                schema = editContactSchema(ec);
              }
              if (!schema) {
                return {};
              }
              try {
                // Ensure you use validateSync or validate
                schema.validateSync(values, { abortEarly: false });
              } catch (error) {
                if (
                  error instanceof Yup.ValidationError &&
                  error.inner.length > 0
                ) {
                  setTimeout(() => {
                    const errorElement = document.querySelector(
                      `[name="${error.inner[0].path}"]`
                    );
                    errorElement?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }, 100);
                }
                return {};
              }
              return {};
            }}
          >
            {({
              isSubmitting,
              isValidating,
              setFieldValue,
              values,
              errors,
            }) => (
              <Form>
                <Box>
                  <Grid container spacing={{ xs: 2, md: 2 }}>
                    <EditDeedForm
                      isValidating={isValidating}
                      values={values}
                      errors={errors}
                      deedDetailsData={deedDetailsData}
                      error={error}
                      setError={setError}
                      errorCountyRef={errorCountyRef}
                    />
                    <Grid
                      container
                      spacing={{ xs: 1, sm: 1 }}
                      sx={{
                        marginTop: '10px !important',
                        justifyContent: 'center',
                        width: '100% !important',
                      }}
                    >
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        id="save-deed"
                        variant="outlined"
                        onClick={() => setActionType('saveDeed')}
                        sx={{
                          my: '1rem',
                          '&:disabled': {
                            opacity: 0.2,
                            cursor: 'not-allowed',
                            backgroundColor: '#1997c6',
                            color: '#fff',
                          },
                        }}
                      >
                        {t('save')}
                      </Button>
                    </Grid>
                  </Grid>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    mt={2}
                    width="100%"
                  >
                    <Grid
                      container
                      spacing={{ xs: 1, sm: 2 }}
                      sx={{
                        width: '100% !important',
                      }}
                    >
                      <Grid item xs={12}>
                        <Box sx={{ width: '100%' }}>
                          <MultiLineTabs onTabChange={handleTabChange}>
                            <LazyTab label={t('deedTabs.contact')} id="contact">
                              <ContactInfo
                                values={values}
                                handlePhoneChange={handlePhoneChange}
                                addNewPhone={addNewPhone}
                                addNewEmail={addNewEmail}
                                handleEmailChange={handleEmailChange}
                                email={email}
                                phone={phone}
                                errors={errors}
                                phone1Ref={phone1Ref}
                                phone2Ref={phone2Ref}
                                phone3Ref={phone3Ref}
                                contactDetails={deedDetailsData}
                                setFieldValue={setFieldValue}
                                handleAltNameChange={handleAltNameChange}
                                addNewAltName={addNewAltName}
                                altName={altName}
                                handleTitleChange={handleTitleChange}
                                title={title}
                                addNewTitle={addNewTitle}
                                openDeleteModal={openDeleteModal}
                              />
                              <Grid
                                container
                                spacing={{ xs: 2, sm: 2 }}
                                sx={{
                                  marginTop: '10px !important',
                                  justifyContent: 'center',
                                  width: '100% !important',
                                }}
                              >
                                <Grid
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '20px',
                                  }}
                                >
                                  <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    id="save-contact"
                                    variant="outlined"
                                    onClick={() => setActionType('saveContact')}
                                    sx={{
                                      my: '1rem',
                                      '&:disabled': {
                                        opacity: 0.2,
                                        cursor: 'not-allowed',
                                        backgroundColor: '#1997c6',
                                        color: '#fff',
                                      },
                                    }}
                                  >
                                    {t('saveContact')}
                                  </Button>
                                </Grid>
                              </Grid>
                            </LazyTab>
                            <LazyTab label={t('deedTabs.legals')} id="legals">
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <LegalTable
                                    fileId={deedDetailsData?.fileID}
                                    fileName={values?.fileName}
                                    contactId={deedDetailsData?.contactID}
                                    isFileView={true}
                                  />
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab
                              label={t('deedTabs.checklist')}
                              id="checklist"
                            >
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <CheckListTab />
                                  <Grid
                                    container
                                    spacing={{ xs: 2, sm: 2 }}
                                    sx={{
                                      marginTop: '10px !important',
                                      justifyContent: 'center',
                                      width: '100% !important',
                                    }}
                                  >
                                    <Grid
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '20px',
                                      }}
                                    >
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        id="save-checklist"
                                        variant="outlined"
                                        onClick={() =>
                                          setActionType('saveDeed')
                                        }
                                        sx={{
                                          my: '1rem',
                                          '&:disabled': {
                                            opacity: 0.2,
                                            cursor: 'not-allowed',
                                            backgroundColor: '#1997c6',
                                            color: '#fff',
                                          },
                                        }}
                                      >
                                        {t('saveChecklist')}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab label={t('deedTabs.payment')} id="payment">
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <PaymentTab
                                    deedId={Number(deedId)}
                                    contactId={Number(
                                      deedDetailsData?.contactID
                                    )}
                                    fileId={Number(deedDetailsData?.fileID)}
                                    grantors={concatContactName(
                                      deedDetailsData?.lastName,
                                      deedDetailsData?.firstName
                                    )}
                                    errors={errors}
                                  />
                                  <Grid
                                    container
                                    spacing={{ xs: 2, sm: 2 }}
                                    sx={{
                                      marginTop: '10px !important',
                                      justifyContent: 'center',
                                      width: '100% !important',
                                    }}
                                  >
                                    <Grid
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '20px',
                                      }}
                                    >
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        id="save-payment"
                                        variant="outlined"
                                        onClick={() =>
                                          setActionType('saveDeed')
                                        }
                                        sx={{
                                          my: '1rem',
                                          '&:disabled': {
                                            opacity: 0.2,
                                            cursor: 'not-allowed',
                                            backgroundColor: '#1997c6',
                                            color: '#fff',
                                          },
                                        }}
                                      >
                                        {t('savePayment')}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab
                              label={t('deedTabs.curative')}
                              id="curative"
                            >
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <CurativeTab
                                    errors={errors}
                                    isValidating={isValidating}
                                  />
                                  <Grid
                                    container
                                    spacing={{ xs: 2, sm: 2 }}
                                    sx={{
                                      marginTop: '10px !important',
                                      justifyContent: 'center',
                                      width: '100% !important',
                                    }}
                                  >
                                    <Grid
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '20px',
                                      }}
                                    >
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        id="save-curative"
                                        onClick={() =>
                                          setActionType('saveDeed')
                                        }
                                        variant="outlined"
                                        sx={{
                                          my: '1rem',
                                          '&:disabled': {
                                            opacity: 0.2,
                                            cursor: 'not-allowed',
                                            backgroundColor: '#1997c6',
                                            color: '#fff',
                                          },
                                        }}
                                      >
                                        {t('saveCurative')}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab
                              label={t('deedTabs.recording')}
                              id="recording"
                            >
                              <Box sx={{ width: '100%' }}>
                                <Grid
                                  item
                                  xs={12}
                                  md={4}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  mb={1}
                                >
                                  <Field
                                    name="recComplete"
                                    inputProps={{
                                      id: 'recComplete',
                                    }}
                                    type="checkbox"
                                    as={Checkbox}
                                    sx={{
                                      color: 'white',
                                      marginRight: '10px',
                                    }}
                                    size="small"
                                    color="info"
                                  />
                                  <StyledInputLabel>
                                    {t('allRecordingCompleted')}
                                  </StyledInputLabel>
                                </Grid>
                                <LazyRecordingTabContent
                                  deedId={Number(deedId)}
                                />
                                <Grid
                                  container
                                  spacing={{ xs: 2, sm: 2 }}
                                  sx={{
                                    marginTop: '10px !important',
                                    justifyContent: 'center',
                                    width: '100% !important',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '20px',
                                    }}
                                  >
                                    <Button
                                      disabled={isSubmitting}
                                      type="submit"
                                      id="save-recording"
                                      onClick={() => setActionType('saveDeed')}
                                      variant="outlined"
                                      sx={{
                                        my: '1rem',
                                        '&:disabled': {
                                          opacity: 0.2,
                                          cursor: 'not-allowed',
                                          backgroundColor: '#1997c6',
                                          color: '#fff',
                                        },
                                      }}
                                    >
                                      {t('save')}
                                    </Button>
                                  </Box>
                                </Grid>
                              </Box>
                            </LazyTab>
                            <LazyTab label={t('deedTabs.taxes')} id="taxes">
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <Grid
                                    container
                                    item
                                    xs={12}
                                    md={8}
                                    sx={{
                                      flexDirection: {
                                        xs: 'column',
                                        md: 'row',
                                      },
                                    }}
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      md={3}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StyledInputLabel>
                                        {t('taxesDue')}
                                      </StyledInputLabel>
                                      <Field
                                        name="taxesDue"
                                        inputProps={{
                                          id: 'taxesDue',
                                        }}
                                        type="checkbox"
                                        as={Checkbox}
                                        sx={{
                                          color: 'white',
                                        }}
                                        size="small"
                                        color="info"
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      md={3}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StyledInputLabel>
                                        {t('taxesNA')}
                                      </StyledInputLabel>
                                      <Field
                                        name="taxNA"
                                        inputProps={{
                                          id: 'taxNA',
                                        }}
                                        type="checkbox"
                                        as={Checkbox}
                                        sx={{
                                          color: 'white',
                                        }}
                                        size="small"
                                        color="info"
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      md={4}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StyledInputLabel>
                                        {t('allTaxingEntitiesDoubleCheck')}
                                      </StyledInputLabel>
                                      <Field
                                        name="taxEntityCk"
                                        inputProps={{
                                          id: 'taxEntityCk',
                                        }}
                                        type="checkbox"
                                        as={Checkbox}
                                        sx={{
                                          color: 'white',
                                        }}
                                        size="small"
                                        color="info"
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      md={6}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StyledInputLabel>
                                        {t('taxPaidForOwnerShip')}
                                      </StyledInputLabel>
                                      <Field
                                        name="taxPartialOwn"
                                        inputProps={{
                                          id: 'taxPartialOwn',
                                        }}
                                        type="checkbox"
                                        as={Checkbox}
                                        sx={{
                                          color: 'white',
                                        }}
                                        size="small"
                                        color="info"
                                      />
                                    </Grid>
                                  </Grid>
                                  <LazyTaxTabContent deedId={Number(deedId)} />
                                  <Grid
                                    container
                                    spacing={{ xs: 2, sm: 2 }}
                                    sx={{
                                      marginTop: '10px !important',
                                      justifyContent: 'center',
                                      width: '100% !important',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '20px',
                                      }}
                                    >
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        id="save-tax"
                                        onClick={() =>
                                          setActionType('saveDeed')
                                        }
                                        variant="outlined"
                                        sx={{
                                          my: '1rem',
                                          '&:disabled': {
                                            opacity: 0.2,
                                            cursor: 'not-allowed',
                                            backgroundColor: '#1997c6',
                                            color: '#fff',
                                          },
                                        }}
                                      >
                                        {t('save')}
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab
                              label={t('deedTabs.division_orders')}
                              id="division"
                            >
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <Grid
                                    container
                                    item
                                    xs={12}
                                    sx={{
                                      flexDirection: {
                                        xs: 'column',
                                        md: 'row',
                                      },
                                      marginBottom: '1rem',
                                    }}
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      md={4}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StyledInputLabel id="drillingInfoLabel">
                                        {t('reversed')}
                                      </StyledInputLabel>
                                      <Field
                                        name="drillingInfo"
                                        inputProps={{
                                          id: 'drillingInfo',
                                        }}
                                        type="checkbox"
                                        as={Checkbox}
                                        sx={{
                                          color: 'white',
                                          marginRight: '10px',
                                        }}
                                        size="small"
                                        color="info"
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      md={8}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StyledInputLabel id="checkedLabel">
                                        {t('checked')}
                                      </StyledInputLabel>
                                      <Field
                                        name="checked"
                                        inputProps={{
                                          id: 'checked',
                                        }}
                                        type="checkbox"
                                        as={Checkbox}
                                        sx={{
                                          color: 'white',
                                          marginRight: '10px',
                                        }}
                                        size="small"
                                        color="info"
                                      />
                                    </Grid>
                                  </Grid>
                                  <LazyDivisionTabContent
                                    contactId={Number(
                                      deedDetailsData?.contactID
                                    )}
                                    fileId={Number(deedDetailsData?.fileID)}
                                    deedId={Number(deedId)}
                                    from="deedView"
                                  />
                                  <Grid
                                    container
                                    spacing={{ xs: 2, sm: 2 }}
                                    sx={{
                                      marginTop: '10px !important',
                                      justifyContent: 'center',
                                      width: '100% !important',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '20px',
                                      }}
                                    >
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        id="save-Division"
                                        onClick={() =>
                                          setActionType('saveDeed')
                                        }
                                        variant="outlined"
                                        sx={{
                                          my: '1rem',
                                          '&:disabled': {
                                            opacity: 0.2,
                                            cursor: 'not-allowed',
                                            backgroundColor: '#1997c6',
                                            color: '#fff',
                                          },
                                        }}
                                      >
                                        {t('saveDivision')}
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab
                              label={t('deedTabs.suspense')}
                              id="suspense"
                            >
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <LazySuspenseTabContent
                                    deedId={Number(deedId)}
                                  />
                                  <Grid
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '20px',
                                    }}
                                  >
                                    <Button
                                      disabled={isSubmitting}
                                      type="submit"
                                      id="save-suspense"
                                      variant="outlined"
                                      onClick={() => setActionType('saveDeed')}
                                      sx={{
                                        my: '1rem',
                                        '&:disabled': {
                                          opacity: 0.2,
                                          cursor: 'not-allowed',
                                          backgroundColor: '#1997c6',
                                          color: '#fff',
                                        },
                                      }}
                                    >
                                      {t('saveSuspense')}
                                    </Button>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab
                              label={t('deedTabs.well_section_files')}
                              id="wellSectionFiles"
                            >
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <LazyWellSectionFiles />
                                  <Grid
                                    container
                                    spacing={{ xs: 2, sm: 2 }}
                                    sx={{
                                      marginTop: '10px !important',
                                      justifyContent: 'center',
                                      width: '100% !important',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '20px',
                                      }}
                                    >
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        id="save-wellSectionFiles"
                                        onClick={() =>
                                          setActionType('saveDeed')
                                        }
                                        variant="outlined"
                                        sx={{
                                          my: '1rem',
                                          '&:disabled': {
                                            opacity: 0.2,
                                            cursor: 'not-allowed',
                                            backgroundColor: '#1997c6',
                                            color: '#fff',
                                          },
                                        }}
                                      >
                                        {t('save')}
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab label={t('deedTabs.docs')} id="docs">
                              <DocumentTab
                                fileId={Number(deedDetailsData?.fileID)}
                                deedId={Number(deedId)}
                                isFileView={false}
                              />
                            </LazyTab>
                            <LazyTab label={t('deedTabs.tasks')} id="tasks">
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <LazyTaskTabContent
                                    contactId={Number(
                                      deedDetailsData?.contactID
                                    )}
                                    fileId={Number(deedDetailsData?.fileID)}
                                    city={deedDetailsData?.city}
                                    from="deedView"
                                    deedId={Number(deedId)}
                                  />
                                </Box>
                              </>
                            </LazyTab>
                            <LazyTab label={t('deedTabs.notes')} id="notes">
                              <>
                                <Box sx={{ width: '100%' }}>
                                  <LazyNoteTabContent
                                    contactId={Number(
                                      deedDetailsData?.contactID
                                    )}
                                    deedId={Number(deedId)}
                                    orderBy="dateCompleted,dateCreated"
                                    order="desc"
                                  />
                                </Box>
                              </>
                            </LazyTab>
                          </MultiLineTabs>
                        </Box>
                      </Grid>
                    </Grid>
                    <CustomModel
                      open={deleteModalState.open}
                      handleClose={closeDeleteModal}
                      handleDelete={handleItemDelete}
                      modalHeader={deleteModalState.header}
                      modalTitle={deleteModalState.title}
                      modalButtonLabel="Delete"
                    />
                  </Stack>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default EditDeed;
