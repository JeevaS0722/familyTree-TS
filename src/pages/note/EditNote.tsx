import React, { useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import EditNoteForm from './EditNoteForm';
import {
  deleteNotePayload,
  editNotePayload,
  editNoteValues,
} from '../../interface/note';
import {
  useDeleteNoteMutation,
  useLazyGetNoteQuery,
  useUpdateNoteMutation,
} from '../../store/Services/noteService';
import { editNoteSchema } from '../../schemas/note';
import CustomModel from '../../component/common/CustomModal';
import OverlayLoader from '../../component/common/OverlayLoader';

const EditNotes: React.FC = () => {
  const { t } = useTranslation('note');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const editNotesRef = useRef<HTMLInputElement>(null);
  const queryParams = new URLSearchParams(location.search);
  const noteId = queryParams.get('noteId');
  const route = queryParams.get('route');
  const from = queryParams.get('from');

  const [noteValues, setNoteValues] = useState({
    memo: '',
  });

  const [deleteNote] = useDeleteNoteMutation();

  const [deleting, setDeleting] = useState<boolean>(false);

  const [openModel, setOpenModel] = useState<boolean>(false);

  const handleClose = () => {
    setOpenModel(false);
    setDeleting(false);
  };

  const handleOpen = () => {
    setOpenModel(true);
    setDeleting(true);
  };

  const handleDelete = async () => {
    try {
      const data: deleteNotePayload = {
        noteId,
      };
      const response = await deleteNote(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );

          navigate(`${route}?tab=notes`);
        }
      }
      setDeleting(false);
      setOpenModel(false);
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
      setDeleting(false);
      setOpenModel(false);
    }
  };

  const [editNote] = useUpdateNoteMutation();

  const [getNote, { data, isLoading, isFetching }] = useLazyGetNoteQuery();

  useEffect(() => {
    if (!noteId) {
      navigate('/');
    }
    void getNote({ noteId });
  }, []);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      const notes = data?.data?.notes || '';
      setNoteValues({
        memo: notes,
      });
    }
  }, [isLoading, isFetching]);

  const onSubmit = async (values: editNoteValues) => {
    try {
      const data: editNotePayload = {
        noteId,
        memo: values.memo,
      };
      const response = await editNote(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`${route}?tab=notes`);
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

  const validateForm = (values: editNoteValues) => {
    const errors: Partial<editNoteValues> = {};
    const memo = values?.memo.trim();
    if (!memo) {
      errors.memo = t('memoRequired');
    }
    return errors;
  };

  return (
    <Container ref={editNotesRef} component="main" fixed>
      {isLoading ? (
        <OverlayLoader open />
      ) : (
        <>
          <Typography
            id="edit-note"
            variant="h4"
            component="p"
            gutterBottom
            className="header-title-h4"
          >
            {from === 'file'
              ? t('editNote')
              : `${t('editNoteFor')} ${data?.data?.contactName || ''}`}
          </Typography>
          <Formik
            enableReinitialize
            initialValues={noteValues}
            onSubmit={onSubmit}
            validationSchema={editNoteSchema(t)}
            validateOnBlur={false}
            validateOnChange={false}
            validate={validateForm}
          >
            {({ isSubmitting, errors, isValidating }) => (
              <Form>
                <Grid container justifyContent="center">
                  <EditNoteForm errors={errors} isValidating={isValidating} />
                </Grid>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Button
                      disabled={isSubmitting || deleting}
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
                      {t('saveNote')}
                    </Button>
                  </Grid>
                  <Grid item ml={2}>
                    <Button
                      disabled={deleting || isSubmitting}
                      onClick={handleOpen}
                      id="delete-button"
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
                      {t('deleteNoteButton')}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </>
      )}
      <CustomModel
        open={openModel}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalHeader={t('deleteNoteTitle')}
        modalTitle={t('deleteNoteMsg')}
        modalButtonLabel={t('delete')}
      />
    </Container>
  );
};

export default EditNotes;
