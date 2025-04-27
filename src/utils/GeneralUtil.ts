import moment, { Moment, isMoment } from 'moment';
import { GetTableRowId } from '../interface/common';
import {
  dateTmeValidationFormatList,
  dateValidationFormatList,
} from './constants';
import { TitleData } from '../interface/contact';

/**
 * Formats a date string or object into a specific format.
 * @param {string|Date} date - The date to be formatted.
 * @returns {string} The formatted date string.
 */
export function formatDate(date: undefined | Moment | string): string | Moment {
  if (!date) {
    return '';
  }
  if (moment(date).isValid()) {
    return moment(date).format('DD/MM/YYYY');
  }
  return date;
}

export const getCurrentYear = (): string => {
  return moment().format('YYYY');
};

export const getCurrentDate = (format: string = 'YYYY-MM-DD'): string => {
  return moment().format(format);
};

export function formatDateByMonth(
  date: undefined | Moment | string
): string | Moment {
  if (!date) {
    return '';
  }
  if (
    typeof date === 'string' &&
    (date === '0000-00-00' || date === '0000/00/00')
  ) {
    return '';
  }

  if (moment(date).isValid()) {
    return moment(date).format('YYYY-MM-DD');
  }
  return date;
}

export function formatDatePickerValue(
  date: undefined | Moment | string
): string | Moment {
  if (!date) {
    return '';
  }
  if (moment(date).isValid()) {
    return moment(date).format('YYYY-MM-DD');
  }
  return date;
}

export function formatDateTime(
  date: undefined | Moment | string
): string | Moment {
  if (!date) {
    return '';
  }
  if (moment(date).isValid()) {
    return moment(date).local().format('MM/DD/YYYY hh:mm A');
  }
  return date;
}

export function phoneFormat(phoneNo: string): string {
  // Remove all hyphens from the input
  const cleaned = phoneNo.replace(/-/g, '');

  // Initialize an array to hold the formatted parts of the phone number
  const formatted = [];

  // Define the length of each part of the phone number
  const partLengths = [3, 3, 4];

  let startIndex = 0;

  // Iterate through the part lengths to format the phone number
  for (const length of partLengths) {
    const part = cleaned.substring(startIndex, startIndex + length);
    if (part) {
      formatted.push(part);
    }
    startIndex += length;
  }

  // Join the formatted parts with hyphens and return the result
  return formatted.join('-');
}

export const isSearchForNaN = (searchForQuery: string): boolean => {
  const modifiedSearchForQuery = searchForQuery?.replace(/-/g, '');
  return Number.isNaN(Number(modifiedSearchForQuery));
};

export function formatDateToMonthDayYear(
  date: undefined | Moment | string | null
): string {
  if (!date || date === '00/00/0000' || date === '0000-00-00') {
    return '';
  }
  if (moment(date).isValid()) {
    return moment(date).format('MM/DD/YYYY');
  }
  if (isMoment(date)) {
    return moment(date).toString();
  }
  return date;
}

export const isMomentValidDate = (
  dateString: string | Date | null | undefined
): boolean => {
  const date = dateString ? moment(dateString) : null;
  if (
    date &&
    !moment(date, dateTmeValidationFormatList, true).isValid() &&
    !moment(date, dateValidationFormatList, true).isValid()
  ) {
    return false;
  }

  if (date && date.isValid()) {
    const year = date.year();
    if (year < 1) {
      return false;
    }
  }

  return true;
};

export const isValidDate = (
  date: string | Date | null | undefined
): boolean => {
  if (date) {
    // Parse the date using the formats
    const momentDate = moment(
      date,
      [...dateValidationFormatList, moment.ISO_8601],
      true
    ); // 'true' enables strict parsing
    if (!momentDate.isValid()) {
      return false;
    }
    const year = momentDate.year();
    const currentYear = moment().year();
    const startYear = currentYear - 100;
    const endYear = currentYear + 100;
    return momentDate.isValid() && year >= startYear && year <= endYear;
  }
  return true;
};

export const removeEmptyFields = <T extends object>(payload: T): object => {
  const newObj = { ...payload };
  Object.keys(newObj).forEach(key => {
    const value = payload[key as keyof T];
    if (value === '' || value === null || value === undefined) {
      delete newObj[key as keyof T];
    }
  });
  return newObj;
};

