import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const recordingSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  county: string;
  state: string;
  book: string;
  page: string;
  dateSent?: string | null;
  dateReturn?: string | null;
}> => {
  return Yup.object().shape({
    county: Yup.string().required(t('countyIsRequired')) as Yup.Schema<string>,
    state: Yup.string() as Yup.Schema<string>,
    book: Yup.string() as Yup.Schema<string>,
    page: Yup.string() as Yup.Schema<string>,
    dateSent: Yup.string()
      .nullable() // Explicitly allow null values
      .test('isValid', t('invalidDate'), value => {
        if (value === null) {
          return true;
        }
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    dateReturn: Yup.string()
      .nullable()
      .test('isValid', t('invalidDate'), value => {
        if (value === null) {
          return true;
        }
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
  });
};
