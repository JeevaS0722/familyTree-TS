import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const offerDataSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  offerBy: number;
  offerType: number;
  letterType: number;
  grantors: string;
  draftLength1?: number | null;
  draftLength2?: number | null;
  comment3?: string | null;
}> => {
  return Yup.object().shape({
    offerBy: Yup.number()
      .typeError(t('offerByRequired'))
      .required(t('offerByRequired'))
      .positive(t('offerByRequired')), // numeric field

    offerType: Yup.number().required(t('offerTypeRequired')), // numeric field

    letterType: Yup.number().required(t('letterTypeRequired')), // numeric field

    grantors: Yup.string().trim().required(t('grantorRequired')), // text field

    // If these can be null or empty, allow them:
    draftLength1: Yup.number().typeError(t('draftLength1Valid')).nullable(), // Let null pass

    draftLength2: Yup.number().typeError(t('draftLength2Valid')).nullable(), // Let null pass

    comment3: Yup.string().nullable(), // Let null or empty string pass
  });
};
