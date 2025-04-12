import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const divisionValidationSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  operId: number | string;
  welldivint: number | string;
  notice1Date: string;
  notice2Date: string;
  notice3Date: string;
}> => {
  return Yup.object().shape({
    operId: Yup.number().required(t('operIdRequired')) as Yup.Schema<number>,
    welldivint: Yup.number()
      .typeError(t('welldivintNumeric'))
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' || originalValue === null
          ? undefined
          : value;
      })
      .max(0.9999999999, t('welldivintLessThanOne')) as Yup.Schema<number>,
    notice1Date: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    notice2Date: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }) as Yup.StringSchema<string>,
    notice3Date: Yup.string()
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

export const DivOrderwellSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  well: string | undefined;
  section: string | null;
  welldivint: number | null;
  township: string | null;
  rangeSurvey: string | null;
  wellCounty: string | null;
  wellState: string | null;
}> => {
  return Yup.object().shape({
    well: Yup.string()
      .trim()
      .when(
        [
          'section',
          'welldivint',
          'township',
          'rangeSurvey',
          'wellCounty',
          'wellState',
        ],
        {
          is: (
            section: string | null,
            welldivint: number | null,
            township: string | null,
            rangeSurvey: string | null,
            wellCounty: string | null,
            wellState: string | null
          ) => {
            return (
              (section && section.trim() !== '') ||
              (welldivint && welldivint !== null) ||
              (township && township.trim() !== '') ||
              (rangeSurvey && rangeSurvey.trim() !== '') ||
              (wellCounty && wellCounty.trim() !== '') ||
              (wellState && wellState.trim() !== '')
            );
          },
          then: schema => schema.required(t('wellnamerequired')),
          otherwise: schema => schema.optional(),
        }
      ),
    section: Yup.string().nullable() as Yup.Schema<string | null>,
    welldivint: Yup.number()
      .nullable()
      .typeError(t('welldivintNumeric'))
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' || originalValue === null
          ? undefined
          : value;
      })
      .max(0.9999999999, t('welldivintLessThanOne')) as Yup.Schema<
      number | null
    >,
    township: Yup.string().nullable() as Yup.Schema<string | null>,
    rangeSurvey: Yup.string().nullable() as Yup.Schema<string | null>,
    wellCounty: Yup.string().nullable() as Yup.Schema<string | null>,
    wellState: Yup.string().nullable() as Yup.Schema<string | null>,
  });
};
