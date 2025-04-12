import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const editDeedSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  dueDt1?: string;
  datePaid1?: string;
  dueDt2?: string;
  datePaid2?: string;
  onlineCtyRecDt?: string;
  onlineResearchDt?: string;
  returnDt?: string;
  returnDate?: string;
}> => {
  return Yup.object().shape({
    dueDt1: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    datePaid1: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    dueDt2: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    datePaid2: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    onlineCtyRecDt: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    onlineResearchDt: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    returnDt: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    returnDate: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
  });
};
