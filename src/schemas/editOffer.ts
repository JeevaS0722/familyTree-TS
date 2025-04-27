import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const editOfferSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  offerDate: string | null;
  whose: number;
  offerType: number;
  letterType: number;
  grantors: string;
  draftLength1: number | null;
  draftLength2: number | null;
  comment3: string | null;
  offerZip: string | null;
}> => {
  return Yup.object().shape({
    // 1) offerDate: string or null, with custom date validation
    offerDate: Yup.string()
      .nullable() // Allows null
      .defined() // Ensures this key is always defined, even if it's null
      .test('isValid', t('offerDateInvalid'), value => {
        // If there's a value, verify it's a valid date
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),

    // 2) whose: required positive number
    whose: Yup.number()
      .typeError(t('offerByRequired'))
      .required(t('offerByRequired'))
      .positive(t('offerByRequired')),

    // 3) offerType: required number
    offerType: Yup.number().required(t('offerTypeRequired')),

    // 4) letterType: required number
    letterType: Yup.number().required(t('letterTypeRequired')),

    // 5) grantors: required non-empty string
    grantors: Yup.string()
      .trim()
      .required(t('grantorRequired'))
      .test('isNotEmpty', t('grantorRequired'), value =>
        Boolean(value?.trim())
      ),

    // 6) draftLength1: number or null (not required)
    draftLength1: Yup.number()
      .typeError(t('draftLength1Valid'))
      .nullable()
      .max(127, t('draftLength1'))
      .notRequired(),

    // 7) draftLength2: number or null (not required)
    draftLength2: Yup.number()
      .typeError(t('draftLength2Valid'))
      .nullable()
      .max(127, t('draftLength2'))
      .notRequired(),

    // 8) comment3: string or null (not required)
    comment3: Yup.string().nullable().notRequired(),

    // 9) offerZip: string or null, optional, must match /^\d|-/, max 10
    offerZip: Yup.string()
      .matches(/^[0-9-]+$/, t('zipValidation'))
      .max(10, t('zipLength'))
      .nullable()
      .optional(),
  });
};
