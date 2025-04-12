import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const newOrderSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  requestedBy: string;
  orderState: string;
  orderCity: string;
  orderType: string;
  caseNo: string;
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
  });
};
