/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isValidDate } from '../utils/GeneralUtil';
import moment from 'moment';

export const dashBoardMyTaskSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  dueDate_from?: string | null | undefined;
  dueDate_to?: string | null | undefined;
  dueDate?: string | null | undefined;
  date_from?: string | null | undefined;
  date_to?: string | null | undefined;
  date?: string | null | undefined;
  returnDate_from?: string | null | undefined;
  returnDate_to?: string | null | undefined;
  returnDate?: string | null | undefined;
  totalFileValue_min?: string;
  totalFileValue_max?: string;
  totalFileValue?: string;
  amount?: string;
  amount_min?: string;
  amount_max?: string;
  amount_condition?: string | null | undefined;
  totalFileValue_condition?: string | null | undefined;
  dueDate_condition?: string | null | undefined;
  date_condition?: string | null | undefined;
  returnDate_condition?: string | null | undefined;
  returnedDate_condition?: string | null | undefined;
  returnedDate?: string | null | undefined;
  returnedDate_from?: string | null | undefined;
  returnedDate_to?: string | null | undefined;
  purchaseAmount_condition?: string | null | undefined;
  purchaseAmount?: string | null | undefined;
  purchaseAmount_min?: string | null | undefined;
  purchaseAmount_max?: string | null | undefined;
  finalPaymentDate_condition?: string | null | undefined;
  finalPaymentDate?: string | null | undefined;
  finalPaymentDate_from?: string | null | undefined;
  finalPaymentDate_to?: string | null | undefined;
  ownership_condition?: string | null | undefined;
  ownership?: string | null | undefined;
  ownership_max?: string | null | undefined;
  ownership_min?: string | null | undefined;
  zip?: string | null | undefined;
  orderDate_condition?: string | null | undefined;
  orderDate?: string | null | undefined;
  orderDate_from?: string | null | undefined;
  orderDate_to?: string | null | undefined;
  receivedDate_condition?: string | null | undefined;
  receivedDate?: string | null | undefined;
  receivedDate_from?: string | null | undefined;
  receivedDate_to?: string | null | undefined;
  requestedDate_condition?: string | null | undefined;
  requestedDate?: string | null | undefined;
  requestedDate_from?: string | null | undefined;
  requestedDate_to?: string | null | undefined;
  fileName?: string | null | undefined;
  grantors?: string | null | undefined;
  offerType?: string | null | undefined;
  letterType?: string | null | undefined;
  draft1_condition?: string | null | undefined;
  draft1?: string | null | undefined;
  draft1_min?: string | null | undefined;
  draft1_max?: string | null | undefined;
  draft2_condition?: string | null | undefined;
  draft2?: string | null | undefined;
  draft2_min?: string | null | undefined;
  draft2_max?: string | null | undefined;
  address?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  email?: string | null | undefined;
  requestedBy?: string | null | undefined;
  createDate_from?: string | null | undefined;
  createDate_to?: string | null | undefined;
  createDate?: string | null | undefined;
  createDate_condition?: string | null | undefined;
}> => {
  return Yup.object().shape({
    zip: Yup.string()
      .transform(value => (value === '' ? null : value))
      .matches(/^[0-9-]+$/, t('zipValidation'))
      .max(10, t('zipLength'))
      .nullable()
      .optional() as Yup.StringSchema<string>,
    dueDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('dueDate_from', t('dateField'), function (value) {
        const { dueDate_condition } = this.parent;
        if (dueDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('dueDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { dueDate_to } = this.parent;
          if (
            value &&
            dueDate_to &&
            isValidDate(value) &&
            isValidDate(dueDate_to)
          ) {
            return moment(value).isBefore(moment(dueDate_to));
          }
          return true;
        }
      ),
    dueDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('dueDate_to', t('dateField'), function (value) {
        const { dueDate_condition } = this.parent;
        if (dueDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('dueDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { dueDate_from } = this.parent;
          if (
            value &&
            dueDate_from &&
            isValidDate(value) &&
            isValidDate(dueDate_from)
          ) {
            return moment(value).isAfter(moment(dueDate_from));
          }
          return true;
        }
      ),
    dueDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),

    createDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('createDate_from', t('dateField'), function (value) {
        const { createDate_condition } = this.parent;
        if (createDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('createDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { createDate_to } = this.parent;
          if (
            value &&
            createDate_to &&
            isValidDate(value) &&
            isValidDate(createDate_to)
          ) {
            return moment(value).isBefore(moment(createDate_to));
          }
          return true;
        }
      ),
    createDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('dueDate_to', t('dateField'), function (value) {
        const { createDate_condition } = this.parent;
        if (createDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('createDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { createDate_from } = this.parent;
          if (
            value &&
            createDate_from &&
            isValidDate(value) &&
            isValidDate(createDate_from)
          ) {
            return moment(value).isAfter(moment(createDate_from));
          }
          return true;
        }
      ),
    createDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),

    totalFileValue_min: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { totalFileValue_condition } = this.parent;
          if (totalFileValue_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isLessThanMax',
        t('totalFileValueMinShouldBeLessThanMax'),
        function (value) {
          const { totalFileValue_max } = this.parent;
          if (
            value &&
            totalFileValue_max &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(totalFileValue_max))
          ) {
            return Number(value) < Number(totalFileValue_max);
          }
          return true;
        }
      )
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('totalFileValueInvalidNumber')
      ),
    totalFileValue_max: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { totalFileValue_condition } = this.parent;
          if (totalFileValue_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isGreaterThanMin',
        t('totalFileValueMaxShouldBeGreaterThanMin'),
        function (value) {
          const { totalFileValue_min } = this.parent;
          if (
            value &&
            totalFileValue_min &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(totalFileValue_min))
          ) {
            return Number(value) > Number(totalFileValue_min);
          }
          return true;
        }
      )
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('totalFileValueInvalidNumber')
      ),
    totalFileValue: Yup.string()
      .nullable()
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('totalFileValueInvalidNumber')
      ),
    amount_min: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { amount_condition } = this.parent;
          if (amount_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isLessThanMax',
        t('amountMinShouldBeLessThanMax'),
        function (value) {
          const { amount_max } = this.parent;
          if (
            value &&
            amount_max &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(amount_max))
          ) {
            return Number(value) < Number(amount_max);
          }
          return true;
        }
      )
      .matches(/^[0-9]{1,17}(\.[0-9]{1,2})?$/, t('amountInvalidNumber')),
    amount_max: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { amount_condition } = this.parent;
          if (amount_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isGreaterThanMin',
        t('amountMaxShouldBeGreaterThanMin'),
        function (value) {
          const { amount_min } = this.parent;
          if (
            value &&
            amount_min &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(amount_min))
          ) {
            return Number(value) > Number(amount_min);
          }
          return true;
        }
      )
      .matches(/^[0-9]{1,17}(\.[0-9]{1,2})?$/, t('amountInvalidNumber')),
    amount: Yup.string()
      .nullable()
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .matches(/^[0-9]{1,17}(\.[0-9]{1,2})?$/, t('amountInvalidNumber')),
    date_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('date_from', t('dateField'), function (value) {
        const { date_condition } = this.parent; // Accessing dueDate selection state
        if (date_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('dateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { date_to } = this.parent; // Accessing dueDate_to from the parent object
          if (value && date_to && isValidDate(value) && isValidDate(date_to)) {
            return moment(value).isBefore(moment(date_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    date_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('date_to', t('dateField'), function (value) {
        const { date_condition } = this.parent;
        if (date_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test('isAfter', t('dateToShouldBeStrictlyAfterFrom'), function (value) {
        const { date_from } = this.parent;
        if (
          value &&
          date_from &&
          isValidDate(value) &&
          isValidDate(date_from)
        ) {
          return moment(value).isAfter(moment(date_from));
        }
        return true;
      }),
    date: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    returnDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('returnDate_from', t('dateField'), function (value) {
        const { returnDate_condition } = this.parent; // Accessing dueDate selection state
        if (returnDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('returnDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { returnDate_to } = this.parent; // Accessing dueDate_to from the parent object
          if (
            value &&
            returnDate_to &&
            isValidDate(value) &&
            isValidDate(returnDate_to)
          ) {
            return moment(value).isBefore(moment(returnDate_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    returnDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('returnDate_to', t('dateField'), function (value) {
        const { returnDate_condition } = this.parent;
        if (returnDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('returnDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { returnDate_from } = this.parent;
          if (
            value &&
            returnDate_from &&
            isValidDate(value) &&
            isValidDate(returnDate_from)
          ) {
            return moment(value).isAfter(moment(returnDate_from));
          }
          return true;
        }
      ),
    returnDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    returnedDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('returnedDate_from', t('dateField'), function (value) {
        const { returnedDate_condition } = this.parent; // Accessing dueDate selection state
        if (returnedDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('returnedDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { returnedDate_to } = this.parent; // Accessing dueDate_to from the parent object
          if (
            value &&
            returnedDate_to &&
            isValidDate(value) &&
            isValidDate(returnedDate_to)
          ) {
            return moment(value).isBefore(moment(returnedDate_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    returnedDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('returnedDate_to', t('dateField'), function (value) {
        const { returnedDate_condition } = this.parent;
        if (returnedDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('returnedDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { returnedDate_from } = this.parent;
          if (
            value &&
            returnedDate_from &&
            isValidDate(value) &&
            isValidDate(returnedDate_from)
          ) {
            return moment(value).isAfter(moment(returnedDate_from));
          }
          return true;
        }
      ),
    returnedDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    purchaseAmount_min: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { purchaseAmount_condition } = this.parent;
          if (purchaseAmount_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isLessThanMax',
        t('purchaseAmountMinShouldBeLessThanMax'),
        function (value) {
          const { purchaseAmount_max } = this.parent;
          if (
            value &&
            purchaseAmount_max &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(purchaseAmount_max))
          ) {
            return Number(value) < Number(purchaseAmount_max);
          }
          return true;
        }
      )
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('purchaseAmountInvalidNumber')
      ),
    purchaseAmount_max: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { purchaseAmount_condition } = this.parent;
          if (purchaseAmount_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isGreaterThanMin',
        t('purchaseAmountMaxShouldBeGreaterThanMin'),
        function (value) {
          const { purchaseAmount_min } = this.parent;
          if (
            value &&
            purchaseAmount_min &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(purchaseAmount_min))
          ) {
            return Number(value) > Number(purchaseAmount_min);
          }
          return true;
        }
      )
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('purchaseAmountInvalidNumber')
      ),
    purchaseAmount: Yup.string()
      .nullable()
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('purchaseAmountInvalidNumber')
      ),
    finalPaymentDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('finalPaymentDate_from', t('dateField'), function (value) {
        const { finalPaymentDate_condition } = this.parent; // Accessing dueDate selection state
        if (finalPaymentDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('finalPaymentDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { finalPaymentDate_to } = this.parent; // Accessing dueDate_to from the parent object
          if (
            value &&
            finalPaymentDate_to &&
            isValidDate(value) &&
            isValidDate(finalPaymentDate_to)
          ) {
            return moment(value).isBefore(moment(finalPaymentDate_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    finalPaymentDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('finalPaymentDate_to', t('dateField'), function (value) {
        const { finalPaymentDate_condition } = this.parent;
        if (finalPaymentDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('finalPaymentDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { finalPaymentDate_from } = this.parent;
          if (
            value &&
            finalPaymentDate_from &&
            isValidDate(value) &&
            isValidDate(finalPaymentDate_from)
          ) {
            return moment(value).isAfter(moment(finalPaymentDate_from));
          }
          return true;
        }
      ),
    finalPaymentDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    ownership_min: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { ownership_condition } = this.parent;
          if (ownership_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isLessThanMax',
        t('totalPurchasedMinShouldBeLessThanMax'),
        function (value) {
          const { ownership_max } = this.parent;
          if (
            value &&
            ownership_max &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(ownership_max))
          ) {
            return Number(value) < Number(ownership_max);
          }
          return true;
        }
      )
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('totalPurchasedInvalidNumber')
      ),
    ownership_max: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { ownership_condition } = this.parent;
          if (ownership_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isGreaterThanMin',
        t('totalPurchasedMaxShouldBeGreaterThanMin'),
        function (value) {
          const { ownership_min } = this.parent;
          if (
            value &&
            ownership_min &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(ownership_min))
          ) {
            return Number(value) > Number(ownership_min);
          }
          return true;
        }
      )
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('totalPurchasedInvalidNumber')
      ),
    ownership: Yup.string()
      .nullable()
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .matches(
        /^[0-9]{1,17}(\.[0-9]{1,2})?$/,
        t('totalPurchasedInvalidNumber')
      ),
    receivedDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('receivedDate_from', t('dateField'), function (value) {
        const { receivedDate_condition } = this.parent; // Accessing dueDate selection state
        if (receivedDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('receivedDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { receivedDate_to } = this.parent; // Accessing dueDate_to from the parent object
          if (
            value &&
            receivedDate_to &&
            isValidDate(value) &&
            isValidDate(receivedDate_to)
          ) {
            return moment(value).isBefore(moment(receivedDate_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    receivedDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('receivedDate_to', t('dateField'), function (value) {
        const { receivedDate_condition } = this.parent;
        if (receivedDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('receivedDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { receivedDate_from } = this.parent;
          if (
            value &&
            receivedDate_from &&
            isValidDate(value) &&
            isValidDate(receivedDate_from)
          ) {
            return moment(value).isAfter(moment(receivedDate_from));
          }
          return true;
        }
      ),
    receivedDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    orderDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test(' orderDate_from', t('dateField'), function (value) {
        const { orderDate_condition } = this.parent; // Accessing dueDate selection state
        if (orderDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('orderDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { orderDate_to } = this.parent; // Accessing dueDate_to from the parent object
          if (
            value &&
            orderDate_to &&
            isValidDate(value) &&
            isValidDate(orderDate_to)
          ) {
            return moment(value).isBefore(moment(orderDate_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    orderDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('orderDate_to', t('dateField'), function (value) {
        const { orderDate_condition } = this.parent;
        if (orderDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('orderDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { orderDate_from } = this.parent;
          if (
            value &&
            orderDate_from &&
            isValidDate(value) &&
            isValidDate(orderDate_from)
          ) {
            return moment(value).isAfter(moment(orderDate_from));
          }
          return true;
        }
      ),
    orderDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    requestedDate_from: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test(' requestedDate_from', t('dateField'), function (value) {
        const { requestedDate_condition } = this.parent; // Accessing dueDate selection state
        if (requestedDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isBefore',
        t('requestedDateFromShouldBeStrictlyBeforeTo'),
        function (value) {
          const { requestedDate_to } = this.parent; // Accessing dueDate_to from the parent object
          if (
            value &&
            requestedDate_to &&
            isValidDate(value) &&
            isValidDate(requestedDate_to)
          ) {
            return moment(value).isBefore(moment(requestedDate_to)); // Strictly before, no same date allowed
          }
          return true; // If no values are provided, it's valid
        }
      ),
    requestedDate_to: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      })
      .test('requestedDate_to', t('dateField'), function (value) {
        const { requestedDate_condition } = this.parent;
        if (requestedDate_condition === 'between' && !value) {
          return false;
        }
        return true;
      })
      .test(
        'isAfter',
        t('requestedDateToShouldBeStrictlyAfterFrom'),
        function (value) {
          const { requestedDate_from } = this.parent;
          if (
            value &&
            requestedDate_from &&
            isValidDate(value) &&
            isValidDate(requestedDate_from)
          ) {
            return moment(value).isAfter(moment(requestedDate_from));
          }
          return true;
        }
      ),
    requestedDate: Yup.string()
      .nullable()
      .test('isValid', t('invalidDueDate'), value => {
        if (value && !isValidDate(value)) {
          return false;
        }
        return true;
      }),
    draft1_min: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { draft1_condition } = this.parent;
          if (draft1_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isLessThanMax',
        t('draft1MinShouldBeLessThanMax'),
        function (value) {
          const { draft1_max } = this.parent;
          if (
            value &&
            draft1_max &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(draft1_max))
          ) {
            return Number(value) < Number(draft1_max);
          }
          return true;
        }
      ),
    draft1_max: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { draft1_condition } = this.parent;
          if (draft1_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isGreaterThanMin',
        t('draft1MaxShouldBeGreaterThanMin'),
        function (value) {
          const { draft1_min } = this.parent;
          if (
            value &&
            draft1_min &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(draft1_min))
          ) {
            return Number(value) > Number(draft1_min);
          }
          return true;
        }
      ),
    draft1: Yup.string()
      .nullable()
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      }),
    draft2_min: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { draft2_condition } = this.parent;
          if (draft2_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isLessThanMax',
        t('draft2MinShouldBeLessThanMax'),
        function (value) {
          const { draft2_max } = this.parent;
          if (
            value &&
            draft2_max &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(draft2_max))
          ) {
            return Number(value) < Number(draft2_max);
          }
          return true;
        }
      ),
    draft2_max: Yup.string()
      .nullable()
      .test(
        'totalFileValue1',
        t('totalFileValue1Validation'),
        function (value) {
          const { draft2_condition } = this.parent;
          if (draft2_condition === 'between' && !value) {
            return false;
          }
          return true;
        }
      )
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      })
      .test(
        'isGreaterThanMin',
        t('draft2MaxShouldBeGreaterThanMin'),
        function (value) {
          const { draft2_min } = this.parent;
          if (
            value &&
            draft2_min &&
            !Number.isNaN(Number(value)) &&
            !Number.isNaN(Number(draft2_min))
          ) {
            return Number(value) > Number(draft2_min);
          }
          return true;
        }
      ),
    draft2: Yup.string()
      .nullable()
      .test('is-numeric', t('pleaseEnterNumericValue'), value => {
        if (value && Number.isNaN(Number(value))) {
          return false;
        }
        return true;
      }),
    amount_condition: Yup.string().nullable(),
    totalFileValue_condition: Yup.string().nullable(),
    dueDate_condition: Yup.string().nullable(),
    createDate_condition: Yup.string().nullable(),
    date_condition: Yup.string().nullable(),
    returnDate_condition: Yup.string().nullable(),
    returnedDate_condition: Yup.string().nullable(),
    purchaseAmount_condition: Yup.string().nullable(),
    finalPaymentDate_condition: Yup.string().nullable(),
    ownership_condition: Yup.string().nullable(),
    receivedDate_condition: Yup.string().nullable(),
    orderDate_condition: Yup.string().nullable(),
    requestedDate_condition: Yup.string().nullable(),
    draft1_condition: Yup.string().nullable(),
    draft2_condition: Yup.string().nullable(),
  });
};