export const getCurrentDateAndTime = (): string => {
  return moment().format('YYYY-MM-DD hh:mm A');
};

export const getTableRowId = (row: GetTableRowId, tableId: string): string => {
  if (tableId === 'searchResultTable') {
    return row?.deedID
      ? `${row?.contactID}-${row?.deedID}`
      : `${row?.contactID}`;
  }
  if (tableId === 'wellTable') {
    return `${row?.wellID}`;
  }
  return '';
};

export function isValidYear(year: string | Moment | null | undefined): boolean {
  if (!year) {
    return false;
  }
  const yearString = typeof year === 'string' ? year : year.format('YYYY');
  return moment(yearString, 'YYYY', true).isValid() && yearString !== '0000';
}

export function nl2br(str: string, is_xhtml?: string): string {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  const breakTag =
    is_xhtml || typeof is_xhtml === 'undefined' ? '</br>' : '<br>';
  return (str + '').replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    '$1' + breakTag + '$2'
  );
}

export const departments = [
  'Buyer',
  'BuyerAsst',
  'BuyerResearch',
  'Accounting',
  'Revenue',
  'Division Orders',
];

const filetype = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
];

export const removeFileType = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return fileName;
  }

  const extension = fileName.slice(lastDotIndex);

  if (filetype.includes(extension)) {
    return fileName.slice(0, lastDotIndex);
  }

  return fileName;
};

export const convertToMMDDYYYY = (input?: string | Date | null): string => {
  if (!input || typeof input !== 'string' || input === '0000-00-00') {
    return '';
  }

  // Split input and extract year, month, and day
  const parts = input.split('-');
  if (parts.length !== 3) {
    return '';
  }

  let [year, month, day] = parts;

  // Ensure two-digit padding for month and day
  month = month.padStart(2, '0');
  day = day.padStart(2, '0');
  year = year.padStart(4, '0');

  // Return formatted date
  return `${month}/${day}/${year}`;
};

export const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return '';
  }

  return fileName.slice(lastDotIndex + 1);
};

/**
 * Safely joins non-empty strings with a space.
 * Example: safeJoin("Bella", "", "Stoffel") => "Bella Stoffel"
 */
export function safeJoin(...parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function formatAltName(
  altNameFormat?: string,
  altName?: string
): string {
  // Filter out empties or nulls
  const parts = [altNameFormat, altName].filter(Boolean);
  return parts.join(' ');
}

export function formatTitle(title: TitleData): string | null {
  // If 'title.title' or 'title.preposition' or 'title.entityName' is missing, skip
  if (!title.title || !title.preposition || !title.entityName) {
    return null;
  }

  // If "individuallyAndAs" is true, prepend the string "individually and as"
  return title.individuallyAndAs
    ? `individually and as ${title.title} ${title.preposition} ${title.entityName}`
    : `${title.title} ${title.preposition} ${title.entityName}`;
}

export const handleEmptyDateValue = (
  value: string | undefined | null
): string => {
  if (!value || value === '0000/00/00' || value === '0000-00-00') {
    return '';
  }
  return formatDateToMonthDayYear(value).toString();
};

export const convertLargeNumberToCurrency = (
  value: string,
  options: { [key: string]: number } = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
): string => {
  let [integerPart, decimalPart = ''] = value.split('.');

  // Format integer part for US numbering system
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Handle fraction digits
  if (options.minimumFractionDigits > 0 || options.maximumFractionDigits > 0) {
    const decimalPlaces = Math.max(
      options.minimumFractionDigits,
      options.maximumFractionDigits
    );
    decimalPart = decimalPart
      .padEnd(decimalPlaces, '0') // Add trailing zeros if needed
      .slice(0, decimalPlaces); // Truncate to the required decimal places
    return `$${integerPart}.${decimalPart}`;
  } else {
    return `$${integerPart}`;
  }
};

export const roundBigDecimalString = (value: string): string => {
  const [integerPart, decimalPart = ''] = value.split('.');
  const firstDecimalDigit = parseInt(decimalPart.charAt(0) || '0', 10);

  if (firstDecimalDigit >= 5) {
    return BigInt(integerPart) + BigInt(1) + '';
  }

  return integerPart;
};
