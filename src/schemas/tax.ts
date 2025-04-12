import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const taxSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  state: string;
  county: string;
  datePaid?: string | null;
  taxStart?: string | null;
  taxEnd?: string | null;
}> => {
  return Yup.object().shape({
    state: Yup.string().required(t('stateIsRequired')) as Yup.Schema<string>,
    county: Yup.string().required(t('countyIsRequired')) as Yup.Schema<string>,
    datePaid: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    taxStart: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),

    taxEnd: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
  });
};
