import React from 'react';
import {
  OnlyOfficeDocumentTypeInterface,
  SectionOption,
} from '../interface/common';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';

export const phoneDesc = [
  { value: 'Bad' },
  { value: 'Best' },
  { value: 'Cell' },
  { value: 'Home' },
  { value: 'Relative' },
  { value: 'Work' },
  { value: 'Other' },
];

export const deleteContactTitle =
  'Are you sure you want to delete this contact? This cannot be undone!';
export const buyerValidateTitle =
  "Buyer's name is blank! You must choose a buyer & save the file before an offer can be created!";
export const contactValidateTitle =
  'Please select the contacts you want to make an offer to';
export const allSelectedContactMustHaveRecentOfferTitle =
  'All contacts must have an offer. Please make sure that all selected contacts have an associated offer';
export const selectedContactMustHaveRecentOfferTitle =
  'No offers were retrieved. Please ensure that you have created offers for selected contacts';
export const deleteLegalTitle =
  'Are you sure you want to delete this Legal? This cannot be undone!';
export const deleteRecordingTitle =
  'Are you sure you want to delete this Recording? This cannot be undone!';
export const deedBuyerAlert =
  "Buyer's name is blank! You must choose a buyer and save the file before a deed can be created!";
export const deedContactAlert =
  'Contact information is missing! You must add a contact and save the file before a deed can be created!';
export const createDeedConfirmation =
  'Are you sure you want to create a new deed for';
export const deleteTaxTitle =
  'Are you sure you want to delete this Tax? This cannot be undone!';
export const taskTypeDead =
  '“You can not edit a dead file task”, please change in file status drop down. ';
export const phoneDeleteTitle =
  'Are you sure you want to delete this phone? This cannot be undone!';
export const emailDeleteTitle =
  'Are you sure you want to delete this email? This cannot be undone!';
export const DeleteCannotDone =
  'Delete cannot be done. Please save or discard your changes and try again';

export const townShipNS = [
  { key: '1', value: 'N' },
  { key: '2', value: 'S' },
];

export const rangeEW = [
  { key: '1', value: 'E' },
  { key: '2', value: 'W' },
];

export const callDir = [
  { key: '1', value: 'N' },
  { key: '2', value: 'S' },
  { key: '3', value: 'E' },
  { key: '4', value: 'W' },
  { key: '5', value: 'NE' },
  { key: '6', value: 'NW' },
  { key: '7', value: 'SE' },
  { key: '8', value: 'SW' },
];

export const callNo = [
  { key: '1', value: '1' },
  { key: '2', value: '2' },
  { key: '3', value: '3' },
  { key: '4', value: '4' },
];

export const status = [
  { key: '1', value: 'Unknown Address' },
  { key: '2', value: 'Address Known' },
  { key: '3', value: 'Sold' },
  { key: '4', value: 'Other - See Notes' },
];

export const sources = [
  { key: '1', value: 'Unknown Address' },
  { key: '2', value: 'Unknown MOEA' },
  { key: '3', value: 'Address Known' },
  { key: '4', value: 'Sold' },
  { key: '5', value: 'Other - See Notes' },
];

export const interTypes = [
  { key: '1', value: 'RI' },
  { key: '2', value: 'ORRI' },
  { key: '3', value: 'NPR' },
  { key: '4', value: 'WI' },
];

export const getKeyValueOfNumber = (value: number): SectionOption[] => {
  const keyValues = [];
  for (let i = 1; i <= value; i++) {
    keyValues.push({ key: `${i}`, value: `${i}` });
  }

  return keyValues;
};
export const makeNewTaskTypes = [
  { id: 'bad-phone', value: 'Bad Phone' },
  { id: 'call-back', value: 'Call Back' },
  { id: 'dead-file', value: 'Dead File' },
  { id: 'expecting-deed', value: 'Expecting Deed' },
  { id: 'left-message', value: 'Left Message' },
  { id: 'negotiating', value: 'Negotiating' },
  { id: 'no-answer', value: 'No Answer' },
  { id: 'notification-follow-up', value: 'Notification Follow-Up' },
  { id: 'not-interested', value: 'Not Interested' },
  { id: 'offer-follow-up', value: 'Offer Follow-Up' },
  { id: 'order-dc', value: 'Order DC' },
  { id: 'order-obit', value: 'Order Obit' },
  { id: 'order-probate', value: 'Order Probate' },
  { id: 'research-update', value: 'Research Update' },
  { id: 'resend-offer', value: 'Resend Offer' },
];

