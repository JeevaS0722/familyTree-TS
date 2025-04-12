import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const ticklerSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  ticklerDate?: string;
}> => {
  return Yup.object().shape({
    ticklerDate: Yup.string()
      .required()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
  });
};
