import * as Yup from 'yup';
import { TFunction } from 'i18next';
import { isMomentValidDate } from '../utils/GeneralUtil';
import { SearchDeedDateType } from '../interface/searchDeed';
import { searchDeedDateFields, searchDeedTextFields } from '../utils/constants';

export const searchDeedsSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  searchType: string;
  searchText: string | undefined;
  from?: string | null;
  to?: string | null;
}> => {
  return Yup.object().shape({
    searchType: Yup.string().required(t('searchTypeRequired')),
    searchText: Yup.string()
      .trim()
      .when('searchType', {
        is: (val: string) => searchDeedTextFields.includes(val),
        then: schema => schema.required(t('searchTextRequired')),
        otherwise: schema => schema.optional(),
      }),
    from: Yup.string()
      .nullable()
      .test('isValid', t('deedDateInvalid'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      })
      .test(
        'from',
        t('dateField'),
        function (this: { parent: SearchDeedDateType }, value) {
          const { to } = this.parent;
          if (to && !value) {
            return false;
          }
          return true;
        }
      )
      .when('searchType', {
        is: (val: string) => searchDeedDateFields.includes(val),
        then: schema => schema.required(t('deedDateInvalid')),
        otherwise: schema => schema.optional(),
      }),
    to: Yup.string()
      .nullable()
      .test('isValid', t('deedDateInvalid'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      })
      .test(
        'to',
        t('dateField'),
        function (this: { parent: SearchDeedDateType }, value) {
          const { from } = this.parent;
          if (from && !value) {
            return false;
          }
          return true;
        }
      )
      .when('searchType', {
        is: (val: string) => searchDeedDateFields.includes(val),
        then: schema => schema.required(t('deedDateInvalid')),
        otherwise: schema => schema.optional(),
      }),
  });
};