export const makeTaskTypes = [
  { id: 'bad-phone', value: 'Bad Phone' },
  { id: 'call-back', value: 'Call Back' },
  { id: 'dc-follow-up', value: 'DC Follow-Up' },
  { id: 'division-order-update', value: 'Division Order Update' },
  { id: 'dead-file', value: 'Dead File' },
  { id: 'expecting-deed', value: 'Expecting Deed' },
  { id: 'left-message', value: 'Left Message' },
  { id: 'negotiating', value: 'Negotiating' },
  { id: 'no-answer', value: 'No Answer' },
  { id: 'notification-follow-up', value: 'Notification Follow-Up' },
  { id: 'not-interested', value: 'Not Interested' },
  { id: 'obit-follow-up', value: 'Obit Follow-Up' },
  { id: 'offer-follow-up', value: 'Offer Follow-Up' },
  { id: 'offer-question', value: 'Offer Question' },
  { id: 'other', value: 'Other' },
  { id: 'probate-follow-up', value: 'Probate Follow-Up' },
  { id: 'research-update', value: 'Research Update' },
  { id: 'resend-offer', value: 'Resend Offer' },
  { id: 'offer-send', value: 'Offer Send' },
  { id: 'order-dc', value: 'Order DC' },
  { id: 'order-obit', value: 'Order Obit' },
  { id: 'order-probate', value: 'Order Probate' },
];

export const makeTaskPriority = [
  { id: 'low', value: 'Low' },
  { id: 'medium', value: 'Medium' },
  { id: 'high', value: 'High' },
  { id: 'urgent', value: 'Urgent' },
];

export const makeTaskResults = [
  { id: 'bad-phone', value: 'Bad Phone' },
  { id: 'call-back', value: 'Call Back' },
  { id: 'dc-follow-up', value: 'DC Follow-Up' },
  { id: 'dead-file', value: 'Dead File' },
  { id: 'expecting-deed', value: 'Expecting Deed' },
  { id: 'left-message', value: 'Left Message' },
  { id: 'negotiating', value: 'Negotiating' },
  { id: 'no-answer', value: 'No Answer' },
  { id: 'not-interested', value: 'Not Interested' },
  { id: 'obit-follow-up', value: 'Obit Follow-Up' },
  { id: 'offer-follow-up', value: 'Offer Follow-Up' },
  { id: 'other', value: 'Other' },
  { id: 'probate-follow-up', value: 'Probate Follow-Up' },
  { id: 'research-update', value: 'Research Update' },
  { id: 'resend-offer', value: 'Resend Offer' },
];

export const editTaskTypes = [
  { id: 'bad-phone', value: 'Bad Phone' },
  { id: 'call-back', value: 'Call Back' },
  { id: 'dc-follow-up', value: 'DC Follow-Up' },
  { id: 'division-order-update', value: 'Division Order Update' },
  { id: 'dead-file', value: 'Dead File' },
  { id: 'expecting-deed', value: 'Expecting Deed' },
  { id: 'left-message', value: 'Left Message' },
  { id: 'negotiating', value: 'Negotiating' },
  { id: 'no-answer', value: 'No Answer' },
  { id: 'notification-follow-up', value: 'Notification Follow-Up' },
  { id: 'not-interested', value: 'Not Interested' },
  { id: 'obit-follow-up', value: 'Obit Follow-Up' },
  { id: 'offer-follow-up', value: 'Offer Follow-Up' },
  { id: 'offer-question', value: 'Offer Question' },
  { id: 'other', value: 'Other' },
  { id: 'probate-follow-up', value: 'Probate Follow-Up' },
  { id: 'research-update', value: 'Research Update' },
  { id: 'resend-offer', value: 'Resend Offer' },
  { id: 'offer-send', value: 'Offer Send' },
];

export const taskVisibleFields = {
  county: ['Order Probate', 'Order DC', 'Order Obit'],
  dateDue: [
    'Bad Phone',
    'Dead File',
    'Not Interested',
    'Order DC',
    'Order Obit',
    'Order Probate',
    'Resend Offer',
  ],
  newTaskMemo: ['Not Interested'],
  newTaskField: [
    'Call Back',
    'DC Follow-Up',
    'Expecting Deed',
    'Left Message',
    'Negotiating',
    'No Answer',
    'Obit Follow-Up',
    'Offer Follow-Up',
    'Other',
    'Probate Follow-Up',
    'Research Update',
  ],
};

export const searchDeedType = [
  { value: 'drafts', operator: 'Drafts Due' },
  { value: 'county', operator: 'Legals County' },
  { value: 'operator', operator: 'Operator' },
  { value: 'wellname', operator: 'Well Name' },
  { value: 'deedreturn', operator: 'Deed Returned Date' },
  { value: 'notification', operator: 'Notification Date' },
  { value: 'sectionfile', operator: 'Section File Date' },
  { value: 'titlefail', operator: 'Title Failure Date' },
  { value: 'paidclaims', operator: 'Paid Claims to the State' },
  { value: 'pendclaims', operator: 'Pending Claims to the State' },
  { value: 'paidsusp', operator: 'Paid Suspense/Unclaimed Funds' },
  { value: 'pendsusp', operator: 'Pending Suspense/Unclaimed Funds' },
  { value: 'taxpaid', operator: 'Taxes Paid on Partial Ownership' },
];

export const searchDeedTextFields = ['county', 'wellname', 'operator'];

export const searchDeedDateFields = [
  'deedreturn',
  'notification',
  'sectionfile',
  'titlefail',
];
export const suspenseClaimType = [
  { value: 'Claim to the State' },
  { value: 'Suspense' },
  { value: 'Unclaimed Funds' },
];

