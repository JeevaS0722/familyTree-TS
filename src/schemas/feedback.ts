import { TFunction } from 'i18next';
import * as Yup from 'yup';

export const feedbackSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  title: string;
  description: string;
}> => {
  return Yup.object().shape({
    title: Yup.string().trim().required(t('summeryRequired')),
    description: Yup.string().trim().required(t('descriptionRequired')),
  });
};
