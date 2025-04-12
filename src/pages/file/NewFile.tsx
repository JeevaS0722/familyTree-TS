import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Form, Formik, FormikHelpers } from 'formik';
import AddFile from './AddFile';
import AddContact from './AddContact';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { newFileSchema } from '../../schemas/newFile';
import { useCreateFileMutation } from '../../store/Services/fileService';
import { Values } from '../../interface/file';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import {
  AltData,
  EmailData,
  PhoneData,
  TitleData,
} from '../../interface/contact';

const initialValues: Values = {
  fileName: '',
  fileOrigin: '',
  startDt: '',
  legalsCounty: '',
  legalsState: '',
  mMSuspAmt: '0',
  mMComment: '',
  onlineResearchDt: moment().format('YYYY-MM-DD'),
  fileStatus: 'Research',
  returnedTo: 'Digital',
  relationship: '',
  ownership: '',
  lastName: '',
  firstName: '',
  sSN: '',
  deceased: false,
  decDt: '',
  dOB: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: [],
  email: [],
  altName: [],
  title: [],
};

const NewFile: React.FC = () => {
  const { t } = useTranslation('newfile');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [createFile] = useCreateFileMutation();
  const [error, setError] = React.useState<string>(''); // State to store error message
  const errorCountyRef = React.useRef<HTMLDivElement>(null);
  const [phone, setPhone] = React.useState<PhoneData[]>([
    {
      phoneDesc: '',
      phoneNo: '',
      areaCode: '',
      prefix: '',
    },
  ]);
  const [email, setEmail] = React.useState<EmailData[]>([
    {
      email: '',
      emailDesc: '',
    },
  ]);
  const [altName, setAltName] = React.useState<AltData[]>([
    {
      altName: '',
      altNameFormat: '',
    },
  ]);
  const [title, setTitle] = React.useState<TitleData[]>([
    {
      individuallyAndAs: false,
      title: '',
      preposition: '',
      entityName: '',
    },
  ]);
  const phone1Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const phone2Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const phone3Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const addNewPhone = () => {
    setPhone([
      ...phone,
      { areaCode: '', prefix: '', phoneNo: '', phoneDesc: '' },
    ]);
  };
  const addNewEmail = () => {
    setEmail([...email, { email: '', emailDesc: '' }]);
  };
  const addNewAltName = () => {
    setAltName([...altName, { altName: '', altNameFormat: '' }]);
  };
  const addNewTitle = () => {
    setTitle([
      ...title,
      { individuallyAndAs: false, title: '', preposition: '', entityName: '' },
    ]);
  };
  const handlePhoneChange = (
    index: number,
    key: keyof PhoneData,
    value: string
  ) => {
    if (
      key === 'phoneNo' ||
      key === 'areaCode' ||
      key === 'prefix' ||
      key === 'phoneDesc'
    ) {
      const updatedPhone = [...phone];

      updatedPhone[index][key] = value;

      setPhone(updatedPhone);
      if (key === 'areaCode' && value.length === 3) {
        phone2Ref.current[index]?.focus();
      } else if (key === 'prefix' && value.length === 3) {
        phone3Ref.current[index]?.focus();
      }
    }
  };
  const handleEmailChange = (
    index: number,
    key: keyof EmailData,
    value: string
  ) => {
    if (key === 'email' || key === 'emailDesc') {
      const updatedEmail = [...email];
      updatedEmail[index][key] = value;
      setEmail(updatedEmail);
    }
  };

  const handleTitleChange = (
    index: number,
    key: keyof TitleData,
    value: string
  ) => {
    const updatedTitle = [...title];
    updatedTitle[index][key] = value;
    setTitle(updatedTitle);
  };

  const handleAltNameChange = (
    index: number,
    key: keyof AltData,
    value: string
  ) => {
    if (key === 'altName' || key === 'altNameFormat') {
      const updateAltName = [...altName];
      updateAltName[index][key] = value;
      setAltName(updateAltName);
    }
  };
  const checkPhoneValuesEmpty = (obj: Partial<PhoneData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof PhoneData] !== '') {
        return false;
      }
    }
    return true;
  };
  const checkEmailValuesEmpty = (obj: Partial<EmailData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof EmailData] !== '') {
        return false;
      }
    }
    return true;
  };

  const checkAltNameEmpty = (obj: Partial<AltData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof AltData] !== '') {
        return false;
      }
    }
    return true;
  };

  const checkTitleEmpty = (obj: Partial<TitleData>): boolean => {
    return (
      !obj.title?.trim() && !obj.preposition?.trim() && !obj.entityName?.trim()
    );
  };
  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    if (!error) {
      try {
        // const phone = `${values.areaCode}${values.prefix}${values.phoneNo}`;
        const data = {
          fileName: values.fileName,
          fileOrigin: values.fileOrigin,
          startDt: values.startDt || '',
          legalsCounty: values.legalsCounty,
          legalsState: values.legalsState,
          mMSuspAmt: values.mMSuspAmt,
          mMComment: values.mMComment,
          onlineResearchDt: values.onlineResearchDt || '',
          fileStatus: values.fileStatus,
          returnedTo: values.returnedTo,
          contact: {
            relationship: values.relationship,
            ownership: values.ownership,
            lastName: values.lastName,
            firstName: values.firstName,
            sSN: values.sSN,
            deceased: values.deceased,
            decDt: values.decDt || '',
            dOB: values.dOB || '',
            address: values.address,
            city: values.city,
            state: values.state,
            zip: values.zip,
          },
          phone: values.phone?.filter(obj => !checkPhoneValuesEmpty(obj)),
          email: values.email?.filter(obj => !checkEmailValuesEmpty(obj)),
          altName: values.altName?.filter(obj => !checkAltNameEmpty(obj)),
          title: values.title?.filter(
            obj => obj.individuallyAndAs || !checkTitleEmpty(obj)
          ),
        };
        const response = await createFile(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/editfile/${response?.data?.data.fileID}`);
          }
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('title')}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={newFileSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, values, setFieldValue, errors }) => (
          <Form>
            <AddFile
              values={values}
              errors={errors}
              setError={setError}
              errorCountyRef={errorCountyRef}
            />
            <AddContact
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
              handlePhoneChange={handlePhoneChange}
              addNewPhone={addNewPhone}
              handleEmailChange={handleEmailChange}
              addNewEmail={addNewEmail}
              email={email}
              phone={phone}
              phone1Ref={phone1Ref}
              phone2Ref={phone2Ref}
              phone3Ref={phone3Ref}
              handleAltNameChange={handleAltNameChange}
              addNewAltName={addNewAltName}
              altName={altName}
              handleTitleChange={handleTitleChange}
              addNewTitle={addNewTitle}
              title={title}
            />
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
                  {t('button')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default NewFile;