export const reasonForDeadFilling = [
  { value: 'In Pay' },
  { value: 'Not Interested' },
  { value: 'Probate/AOH filed' },
  { value: 'Sold' },
  { value: 'Taxes Paid' },
  { value: 'Too Fragmented' },
  { value: 'Too Small' },
];

export const reasonForRecycling = [
  { value: 'Professional' },
  { value: 'Too Fragmented' },
  { value: 'Unresponsive' },
  { value: 'Will Not Sell' },
];

export const contactTaskType = [
  { value: 'Call' },
  { value: 'Expecting Deed' },
  { value: 'Left Message' },
  { value: 'Negotiating' },
  { value: 'No Answer' },
  { value: 'Not Interested' },
  { value: 'Offer Follow-Up' },
  { value: 'Offer Returned' },
  { value: 'Other' },
  { value: 'Research Update' },
];

export const deedTaskType = [
  { value: 'Call' },
  { value: 'Curative' },
  { value: 'Division Order Update' },
  { value: 'Left Message' },
  { value: 'Litigation' },
  { value: 'Other' },
  { value: 'Payment' },
  { value: 'Suspense' },
  { value: 'Title' },
  { value: 'Title Checklist' },
];

export const fileTaskType = [{ value: 'Other' }, { value: 'Research' }];

export const searchWellMastersType = [
  { value: 'county', operator: 'County' },
  { value: 'fileName', operator: 'FileName' },
  { value: 'operator', operator: 'Operator' },
  { value: 'wellName', operator: 'Well Name' },
];

export const OnlyOfficeDocumentType: OnlyOfficeDocumentTypeInterface = {
  pdf: 'pdf',
  doc: 'word',
  docx: 'word',
  xls: 'cell',
  xlsx: 'cell',
  ppt: 'slide',
  pptx: 'slide',
};

export const dateTmeValidationFormatList = [
  // Most common and ISO formats first
  'YYYY-MM-DDTHH:mm:ss.SSSZ', // ISO format with milliseconds and timezone
  'YYYY-MM-DDTHH:mm:ssZ', // ISO format with timezone
  'YYYY-MM-DDTHH:mm:ss', // ISO format without timezone
  'YYYY-MM-DD HH:mm:ss', // Common ISO format with space separator
  'YYYY/MM/DD HH:mm:ss', // Alternative ISO format with slashes
  'YYYY-MM-DD hh:mm A', // 12-hour format with AM/PM
  'MM/DD/YYYY HH:mm:ss', // Common US format with space separator
  'MM-DD-YYYY HH:mm:ss', // US format with dashes
  'MM/DD/YYYY hh:mm A', // 12-hour US format with AM/PM

  // European formats
  'DD-MM-YYYY HH:mm:ss', // European format with dashes
  'DD/MM/YYYY HH:mm:ss', // European format with slashes
  'DD-MM-YYYY hh:mm A', // 12-hour European format with AM/PM
  'DD/MM/YYYY hh:mm A', // 12-hour European format with AM/PM

  // Compact formats
  'YYYYMMDD HH:mm:ss', // Compact ISO format
  'DDMMYYYY HH:mm:ss', // Compact European format
  'MMDDYYYY HH:mm:ss', // Compact US format
];

export const dateValidationFormatList = [
  'YYYY-MM-DD', // Most common ISO format
  'MM/DD/YYYY', // Common in the US
  'DD-MM-YYYY', // Common in Europe
  'YYYY/MM/DD', // Alternative ISO format
  'DD/MM/YYYY', // Common in Europe
  'MM-DD-YYYY', // Common in the US
  'YYYYMMDD', // Compact ISO format
  'DDMMYYYY', // Compact European format
  'MMDDYYYY', // Compact US format
];

export const titleFailedReasons = [
  { reason: 'Previously Sold' },
  { reason: 'Wrong Family' },
  { reason: 'Other' },
];

type TaskType = {
  id: string;
  value: string;
};

export const taskTypes: TaskType[] = [
  ...makeNewTaskTypes,
  ...makeTaskTypes,
  ...editTaskTypes,
].reduce<TaskType[]>((acc, current) => {
  const x = acc.find(item => item.id === current.id);
  if (!x) {
    acc.push(current);
  }
  return acc;
}, []);

export const errorMessage = {
  serviceUnavailable:
    'There is an unexpected issue with our system, and some services may be unavailable.',
  fetchError: 'FETCH_ERROR',
  unsupportedAppVersion: 'Unsupported APP Version',
  rateLimitExceedError:
    'You have sent too many request, Please wait for a moment and try again',
  unsupportedAppVersionMsg: (
    <Grid container>
      <Grid item container justifyContent={'center'} xs={12}>
        A new version is available. Please reload the page to continue.
      </Grid>
      <Grid
        item
        container
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <Button
          type="submit"
          id="cancel"
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{
            whiteSpace: 'nowrap',
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              borderColor: '#1997c6',
              color: '#fff',
            },
          }}
        >
          <RefreshOutlined sx={{ marginRight: '5px', fontSize: '20px' }} />
          Reload
        </Button>
      </Grid>
    </Grid>
  ),
};

export const emailDesc = [{ value: 'Bad' }, { value: 'Best' }];
