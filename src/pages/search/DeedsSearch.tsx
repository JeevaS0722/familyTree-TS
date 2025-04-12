/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import {
  nl2br,
  formatDateToMonthDayYear,
  isValidYear,
} from '../../utils/GeneralUtil';
import Tooltip from '@mui/material/Tooltip';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';
import { QueryParams, TableColumns } from '../../interface/common';
import { severity } from '../../interface/snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import {
  searchDeedDateFields,
  searchDeedTextFields,
  searchDeedType,
} from '../../utils/constants';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import { searchDeedsSchema } from '../../schemas/searchDeed';
import { DeedsParams, SearchDeedFormValues } from '../../interface/searchDeed';
import { useLazyGetDeedsQuery } from '../../store/Services/searchService';
import { useLazyGetDeedCountBuyerQuery } from '../../store/Services/deedService';
import { setSearchFilter } from '../../store/Reducers/searchReducer';

import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  ErrorTextValidation,
  StyledGrid,
} from '../../component/common/CommonStyle';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import NewTable from '../../component/Table';
const DeedSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [showDeedCountTable, setShowDeedCountTable] = React.useState(false);
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter['searchDeedsTable'] as DeedsParams;

  const initialValues: DeedsParams = {
    searchType: filter?.searchType || '',
    searchText: filter?.searchText || '',
    from: filter?.from || '',
    to: filter?.to || '',
  };

  const initialFormValues: SearchDeedFormValues = {
    searchType: filter?.searchType || '',
    searchText: filter?.searchText || '',
    from: filter?.from || '',
    to: filter?.to || '',
  };
  const { t } = useTranslation('searchDeed');

  const [formValues, setFormValues] = useState<DeedsParams>(
    initialFormValues as DeedsParams
  );

  const localizeColumns = (t: TFunction): TableColumns[] => {
    let columns: TableColumns[];

    const handleContactName = (
      contactName: string | undefined | null,
      to: string
    ) => {
      const grantorName = contactName?.toString();
      const showTooltip = grantorName && grantorName.length > 20;

      const linkContent = (
        <Link to={to} className="hover-link">
          {grantorName}
        </Link>
      );

      return showTooltip ? (
        <Tooltip title={grantorName} arrow>
          {linkContent}
        </Tooltip>
      ) : (
        linkContent
      );
    };
    let type = formValues.searchType;
    if (
      formValues.searchType === 'operator' ||
      formValues.searchType === 'notification'
    ) {
      type = 'operatorOrnotification';
    }

    switch (type) {
      case 'county':
        columns = [
          {
            headerName: t('fileName'),
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: t('contactName'),
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editdeed/${params.data.deedID}`
              );
            },
            width: 400,
          },
          {
            headerName: t('main'),
            field: 'main',
            cellRenderer: params => (
              <span style={{ color: '#000000' }}>
                {params.data?.main === 1 ? 'Yes' : ''}
              </span>
            ),
            sortable: false,
          },
          {
            headerName: t('county'),
            field: 'county',
            sortable: true,
          },
          {
            headerName: `${t('dateDeedReturned')} (Go To Deed Screen)`,
            field: 'returnDate',
            sortable: true,
            width: 400,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.returnDate?.toString()}
              </Link>
            ),
          },
        ];

        return columns;
      case 'wellname':
        columns = [
          {
            headerName: t('operator'),
            field: 'companyName',
            sortable: true,
          },
          {
            headerName: t('wellName'),
            field: 'well',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/division/edit/${params.data.divOrderID}`}
                className="hover-link"
              >
                {params.data.well?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('legalDesc'),
            field: 'sectionAB',
            sortable: true,
          },
          {
            headerName: t('divInterest'),
            field: 'divInterest',
            sortable: true,
          },
          {
            headerName: `${t('dateDeedReturned')} (Go To Deed Screen)`,
            field: 'returnDate',
            sortable: true,
            width: 400,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.returnDate?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('fileName'),
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: t('contactName'),
            field: 'grantor',
            sortable: true,
            width: 400,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editdeed/${params.data.deedID}`
              );
            },
          },
          {
            headerName: t('main'),
            field: 'main',
            cellRenderer: params => (
              <span style={{ color: '#000000' }}>
                {params.data?.main === 1 ? 'Yes' : ''}
              </span>
            ),
            sortable: false,
          },
          {
            headerName: t('county'),
            field: 'county',
            sortable: true,
          },
        ];

        return columns;
      case 'deedreturn':
        columns = [
          {
            headerName: t('fileName'),
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: t('contactName'),
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: t('main'),
            field: 'main',
            cellRenderer: params => (
              <span style={{ color: '#000000' }}>
                {params.data?.main === 1 ? 'Yes' : ''}
              </span>
            ),
            sortable: false,
          },
          {
            headerName: `${t('dateDeedReturned')} (Go To Deed Screen)`,
            field: 'returnDate',
            sortable: true,
            width: 400,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.returnDate?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('buyer'),
            field: 'fullName',
            sortable: true,
          },
          {
            headerName: t('county'),
            field: 'county',
            sortable: true,
          },
          {
            headerName: t('Purchase Amount'),
            field: 'draftAmount2',
            sortable: true,
            cellRenderer: params => {
              return `${Number(params.data.draftAmount2 ?? 0).toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }
              )}`;
            },
          },
          {
            headerName: t('Final Payment Date'),
            field: 'paidDt2',
            sortable: true,
          },
          {
            headerName: t('Suspense Amount'),
            field: 'mMSuspAmt',
            sortable: true,
          },
        ];
        return columns;
      case 'operatorOrnotification':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: `${t('operator')} (Go To Deed Screen)`,
            field: 'companyName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.companyName?.toString()}
              </Link>
            ),
          },
          {
            headerName: `${t('1NoteDate')} (Go To Division Order)`,
            field: 'notice1dt',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/division/edit/${params.data.orderID}`}
                className="hover-link"
              >
                {params.data.notice1dt?.toString()}
              </Link>
            ),
          },
          {
            headerName: `${t('2NoteDate')}`,
            field: 'notice2dt',
            sortable: true,
          },
          {
            headerName: `${t('3NoteDate')}`,
            field: 'notice3dt',
            sortable: true,
          },
        ];
        return columns;
      case 'sectionfile':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: t('main'),
            field: 'main',
            cellRenderer: params => (
              <span style={{ color: '#000000' }}>
                {params.data?.main === 1 ? 'Yes' : ''}
              </span>
            ),
            sortable: false,
          },
          {
            headerName: `${t('deedReturned')} (Go To Deed Screen)`,
            field: 'returnDate',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.returnDate?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('county'),
            field: 'county',
            sortable: true,
          },
          {
            headerName: t('state'),
            field: 'state',
            sortable: true,
          },
          {
            headerName: t('listSectionFiles'),
            field: 'listSectFiles',
            sortable: true,
          },
        ];
        return columns;
      case 'titlefail':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: t('main'),
            field: 'main',
            cellRenderer: params => (
              <span style={{ color: '#000000' }}>
                {params.data?.main === 1 ? 'Yes' : ''}
              </span>
            ),
            sortable: false,
          },
          {
            headerName: `${t('deedReturned')} (Go To Deed Screen)`,
            field: 'returnDate',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.returnDate?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('county'),
            field: 'county',
            sortable: true,
          },
          {
            headerName: t('state'),
            field: 'state',
            sortable: true,
          },
          {
            headerName: t('purchaseAmount'),
            field: 'draftAmount2',
            sortable: true,
            cellRenderer: params => {
              return `${Number(params.data.draftAmount2 ?? 0).toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }
              )}`;
            },
          },
          {
            headerName: t('datePaid'),
            field: 'datePaid2',
            sortable: true,
          },
          {
            headerName: t('titleFailureReason'),
            field: 'titleFailedReason',
            sortable: true,
          },
        ];
        return columns;
      case 'paidclaims':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: `${t('suspenseSate')} (Go To Deed Screen)`,
            field: 'stateCo',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.stateCo?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('claimDate'),
            field: 'claimDate',
            sortable: true,
          },
          {
            headerName: t('RcvdFunds'),
            field: 'rcvdFunds',
            sortable: true,
            cellRenderer: params => {
              return params.data.rcvdFunds ? 'Yes' : 'No';
            },
          },
          {
            headerName: t('suspenseAmount'),
            field: 'amount',
            cellRenderer: params => {
              const amountDue =
                typeof params.data.amount === 'string'
                  ? parseFloat(params.data.amount)
                  : 0;
              if (Number.isNaN(amountDue)) {
                return '$0';
              }
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(amountDue);
            },
            sortable: true,
          },
        ];
        return columns;
      case 'pendclaims':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: `${t('suspenseSate')} (Go To Deed Screen)`,
            field: 'stateCo',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.stateCo?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('claimDate'),
            field: 'claimDate',
            sortable: true,
          },
          {
            headerName: t('suspenseAmount'),
            field: 'amount',
            cellRenderer: params => {
              const amountDue =
                typeof params.data.amount === 'string'
                  ? parseFloat(params.data.amount)
                  : 0;
              if (Number.isNaN(amountDue)) {
                return '$0';
              }
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(amountDue);
            },
            sortable: true,
          },
        ];
        return columns;
      case 'paidsusp':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: `${t('suspenseSate')} (Go To Deed Screen)`,
            field: 'stateCo',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.stateCo?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('claimDate'),
            field: 'claimDate',
            sortable: true,
          },
          {
            headerName: t('RcvdFunds'),
            field: 'rcvdFunds',
            sortable: true,

            cellRenderer: params => {
              return params.data.rcvdFunds ? 'Yes' : 'No';
            },
          },
          {
            headerName: t('suspenseAmount'),
            field: 'amount',
            sortable: true,
            cellRenderer: params => {
              const amountDue =
                typeof params.data.amount === 'string'
                  ? parseFloat(params.data.amount)
                  : 0;
              if (Number.isNaN(amountDue)) {
                return '$0';
              }
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(amountDue);
            },
          },
        ];
        return columns;
      case 'pendsusp':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Contact Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editcontact/${params.data.contactID}`
              );
            },
            width: 400,
          },
          {
            headerName: `${t('suspenseSate')} (Go To Deed Screen)`,
            field: 'stateCo',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.stateCo?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('claimDate'),
            field: 'claimDate',
            sortable: true,
          },
          {
            headerName: t('suspenseAmount'),
            field: 'amount',
            sortable: true,
            cellRenderer: params => {
              const amountDue =
                typeof params.data.amount === 'string'
                  ? parseFloat(params.data.amount)
                  : 0;
              if (Number.isNaN(amountDue)) {
                return '$0';
              }
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(amountDue);
            },
          },
        ];
        return columns;
      case 'taxpaid':
        columns = [
          {
            headerName: `${t('fileName')} (Go To File Screen)`,
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: `${t('grantor')}  (Go To Deed Screen)`,
            field: 'grantor',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.grantor?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: t('taxingEntity'),
            field: 'taxingEntity',
            cellRenderer: params => (
              <Link to={`/edittax/${params.data.taxID}`} className="hover-link">
                {params.data.taxingEntity?.toString()}
              </Link>
            ),
            sortable: true,
          },
          {
            headerName: `${t('taxingCounty')} (Go To Tax Screen)`,
            field: 'county',
            sortable: true,
            cellRenderer: params => (
              <Link to={`/edittax/${params.data.taxID}`} className="hover-link">
                {params.data.county?.toString()}
              </Link>
            ),
          },
          {
            headerName: t('taxDue'),
            field: 'amountDue',
            cellRenderer: params => {
              const amountDue =
                typeof params.data.amountDue === 'string'
                  ? parseFloat(params.data.amountDue)
                  : 0;
              if (Number.isNaN(amountDue)) {
                return '$0';
              }
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(amountDue);
            },
            sortable: true,
          },
          {
            headerName: t('yearsTaxed'),
            field: 'startYear',
            sortable: true,
            cellRenderer: params => {
              const { startYear, endYear } = params.data;

              if (
                isValidYear(startYear?.toString()) &&
                isValidYear(endYear?.toString())
              ) {
                return `${startYear}-${endYear}`;
              }
              return '';
            },
          },
          {
            headerName: t('dateTaxPaid'),
            field: 'dtPaid',
            sortable: true,
          },
          {
            headerName: t('taxReceiptReceived'),
            field: 'Rcvd',
            sortable: true,
            cellRenderer: params => {
              return params.data.Rcvd ? 'Yes' : 'No';
            },
          },
        ];
        return columns;
      default:
        columns = [
          {
            headerName: t('fileName'),
            field: 'fileName',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editfile/${params.data.fileID}`}
                className="hover-link"
              >
                {params.data.fileName?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: t('contactName'),
            field: 'grantor',
            sortable: true,
            cellRenderer: params => {
              return handleContactName(
                params.data.grantor?.toString(),
                `/editdeed/${params.data.deedID}`
              );
            },
            width: 400,
          },
          {
            headerName: t('main'),
            field: 'main',
            cellRenderer: params => (
              <span style={{ color: '#000000' }}>
                {params.data?.main === 1 ? 'Yes' : ''}
              </span>
            ),
            sortable: false,
          },
          {
            headerName: t('buyer'),
            field: 'fullName',
            sortable: true,
          },
          {
            headerName: t('county'),
            field: 'county',
            sortable: true,
          },
          {
            headerName: `${t('dateDeedReturned')} (Go To Deed Screen)`,
            field: 'returnDate',
            sortable: true,
            cellRenderer: params => (
              <Link
                to={`/editdeed/${params.data.deedID}`}
                className="hover-link"
              >
                {params.data.returnDate?.toString()}
              </Link>
            ),
            width: 400,
          },
          {
            headerName: t('draft2Amount'),
            field: 'draftAmount2',
            sortable: true,
            cellRenderer: params => {
              return `${Number(params.data.draftAmount2 ?? 0).toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }
              )}`;
            },
          },
          {
            headerName: t('draft2dueDate'),
            field: 'dueDt2',
            sortable: true,
          },
          {
            headerName: t('Notes'),
            field: 'memo',
            sortable: true,
            cellRenderer: params => {
              const memo =
                params.data.memo && typeof params.data.memo === 'string'
                  ? params.data.memo.toString()
                  : '';

              return (
                <span style={{ color: '#000000' }}>
                  {parse(
                    DOMPurify.sanitize(nl2br(memo), {
                      USE_PROFILES: { html: true },
                    })
                  )}
                </span>
              );
            },
          },
        ];

        return columns;
    }
  };

  const localizeColumnsDeedCountBuyer = (t: TFunction): TableColumns[] => {
    const columns: TableColumns[] = [
      {
        headerName: t('buyer'),
        field: 'fullName',
        sortable: true,
      },
      {
        headerName: t('deedCount'),
        field: 'deedCount',
        sortable: true,
      },
    ];
    return columns;
  };
  const [getDeeds, { data: deedsData, isFetching, isLoading }] =
    useLazyGetDeedsQuery();

  const [
    getDeedsCountWithBuyer,
    {
      data: deedsCountBuyerData,
      isFetching: isDeedsCountBuyerFetching,
      isLoading: isDeedsCountBuyerLoading,
    },
  ] = useLazyGetDeedCountBuyerQuery();

  useEffect(() => {
    if (filter) {
      try {
        setFormValues({
          searchType: filter?.searchType,
          searchText: filter?.searchText || '',
          from: filter?.from || '',
          to: filter?.to || '',
        });

        void getData({
          page: Number(filter?.pageNo),
          rowsPerPage: Number(filter?.rowsPerPage),
          sortBy: filter?.sortBy,
          sortOrder: filter?.sortOrder,
        });

        if (filter?.searchType === 'deedreturn') {
          void getDeedCountBuyerData({
            sortBy: 'deedCount',
            sortOrder: filter?.order,
          });
          setShowDeedCountTable(true);
        } else {
          setShowDeedCountTable(false);
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    }
  }, []);

  const onSubmit = async (values: DeedsParams) => {
    try {
      setShowErrorMessage(false);
      if (values.searchType !== undefined) {
        dispatch(
          setSearchFilter({
            tableId: 'searchDeedsTable',
            filters: {
              searchType: values.searchType,
              searchText:
                values.searchText &&
                searchDeedTextFields.includes(values.searchType)
                  ? values.searchText.toString()
                  : '',
              from:
                values.from && searchDeedDateFields.includes(values.searchType)
                  ? formatDateToMonthDayYear(values.from)
                  : '',
              to:
                values.to && searchDeedDateFields.includes(values.searchType)
                  ? formatDateToMonthDayYear(values.to)
                  : '',
              pageNo: 1,
              rowsPerPage: 100,
              sortBy:
                values.searchType === 'wellname'
                  ? 'companyName,well'
                  : 'fileName,grantor',
              sortOrder: 'asc,asc',
            },
          })
        );
      }
      setFormValues({
        searchType: values.searchType,
        searchText: searchDeedTextFields.includes(values?.searchType || '')
          ? values?.searchText
          : '',
        from: searchDeedDateFields.includes(values?.searchType || '')
          ? formatDateToMonthDayYear(values.from)
          : '',
        to: searchDeedDateFields.includes(values?.searchType || '')
          ? formatDateToMonthDayYear(values.to)
          : '',
        pageNo: 1,
        size: 5,
        orderBy:
          values.searchType === 'wellname'
            ? 'companyName,well'
            : 'fileName,grantor',
        order: 'asc,asc',
      });

      void getDeeds({
        searchType: values.searchType,
        searchText: values?.searchText,
        from: values?.from,
        to: values?.to,
        pageNo: 1,
        size: 100,
        orderBy:
          values.searchType === 'wellname'
            ? 'companyName,well'
            : 'fileName,grantor',
        order: 'asc,asc',
      });

      if (values.searchType === 'deedreturn') {
        void getDeedsCountWithBuyer({
          from: values?.from,
          to: values?.to,
          orderBy: 'deedCount',
          order: 'asc',
        });
        setShowDeedCountTable(true);
      } else {
        setShowDeedCountTable(false);
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'An Unexpected Error Occurred',
        })
      );
    }
  };
  const formattedData = deedsData?.deeds?.map(deed => {
    return {
      ...deed,
      claimDate: deed.claimDate
        ? formatDateToMonthDayYear(deed.claimDate).toString()
        : '',
      dtPaid: deed.dtPaid
        ? formatDateToMonthDayYear(deed.dtPaid).toString()
        : '',
      dueDt2: deed.dueDt2
        ? formatDateToMonthDayYear(deed.dueDt2).toString()
        : '',
      returnDate: deed.returnDate
        ? formatDateToMonthDayYear(deed.returnDate).toString()
        : '',
      paidDt2: deed.paidDt2
        ? formatDateToMonthDayYear(deed.paidDt2).toString()
        : '',
      notice1dt: deed.notice1dt
        ? formatDateToMonthDayYear(deed.notice1dt).toString()
        : '',
      notice2dt: deed.notice2dt
        ? formatDateToMonthDayYear(deed.notice2dt).toString()
        : '',
      notice3dt: deed.notice3dt
        ? formatDateToMonthDayYear(deed.notice3dt).toString()
        : '',
      datePaid2: deed.datePaid2
        ? formatDateToMonthDayYear(deed.datePaid2).toString()
        : '',
    };
  });

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getDeeds({
      searchType: formValues.searchType,
      searchText: formValues?.searchText,
      from: formValues?.from,
      to: formValues?.to,
      pageNo: page,
      size: rowsPerPage,
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  const getDeedCountBuyerData = ({ sortBy, sortOrder }: QueryParams) => {
    void getDeedsCountWithBuyer({
      from: formValues?.from,
      to: formValues?.to,
      orderBy: sortBy || 'deedCount',
      order: sortOrder,
    });
  };

  const columns = localizeColumns(t);

  const deedCountsBuyerColumns = localizeColumnsDeedCountBuyer(t);

  const tableHeaderText = (searchType: string | undefined): string => {
    let text: string = '';
    if (searchType) {
      text = 'Deed Master Search Results';
    }
    return text;
  };

  const tableResultText = (searchType: string | undefined): string => {
    let text: string;
    const count: number = deedsData?.count || 0;
    if (searchType === 'paidsusp' || searchType === 'paidclaims') {
      searchType = 'paidsuspOrpaidclaims';
    }
    switch (searchType) {
      case 'sectionfile':
        text = `${count} Total Deeds with Section Files Completed between ${formatDateToMonthDayYear(formValues.from)} and ${formatDateToMonthDayYear(formValues.to)}`;
        return text;
      case 'titlefail':
        text = `${count} Total Deeds where Title Failed between ${formatDateToMonthDayYear(formValues.from)} and ${formatDateToMonthDayYear(formValues.to)}`;
        return text;
      case 'paidclaims':
        text = `Paid Claims to the State:  ${count}`;
        return text;
      case 'paidsuspOrpaidclaims':
        text = `Paid Claims to the State:  ${count}`;
        return text;
      case 'pendclaims':
        return `Pending Claims to the State:  ${count}`;
      case 'pendsusp':
        text = `Pending Suspense/Unclaimed Funds: ${count}`;
        return text;
      case 'taxpaid':
        text = `100% Taxes Paid for Partial Ownership: ${count}`;
        return text;
      case 'drafts':
        text = `Unpaid Drafts Due: ${count}`;
        return text;
      case 'deedreturn':
        text = `Deeds Returned: ${count}`;
        return text;
      default:
        text = '';
        return text;
    }
  };
  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('title')}
      </Typography>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={searchDeedsSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Grid container alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={2} mt={2} xl={1}>
                <CustomInputLabel>{t('searchType')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={12}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="searchType"
                  fullWidth
                  inputProps={{ id: 'searchType' }}
                  component={CustomSelectField}
                  options={searchDeedType}
                  hasEmptyValue={true}
                  labelKey="operator"
                  valueKey="value"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    mt: 1,
                  }}
                >
                  <ErrorMessage
                    id="searchType-error"
                    name="searchType"
                    component={ErrorText}
                  />
                </Box>
              </StyledGrid>

              {values?.searchType &&
                searchDeedTextFields.includes(values.searchType) && (
                  <>
                    <Grid item xs={12} sm={2} mt={2} xl={1}>
                      <CustomInputLabel>{t('searchText')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid
                      item
                      xs={12}
                      sm={10}
                      xl={11}
                      sx={{ position: 'relative' }}
                    >
                      <Field
                        name="searchText"
                        inputProps={{
                          id: 'searchText',
                        }}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '100%',
                          mt: 1,
                        }}
                      >
                        <ErrorMessage
                          id="searchText-error"
                          name="searchText"
                          component={ErrorText}
                        />
                      </Box>
                    </StyledGrid>
                  </>
                )}
              {values?.searchType &&
                searchDeedDateFields.includes(values.searchType) && (
                  <>
                    <Grid item xs={12} sm={2} mt={2} xl={1}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('findDates')}:
                      </CustomInputLabel>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      sm={10}
                      xl={11}
                      marginTop="10px"
                      alignItems="center"
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <Grid item xs={12} sm={3} xl={2}>
                        <CustomDatePicker
                          name="from"
                          type="date"
                          id="from"
                          width="100%"
                          style={{
                            demo: {
                              sx: {
                                paddingTop: '0px',
                              },
                            },
                          }}
                        />
                        <Box sx={{ minHeight: '20px' }}>
                          <ErrorMessage
                            name="from"
                            id="error-from-date"
                            component={ErrorTextValidation}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3} xl={1}>
                        <Typography
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          {t('and')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} xl={2}>
                        <CustomDatePicker
                          name="to"
                          type="date"
                          id="to"
                          width="100%"
                          style={{
                            demo: {
                              sx: {
                                paddingTop: '0px',
                              },
                            },
                          }}
                        />
                        <Box sx={{ minHeight: '20px' }}>
                          <ErrorMessage
                            name="to"
                            id="error-to-date"
                            component={ErrorTextValidation}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  disabled={isSubmitting || isFetching}
                  type="submit"
                  id="find-button"
                  variant="outlined"
                  sx={{
                    my: '2rem',
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      color: '#fff',
                    },
                  }}
                >
                  {t('find')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      {deedsData?.deeds.length === 0 && !isFetching && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="error-search-deed"
        >
          <Typography component="h3" id="error-text">
            {t('noDeedMsg')}{' '}
            {
              searchDeedType.find(data => data.value === formValues.searchType)
                ?.operator
            }
            {'  '}
            {formValues.searchText}
            {formValues.from}{' '}
            {formValues.from && formValues.to ? 'between  ' : ''}
            {formValues.to}
          </Typography>
        </Box>
      )}

      {(isLoading || (deedsData && deedsData?.count > 0)) && (
        <>
          <Typography component="h1">
            {tableHeaderText(formValues?.searchType)}
          </Typography>
          {tableResultText(formValues?.searchType) !== '' && (
            <Typography component="h3">
              {tableResultText(formValues?.searchType)}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <NewTable
              tableId={`searchDeedsTable_${formValues.searchType}`}
              data={formattedData || []}
              count={deedsData?.count || 0}
              columns={columns}
              getData={getData}
              initialLoading={isLoading}
              loading={isFetching}
              initialSortBy={formValues.orderBy || 'fileName'}
              initialSortOrder={formValues.order || 'asc'}
            />
          </Box>
        </>
      )}

      {showDeedCountTable &&
        deedsCountBuyerData &&
        deedsCountBuyerData.deeds.length > 0 && (
          <>
            <Typography component="h3">
              Summary # of Deeds: {deedsData?.count}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <NewTable
                tableId="deedCountsBuyerTable"
                data={deedsCountBuyerData?.deeds || []}
                count={deedsCountBuyerData?.deeds.length || 0}
                columns={deedCountsBuyerColumns}
                getData={getDeedCountBuyerData}
                getDataWithoutPagination={() => {}}
                initialLoading={isDeedsCountBuyerLoading}
                loading={isDeedsCountBuyerFetching}
                initialSortBy={'deedCount'}
                initialSortOrder={'asc'}
              />
            </Box>
          </>
        )}
      {showErrorMessage && (
        <Typography id="address-not-found" component="h2">
          {t('noDeedMsg')} {formValues.searchType} {formValues.searchText}
          {formValues.from}, {formValues.to}
        </Typography>
      )}
    </Container>
  );
};

export default DeedSearch;
