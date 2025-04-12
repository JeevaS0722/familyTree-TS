import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../../store/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import NoteForm from './NotesForm';
import { useGetFileLocationQuery } from '../../../store/Services/commonService';
import { addFileNotePayload, addFileNoteValues } from '../../../interface/note';
import { useAddFileNoteMutation } from '../../../store/Services/noteService';
import { noteSchema } from '../../../schemas/note';
import { fileTaskType } from '../../../utils/constants';
import OverlayLoader from '../../../component/common/OverlayLoader';

interface LocationStateData {
  fileId: number;
}

const AddNotes: React.FC = () => {
  const { t } = useTranslation('note');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const addNotesRef = useRef<HTMLInputElement>(null);
  const { fileId } = (location.state as LocationStateData) || {};
  const { data: fileLocation, isLoading } = useGetFileLocationQuery();

  const noteInitialValues: addFileNoteValues = {
    memo: '',
    type: 'Research',
    returnedTo: '',
  };

  const [addFileNote] = useAddFileNoteMutation();

  useEffect(() => {
    if (!fileId) {
      navigate('/');
    }
  }, [fileId, navigate]);

  const onSubmit = async (values: addFileNoteValues) => {
    try {
      const data: addFileNotePayload = {
        fileId,
        type: values.type,
        memo: values.memo,
        returnedTo: values.returnedTo,
      };
      const response = await addFileNote(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editFile/${fileId}?tab=notes`);
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
    }
  };

  const validateForm = (values: addFileNoteValues) => {
    const errors: Partial<addFileNoteValues> = {};
    if (!values.type) {
      errors.type = t('typeRequired');
    }
    const memo = values?.memo.trim();
    if (!memo) {
      errors.memo = t('memoRequired');
    }
    return errors;
  };

  return (
    <Container ref={addNotesRef} component="main" fixed>
      <Typography
        id="makeNote"
        variant="h4"
        component="p"
        gutterBottom
        className="header-title-h4"
      >
        {t('addNotesTitle')}
      </Typography>
      {isLoading ? (
        <OverlayLoader open />
      ) : (
        <Formik
          enableReinitialize
          initialValues={noteInitialValues}
          onSubmit={onSubmit}
          validationSchema={noteSchema(t)}
          validateOnBlur={false}
          validateOnChange={false}
          validate={validateForm}
        >
          {({ isSubmitting, errors, isValidating }) => (
            <Form>
              <Grid container justifyContent="center">
                <NoteForm
                  taskType={fileTaskType}
                  returnedTo={fileLocation?.places || []}
                  errors={errors}
                  isValidating={isValidating}
                />
              </Grid>
              <Grid container justifyContent="center">
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    id="save-button"
                    variant="outlined"
                    sx={{
                      my: '2rem',
                      '&:disabled': {
                        opacity: 0.2,
                        cursor: 'not-allowed',
                        backgroundColor: '#1997c6',
                        color: '#fff',
                      },
                    }}
                  >
                    {t('save')}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default AddNotes;
