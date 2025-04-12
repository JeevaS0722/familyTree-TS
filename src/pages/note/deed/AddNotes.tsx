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
import NoteForm from '../deed_contact/NotesForm';
import { useGetFileStatusQuery } from '../../../store/Services/commonService';
import {
  addDeedNotePayload,
  addDeedOrContactNoteValues,
} from '../../../interface/note';
import { useAddDeedNoteMutation } from '../../../store/Services/noteService';
import { noteSchema } from '../../../schemas/note';
import { deedTaskType } from '../../../utils/constants';
import OverlayLoader from '../../../component/common/OverlayLoader';

interface LocationStateData {
  deedId: number;
}

const AddNotes: React.FC = () => {
  const { t } = useTranslation('note');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const addNotesRef = useRef<HTMLInputElement>(null);
  const { deedId } = (location.state as LocationStateData) || {};
  const { data: fileStatusData, isLoading } = useGetFileStatusQuery();

  const noteInitialValues: addDeedOrContactNoteValues = {
    memo: '',
    type: '',
    fileStatus: '',
  };

  const [addDeedNote] = useAddDeedNoteMutation();

  useEffect(() => {
    if (!deedId) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (values: addDeedOrContactNoteValues) => {
    try {
      const data: addDeedNotePayload = {
        deedId,
        type: values.type,
        memo: values.memo,
        fileStatus: values.fileStatus,
      };
      const response = await addDeedNote(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editDeed/${deedId}?tab=notes`);
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

  const validateForm = (values: addDeedOrContactNoteValues) => {
    const errors: Partial<addDeedOrContactNoteValues> = {};
    const memo = values?.memo.trim();
    if (!values.type) {
      errors.type = t('typeRequired');
    }
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
                  taskType={deedTaskType}
                  fileStatus={fileStatusData?.places || []}
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
