import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const newAddressSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  name: string;
  zip?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  form?: string;
  cost?: string;
  state: string;
}> => {
  return Yup.object().shape({
    name: Yup.string().trim().required(t('placeNameRequired')),
    state: Yup.string().required(t('stateRequired')),
    zip: Yup.string()
      .matches(/^[0-9-]+$/, t('zipNumericOnly'))
      .max(10, t('zipLength'))
      .nullable()
      .optional() as Yup.StringSchema<string>,
    phone: Yup.string()
      .matches(/^\d*$/, t('phoneNumericOnly'))
      .max(10, t('phoneLength'))
      .optional(),
    email: Yup.string()
      .trim()
      .nullable()
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        t('emailValidation')
      ) as Yup.StringSchema<string>,
    fax: Yup.string()
      .matches(/^\d*$/, t('faxNumericOnly'))
      .max(10, t('faxLength'))
      .optional(),
    website: Yup.string().test(
      'is-valid-url-or-custom',
      t('webSiteValidUrl'),
      value => {
        // Allow empty value
        if (!value) {
          return true;
        }
        // Allow "http://www."
        if (value === 'http://www.') {
          return true;
        }
        // Use Yup's url validation for other cases
        return Yup.string().url().isValidSync(value);
      }
    ),
    form: Yup.string()
      .test('is-valid-url-or-custom', t('formValidUrl'), value => {
        // Allow empty value
        if (!value) {
          return true;
        }
        // Use Yup's url validation for other cases
        return Yup.string().url().isValidSync(value);
      })
      .optional(),
    cost: Yup.string()
      .matches(/^[0-9]+$/, t('costValidation'))
      .optional() as Yup.StringSchema<string>,
  });
};
