import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const searchWellMastersSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{ searchBy: string; textSearch: string }> => {
  return Yup.object().shape({
    searchBy: Yup.string().required(t('errorSearchBy')),
    textSearch: Yup.string().trim().required(t('errorText')),
  });
};
