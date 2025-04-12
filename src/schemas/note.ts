import * as Yup from 'yup';
import { TFunction } from 'i18next';

export const noteSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  type?: string;
  memo?: string;
}> => {
  return Yup.object().shape({
    type: Yup.string().required(t('typeRequired')),
    memo: Yup.string().required(t('memoRequired')),
  });
};

export const editNoteSchema = (
  t: TFunction<string>
): Yup.ObjectSchema<{
  memo?: string;
}> => {
  return Yup.object().shape({
    memo: Yup.string().required(t('memoRequired')),
  });
};
