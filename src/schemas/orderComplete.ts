import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const orderCompleteSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  addressId?: number;
  address?: object;
}> => {
  return Yup.object().shape({
    addressId: Yup.number().required(t('addressIdRequired')),
    address: Yup.object().when('addressId', {
      is: 0,
      then: schema =>
        schema.shape({
          name: Yup.string().required(t('nameRequired')),
          email: Yup.string()
            .trim()
            .nullable()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('validEmail')),
          website: Yup.string().test(
            'is-valid-url-or-custom',
            t('validUrl'),
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
          fax: Yup.string()
            .matches(/^\d*$/, t('faxNumericOnly'))
            .max(10, t('faxLength'))
            .optional(),
          phone: Yup.string()
            .matches(/^\d*$/, t('phoneNumericOnly'))
            .max(10, t('phoneLength'))
            .optional(),
        }),
      otherwise: schema => schema.optional(),
    }),
  });
};
