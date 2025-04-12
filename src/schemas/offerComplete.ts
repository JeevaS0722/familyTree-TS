import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const offerCompleteSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  priority: string;
  dueDate?: string;
}> => {
  return Yup.object().shape({
    priority: Yup.string().required(t('priorityRequired')),
    dueDate: Yup.string()
      .required()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
  });
};
