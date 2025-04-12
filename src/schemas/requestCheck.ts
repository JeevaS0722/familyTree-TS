import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const requestCheckSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  payee: string;
  memo: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}> => {
  return Yup.object().shape({
    payee: Yup.string() as Yup.Schema<string>,
    memo: Yup.string() as Yup.Schema<string>,
    address: Yup.string() as Yup.Schema<string>,
    city: Yup.string() as Yup.Schema<string>,
    state: Yup.string() as Yup.Schema<string>,
    zip: Yup.string()
      .matches(/^[0-9-]+$/, t('zipValidation'))
      .max(10, t('zipLength'))
      .nullable()
      .optional() as Yup.StringSchema<string>,
  });
};
