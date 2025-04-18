import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const newOperatorSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  companyName: string;
  contactName?: string;
  phoneNumber?: number | null;
  fax?: number | null;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string | null;
  notes?: string;
}> => {
  return Yup.object().shape({
    companyName: Yup.string().trim().required(t('companyNameRequired')),
    contactName: Yup.string() as Yup.Schema<string>,
    state: Yup.string() as Yup.Schema<string>,
    city: Yup.string() as Yup.Schema<string>,
    address: Yup.string() as Yup.Schema<string>,
    zip: Yup.string()
      .matches(/^[0-9-]+$/, t('zipValidation'))
      .max(10, t('zipLength'))
      .nullable()
      .optional() as Yup.StringSchema<string>,
    phoneNumber: Yup.number()
      .nullable()
      .typeError(t('phoneValidation'))
      .max(9999999999, t('phoneLength'))
      .optional(),
    fax: Yup.number()
      .nullable()
      .typeError(t('faxValidation'))
      .max(9999999999, t('faxLength'))
      .optional(),
    email: Yup.string()
      .trim()
      .nullable()
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        t('emailValidation')
      ) as Yup.StringSchema<string>,
    notes: Yup.string() as Yup.Schema<string>,
  });
};
