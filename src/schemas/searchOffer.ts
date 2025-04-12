import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';
import { DateType } from '../interface/searchOffer';

export const searchOfferSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  date1: string | null | undefined;
  date2: string | null | undefined;
  state: string;
  county: string;
  zip: string;
  city: string;
  visit: boolean;
}> => {
  return Yup.object().shape({
    visit: Yup.boolean().nullable() as Yup.Schema<boolean>,
    city: Yup.string().nullable() as Yup.Schema<string>,
    state: Yup.string().nullable() as Yup.Schema<string>,
    zip: Yup.string().nullable() as Yup.Schema<string>,
    county: Yup.string().nullable() as Yup.Schema<string>,
    date1: Yup.string()
      .nullable()
      .test('isValid', t('offerDateInvalid'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      })
      .test(
        'date1',
        t('dateField'),
        function (this: { parent: DateType }, value) {
          const { date2 } = this.parent;
          if (date2 && !value) {
            return false;
          }
          return true;
        }
      ),
    date2: Yup.string()
      .nullable()
      .test('isValid', t('offerDateInvalid'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      })
      .test(
        'date2',
        t('dateField'),
        function (this: { parent: DateType }, value) {
          const { date1 } = this.parent;
          if (date1 && !value) {
            return false;
          }
          return true;
        }
      ),
  });
};
