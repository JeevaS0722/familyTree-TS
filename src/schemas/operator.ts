import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const newOperatorSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  companyName: string;
  ownerNumber?: string | null;
  contactName?: string | null;
  phoneNumber?: number | null;
  fax?: number | null;
  email?: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  notes?: string | null;
}> => {
  return Yup.object().shape({
    companyName: Yup.string().trim().required(t('companyNameRequired')),
    contactName: Yup.string().nullable() as Yup.Schema<string | null>,
    ownerNumber: Yup.string()
      .nullable()
      .optional()
      .typeError(t('ownerNumberValidation')),
    state: Yup.string().nullable() as Yup.Schema<string | null>,
    city: Yup.string().nullable() as Yup.Schema<string | null>,
    address: Yup.string().nullable() as Yup.Schema<string | null>,
    zip: Yup.string()
      .matches(/^[0-9-]+$/, t('zipValidation'))
      .max(10, t('zipLength'))
      .nullable()
      .optional() as Yup.StringSchema<string | null>,
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
    notes: Yup.string().nullable() as Yup.Schema<string | null>,
  });
};
