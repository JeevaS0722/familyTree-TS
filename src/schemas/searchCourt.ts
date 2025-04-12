import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const searchCourtAddressSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{ state: string }> => {
  return Yup.object().shape({
    state: Yup.string().required(t('stateRequired')),
  });
};
