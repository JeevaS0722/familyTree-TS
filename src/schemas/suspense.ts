import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const suspenseSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  stateCo?: string;
  contactPhone?: string | null;
}> => {
  return Yup.object().shape({
    stateCo: Yup.string().trim().required(t('stateCoRequired')),
    contactPhone: Yup.string()
      .nullable()
      .optional()
      .matches(/^\d*$/, t('phoneNumericOnly')),
    suspStart: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    suspEnd: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    claimDate: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    amount: Yup.string().nullable().optional().max(50, t('amountMaxLength')),
  });
};
