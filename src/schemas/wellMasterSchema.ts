import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const wellMasterSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  fileName: string | null;
  wellName: string | null;
  county: string | null;
  sectionAB: string | null;
  interest: number | null;
  townshipBlock: string | null;
  rangeSurvey: string | null;
  state: string | null;
  api: string | null;
  type: string | null;
  book: string | null;
  page: string | null;
  nma: number | null;
  quarters: string | null;
  acres: number | null;
}> => {
  return Yup.object().shape({
    fileName: Yup.string().nullable() as Yup.Schema<string | null>,
    wellName: Yup.string().trim().required(t('enterWellName')) as Yup.Schema<
      string | null
    >,
    sectionAB: Yup.string().nullable() as Yup.Schema<string | null>,
    api: Yup.string().nullable() as Yup.Schema<string | null>,
    interest: Yup.number()
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
    type: Yup.string().nullable() as Yup.Schema<string | null>,
    townshipBlock: Yup.string().nullable() as Yup.Schema<string | null>,
    rangeSurvey: Yup.string().nullable() as Yup.Schema<string | null>,
    county: Yup.string().nullable() as Yup.Schema<string | null>,
    state: Yup.string().nullable() as Yup.Schema<string | null>,
    page: Yup.string().nullable() as Yup.Schema<string | null>,
    book: Yup.string().nullable() as Yup.Schema<string | null>,
    nma: Yup.number()
      .typeError(t('nmaNumeric'))
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' || originalValue === null
          ? undefined
          : value;
      }) as Yup.Schema<number>,
    quarters: Yup.string().nullable() as Yup.Schema<string | null>,
    acres: Yup.number()
      .typeError(t('acresNumeric'))
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' || originalValue === null
          ? undefined
          : value;
      }) as Yup.Schema<number | null>,
  });
};
