import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const editFileSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  fileName: string;
  onlineCtyRecDt?: string;
  onlineResearchDt?: string;
  startDt?: string;
  returnDt?: string;
}> => {
  return Yup.object().shape({
    fileName: Yup.string().trim().required(t('fileNameRequired')),
    startDt: Yup.string()
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
    onlineCtyRecDt: Yup.string()
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
