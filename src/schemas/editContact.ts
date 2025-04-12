import * as Yup from 'yup';
import { TFunction } from 'i18next';
import {
  AltNameSchemaData,
  EmailSchemaData,
  NameSchemasData,
  PhoneSchemasData,
  TitleData,
} from '../interface/contact';
import { isMomentValidDate } from '../utils/GeneralUtil';

export const editContactSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  firstName?: string;
  email?: EmailSchemaData[] | undefined;
  ownership?: number;
  phone?: PhoneSchemasData[] | undefined;
  zip?: string;
  // dOB?: string | null;
  // decDt?: string | null;
  ticklered?: string | null;
  returnDt?: string | null;
  altName?: AltNameSchemaData[] | undefined;
  title?: TitleData[] | undefined;
}> => {
  const phoneSchema: Yup.Schema<PhoneSchemasData> = Yup.object().shape({
    areaCode: Yup.string()
      .nullable()
      .matches(/^[0-9]{3}$/, t('phoneValidation'))
      .test('phoneNoLength', t('phoneValidation'), function (value) {
        const { prefix, phoneNo } = this.parent as PhoneSchemasData;

        if (prefix && phoneNo && (value === undefined || value?.length === 3)) {
          return true;
        }
        if (!prefix && !phoneNo && !value) {
          return true;
        }
      }) as Yup.StringSchema<string>,
    prefix: Yup.string()
      .nullable()
      .matches(/^[0-9]{3}$/, t('phoneValidation'))
      .test('phoneNoLength', t('phoneValidation'), function (value) {
        const { areaCode, phoneNo } = this.parent as PhoneSchemasData;

        if (areaCode && phoneNo && (!value || value?.length === 3)) {
          return true;
        }
        if (!areaCode && !phoneNo && !value) {
          return true;
        }
      }) as Yup.StringSchema<string>,
    phoneNo: Yup.string()
      .nullable()
      .matches(/^[0-9]{4}$/, t('phoneValidation'))
      .test('phoneNoLength', t('phoneValidation'), function (value) {
        const { areaCode, prefix } = this.parent as PhoneSchemasData;

        if (areaCode && prefix && (!value || value?.length === 4)) {
          return true;
        }

        if (!prefix && !areaCode && !value) {
          return true;
        }
      }) as Yup.StringSchema<string>,
  });

  const emailSchema: Yup.Schema<EmailSchemaData | null> = Yup.object().shape({
    email: Yup.string()
      .nullable()
      .trim()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('emailValidation')),
  });

  const altNameSchema: Yup.Schema<AltNameSchemaData> = Yup.object().shape({
    altName: Yup.string()
      .nullable()
      .test('altNameValidation', t('altNameValidation'), function (value) {
        const { firstName, lastName } = this.options.context as {
          firstName?: string;
          lastName?: string;
        };
        if (!value?.trim()) {
          return true;
        } // Allow empty AltName
        const isSameAsFullName =
          value.toLowerCase().trim() ===
          `${firstName?.trim()} ${lastName}`.toLowerCase().trim();
        const hasSingleWord = value.trim().split(' ').length === 1;

        if (isSameAsFullName) {
          return this.createError({
            message: t('altNameShouldNotBeSameAsFirstAndLast'),
          });
        }
        if (hasSingleWord) {
          return this.createError({
            message: t('altNameShouldHaveTwoNames'),
          });
        }
        return true;
      })
      .test(
        'altNameFormatCheck',
        t('altNameShouldNotContainFormat'),
        function (value) {
          if (!value?.trim()) {
            return true;
          } // Allow empty AltName

          const forbiddenFormats = ['a/k/a', 'f/k/a'];
          const regex = new RegExp(
            `\\b(${forbiddenFormats.join('|')})\\b`,
            'i'
          ); // Case insensitive match

          if (regex.test(value)) {
            return this.createError({
              message: t('altNameShouldNotContainFormat'),
            });
          }

          return true;
        }
      ),
    altNameFormat: Yup.string()
      .nullable()
      .oneOf(['a/k/a', 'f/k/a'], t('altNameFormatValidation'))
      .test(
        'altNameFormatValidation',
        t('altNameFormatRequired'),
        function (value) {
          const { altName } = this.parent as NameSchemasData;

          // If altName is not empty or null, enforce the format rule
          if (altName && altName.trim().length > 0) {
            if (!value || !['a/k/a', 'f/k/a'].includes(value)) {
              // Return a ValidationError if the value is invalid
              return new Yup.ValidationError(
                t('altNameFormatValidation'),
                null,
                this.path
              );
            }
          }

          // If altName is empty or null, allow nullable (no error)
          return true; // Return true to indicate that the test passed
        }
      ),
  });
  const titleFieldSchema: Yup.Schema<TitleData> = Yup.object()
    .shape({
      individuallyAndAs: Yup.boolean().optional(),
      title: Yup.string().optional(),
      preposition: Yup.string().optional(),
      entityName: Yup.string().trim().optional(),
    })
    .test('all-or-none', t('allFieldsRequired'), function (values) {
      const { title, preposition, entityName } = values || {};

      const anyFieldFilled = !!(title || preposition || entityName);
      const allFieldsFilled = title && preposition && entityName;

      // If any field is filled but not all, create field-specific errors
      if (anyFieldFilled && !allFieldsFilled) {
        const errors: Yup.ValidationError[] = [];

        if (!title) {
          errors.push(
            this.createError({
              path: `${this.path}.title`,
              message: t('titleRequired'),
            })
          );
        }
        if (!preposition) {
          errors.push(
            this.createError({
              path: `${this.path}.preposition`,
              message: t('prepositionRequired'),
            })
          );
        }
        if (!entityName) {
          errors.push(
            this.createError({
              path: `${this.path}.entityName`,
              message: t('entityNameRequired'),
            })
          );
        }
        return new Yup.ValidationError(errors);
      }

      return true;
    });
  const schema = Yup.object().shape({
    firstName: Yup.string().trim().required(t('firstNameRequired')),
    email: Yup.array().of(emailSchema).nullable(),
    ownership: Yup.number()
      .typeError(t('ownershipValidation')) // Show validation error if it's not a number
      .min(0, t('ownershipPositiveValidation')) // Ensure it's a non-negative number (0 or positive)
      .max(1000, t('ownershipMaxValidation')), // Optional: Set a maximum value, if needed
    phone: Yup.array().of(phoneSchema),
    title: Yup.array().of(titleFieldSchema),
    altName: Yup.array().of(altNameSchema),
    zip: Yup.string()
      .transform(value => (value === '' ? null : value))
      .matches(/^[0-9-]+$/, t('zipValidation'))
      .max(10, t('zipLength'))
      .nullable()
      .optional() as Yup.StringSchema<string>,
    // dOB: Yup.string()
    //   .nullable()
    //   .optional()
    //   .test('isValid', t('invalidDate'), value => {
    //     if (value && !isMomentValidDate(value)) {
    //       return false;
    //     }
    //     return true;
    //   }),
    // decDt: Yup.string()
    //   .nullable()
    //   .optional()
    //   .test('isValid', t('invalidDate'), value => {
    //     if (value && !isMomentValidDate(value)) {
    //       return false;
    //     }
    //     return true;
    //   }),
    ticklered: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
    returnDt: Yup.string()
      .nullable()
      .optional()
      .test('isValid', t('invalidDate'), value => {
        if (value && !isMomentValidDate(value)) {
          return false;
        }
        return true;
      }),
  });

  return schema;
};
