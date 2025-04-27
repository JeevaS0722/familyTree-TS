import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const editOrderSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  requestedBy: string;
  orderState: string;
  orderCity: string;
  orderType: string;
  caseNo: string;
  ordDt: string | null;
  ordRcdDt: string | null;
  ordNA: boolean;
}> => {
  return Yup.object().shape({
    requestedBy: Yup.string().required(
      t('requestedByIsRequired')
    ) as Yup.Schema<string>,
    orderType: Yup.string().required(
      t('orderTypeIsRequired')
    ) as Yup.Schema<string>,
    orderState: Yup.string() as Yup.Schema<string>,
    orderCity: Yup.string() as Yup.Schema<string>,
    caseNo: Yup.string() as Yup.Schema<string>,
    ordRcdDt: Yup.string()
      .nullable()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    ordDt: Yup.string()
      .nullable()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    ordNA: Yup.boolean() as Yup.Schema<boolean>,
  });
};
