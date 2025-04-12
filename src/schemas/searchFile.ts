import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const searchFileSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{ fileStatus: string }> => {
  return Yup.object().shape({
    fileStatus: Yup.string().required(t('fileStatusRequired')),
  });
};
