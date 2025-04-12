import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const moeaSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{ name: string }> => {
  return Yup.object().shape({
    name: Yup.string().trim().required(t('nameRequired')),
  });
};
