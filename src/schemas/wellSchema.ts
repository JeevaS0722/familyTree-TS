import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const wellSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  well: string;
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
      .required(t('enterWellName')) as Yup.Schema<string>,
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
