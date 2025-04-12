import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Field, Form, Formik } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import {
  AltData,
  ContactData,
  EditContactData,
  EmailData,
  PhoneData,
  TitleData,
} from '../../interface/contact';
import {
  useEditContactMutation,
  useLazyGetContactDetailsQuery,
  useDeleteContactMutation,
} from '../../store/Services/contactService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { convertToMMDDYYYY, formatDateByMonth } from '../../utils/GeneralUtil';
import ContactInfo from './ContactInfo';
import { severity } from '../../interface/snackbar';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { editContactSchema } from '../../schemas/editContact';
import CustomModel from '../../component/common/CustomModal';
import { deleteContactTitle } from '../../utils/constants';
import { toggleSelectedContact } from '../../store/Reducers/selectContactReducer';
import { useGetUserQuery } from '../../store/Services/userService';
import { clearTabName } from '../../store/Reducers/tabReducer';
import useDateTime from '../../hooks/useDateTime';
import MultiLineTabs from '../../component/CustomTab';
import LazyTab from '../../component/common/wrapper/LazyTab';
import BuyerDropdown from '../../component/common/fields/BuyerDropdown';
import FileStatusDropdown from '../../component/common/fields/FileStatusDropdown';
import OverlayLoader from '../../component/common/OverlayLoader';
import * as Yup from 'yup';
import {
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';

const LegalTable = React.lazy(
  () => import(/* webpackChunkName: "legalTable" */ '../legal/LegalTable')
);
const LazyOffersTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "offerTabContent" */ '../offer/OffersTabContent'
    )
);
const LazyTaskTabContent = React.lazy(
  () =>
    import(/* webpackChunkName: "taskTabContent" */ '../task/TasksTabContent')
);
const DeedStatus = React.lazy(
  () => import(/* webpackChunkName: "deedStatus" */ './DeedStatus')
);
const OrderTabContent = React.lazy(
  () =>
    import(/* webpackChunkName: "orderTabContent" */ '../order/OrderTabContent')
);
const LazyNoteTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "contactNoteTabContent" */ '../note/contact/NotesTabContent'
    )
);
let initialValues: EditContactData = {
  contactID: 0,
  fileID: 0,
  relationship: '',
  ownership: '',
  lastName: '',
  firstName: '',
  contactName: '',
  sSN: '',
  dOB: '',
  deceased: false,
  decDt: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  email: [],
  visit: false,
  dNC: false,
  ticklered: '',
  fastTrack: false,
  fileName: '',
  whose: null,
  fileStatus: '',
  returnedTo: '',
  returnDt: '',
  paperFile: false,
  company: '',
  modifyBy: '',
  modifyDt: '',
  totalNMAOwned: 0,
  phone: [],
  altName: [],
  title: [],
};

const EditContact: React.FC = () => {
  const { formatDateTime } = useDateTime();
  const { t } = useTranslation('editContact');
  const navigate = useNavigate();
  const { contactId } = useParams();
  const dispatch = useAppDispatch();
  useGetUserQuery('');
  const [
    getContactDetails,
    { data: contactDetails, isLoading: contactDetailsLoading },
  ] = useLazyGetContactDetailsQuery();
  const [editContact] = useEditContactMutation();
  const [contactDetailsData, setContactDetailsData] = useState(initialValues);
  const [formErrors, setErrors] = useState<{ returnDt?: string }>();
  const errorReturnDtRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (formErrors?.returnDt) {
      setTimeout(function () {
        errorReturnDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [formErrors]);
  const [phone, setPhone] = useState<PhoneData[]>([]);
  const [email, setEmail] = useState<EmailData[]>([]);
  const [altName, setAltName] = useState<AltData[]>([]);
  const [title, setTitle] = useState<TitleData[]>([]);
  useEffect(() => {
    dispatch(clearTabName());
  }, []);

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
      { title: '', preposition: '', entityName: '', individuallyAndAs: false },
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
  const handleTitleChange = (
    index: number,
    key: keyof TitleData,
    value: string
  ) => {
    const updatedTitle = [...title];
    updatedTitle[index][key] = value;
    setTitle(updatedTitle);
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
  const onSubmit = async (values: EditContactData) => {
    try {
      const data = {
        contactID: values.contactID,
        fileID: values?.fileID,
        relationship: values.relationship,
        ownership: values.ownership,
        lastName: values.lastName,
        firstName: values.firstName,
        sSN: values.sSN,
        // dOB: formatDateByMonth(values?.dOB?.toString()).toString() || '',
        dOB: values.dOB,
        deceased: values.deceased,
        // decDt: formatDateByMonth(values.decDt?.toString()).toString() || '',
        decDt: values.decDt,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        visit: values.visit,
        dNC: values.dNC,
        ticklered: values.ticklered || '',
        fastTrack: values.fastTrack,
        whose: values.whose,
        fileStatus: values.fileStatus,
        returnedTo: values.returnedTo,
        returnDt: values.returnDt
          ? formatDateByMonth(values.returnDt.toString()).toString()
          : '',
        paperFile: values.paperFile,
        phone: values.phone?.filter(obj => !checkPhoneValuesEmpty(obj)),
        email: values.email?.filter(obj => !checkEmailValuesEmpty(obj)),
        altName: values.altName?.filter(obj => !checkAltNameEmpty(obj)),
        title: values.title?.map(obj => {
          if (!obj.individuallyAndAs && checkTitleEmpty(obj)) {
            return { Id: obj.Id }; // Send only the ID to the backend for deletion
          }
          return obj;
        }),
      };
      const response = await editContact(data);
      if ('data' in response) {
        if (response?.data?.success) {
          void getContactDetails({ contactId: Number(contactId) });
          if (values.deceased) {
            dispatch(toggleSelectedContact(Number(contactId)));
          }

          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
    }
  };
  const handleContactDetailsData = (
    contact: ContactData,
    totalNMAOwned: number
  ) => {
    setContactDetailsData({
      contactID: contact?.contactID,
      fileID: contact?.fileID,
      relationship: contact?.relationship,
      ownership: String(contact?.ownership),
      lastName: contact?.lastName,
      firstName: contact?.firstName,
      contactName:
        [contact?.lastName, contact?.firstName]
          .filter(name => name && name.trim() !== '')
          .join(', ') || '',
      sSN: contact?.sSN,
      dOB: convertToMMDDYYYY(contact?.dOB),
      deceased: contact?.deceased,
      decDt: convertToMMDDYYYY(contact?.decDt),
      address: contact?.address,
      city: contact?.city,
      state: contact?.state,
      zip: contact?.zip,
      visit: contact?.visit,
      dNC: contact?.dNC,
      ticklered: contact?.ticklered,
      fastTrack: contact?.fastTrack,
      fileName: contact?.FilesModel.fileName,
      whose: contact?.FilesModel.whose,
      fileStatus: contact?.FilesModel.fileStatus,
      returnedTo: contact?.FilesModel.returnedTo,
      returnDt: contact?.FilesModel.returnDt,
      paperFile: contact?.FilesModel.paperFile,
      company: contact?.FilesModel.company,
      modifyBy: contact?.modifyBy,
      modifyDt: formatDateTime(contact?.modifyDt).toString(),
      totalNMAOwned: totalNMAOwned,
      phone: contact?.PhonesModels.map(phone => {
        const modifyPhone = {
          areaCode: phone.phoneNo.substring(0, 3),
          prefix: phone.phoneNo.substring(3, 6),
          phoneNo: phone.phoneNo.substring(6),
          phoneID: phone.phoneID,
          contactID: phone.contactID,
          phoneDesc: phone.phoneDesc,
        };

        return modifyPhone;
      }),
      email: contact?.EmailsModels.map(email => {
        const modifyEmail = {
          Id: email.Id,
          email: email.email,
          contactId: email.contactId,
          emailDesc: email.emailDesc,
        };
        return modifyEmail;
      }),
      altName: contact?.AlternativeNamesModels.map(altName => {
        const modifyAltName = {
          Id: altName.Id,
          altName: altName.altName,
          contactId: altName.contactId,
          altNameFormat: altName.altNameFormat,
        };
        return modifyAltName;
      }),
      title: contact?.TitlesModels.map(title => {
        const modifyTitle = {
          Id: title.Id,
          title: title.title,
          preposition: title.preposition,
          entityName: title.entityName,
          individuallyAndAs: title.individuallyAndAs,
        };
        return modifyTitle;
      }),
    });
    initialValues = {
      contactID: contact?.contactID,
      fileID: contact?.fileID,
      relationship: contact?.relationship,
      ownership: String(contact?.ownership),
      lastName: contact?.lastName,
      firstName: contact?.firstName,
      contactName: contact?.lastName + ', ' + contact?.firstName,
      sSN: contact?.sSN,
      dOB: convertToMMDDYYYY(contact?.dOB),
      deceased: contact?.deceased,
      decDt: convertToMMDDYYYY(contact?.decDt),
      address: contact?.address,
      city: contact?.city,
      state: contact?.state,
      zip: contact?.zip,
      visit: contact?.visit,
      dNC: contact?.dNC,
      ticklered: contact?.ticklered,
      fastTrack: contact?.fastTrack,
      fileName: contact?.FilesModel.fileName,
      whose: contact?.FilesModel.whose,
      fileStatus: contact?.FilesModel.fileStatus,
      returnedTo: contact?.FilesModel.returnedTo,
      returnDt: contact?.FilesModel.returnDt,
      paperFile: contact?.FilesModel.paperFile,
      company: contact?.FilesModel.company,
      modifyBy: contact?.FilesModel.modifyBy,
      modifyDt: formatDateTime(contact?.FilesModel.modifyDt).toString(),
      totalNMAOwned: totalNMAOwned,
      phone: contact?.PhonesModels.map(phone => {
        const modifyPhone = {
          areaCode: phone.phoneNo.substring(0, 3),
          prefix: phone.phoneNo.substring(3, 6),
          phoneNo: phone.phoneNo.substring(6),
          phoneID: phone.phoneID,
          contactID: phone.contactID,
          phoneDesc: phone.phoneDesc,
        };
        return modifyPhone;
      }),
      email: contact?.EmailsModels.map(email => {
        const modifyEmail = {
          Id: email.Id,
          email: email.email,
          contactId: email.contactId,
          emailDesc: email.emailDesc,
        };
        return modifyEmail;
      }),
      altName: contact?.AlternativeNamesModels.map(altName => {
        const modifyAltName = {
          Id: altName.Id,
          altName: altName.altName,
          contactId: altName.contactId,
          altNameFormat: altName.altNameFormat,
        };
        return modifyAltName;
      }),
      title: contact?.TitlesModels.map(title => {
        const modifyTitle = {
          Id: title.Id,
          title: title.title,
          preposition: title.preposition,
          entityName: title.entityName,
          individuallyAndAs: title.individuallyAndAs,
        };
        return modifyTitle;
      }),
    };
    if (initialValues.phone) {
      setPhone(initialValues.phone);
    }
    if (initialValues.email) {
      setEmail(initialValues.email);
    }
    if (initialValues.altName) {
      setAltName(initialValues.altName);
    }
    if (initialValues.title) {
      setTitle(initialValues.title);
    }
  };

  useEffect(() => {
    void getContactDetails({ contactId: Number(contactId) });
  }, []);

  useEffect(() => {
    if (contactDetails && contactDetails.data.contact) {
      handleContactDetailsData(
        contactDetails.data.contact,
        contactDetails.data.totalNMAOwned
      );
    }
  }, [contactDetails]);

  const [deleteContact] = useDeleteContactMutation();
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const handleDelete = async () => {
    try {
      const response = await deleteContact({ contactId: Number(contactId) });

      if ('data' in response) {
        if (response?.data?.success) {
          if (contactDetailsData.deceased) {
            dispatch(toggleSelectedContact(Number(contactId)));
          }
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(`/editfile/${Number(contactDetailsData.fileID)}`);
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
    }
  };
  const handleTabChange = () => {
    void getContactDetails({ contactId: Number(contactId) });
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      {contactDetailsLoading ? (
        <OverlayLoader open />
      ) : (
        <Box>
          <Grid container sx={{ mt: 2, fontSize: '14px' }}>
            <Grid item xs={12} md={5}>
              <Link
                id="goToFileView"
                className="hover-link-span text-decoration-none"
                to={`/editfile/${Number(contactDetailsData.fileID)}`}
              >
                <KeyboardBackspaceIcon
                  sx={{
                    fontSize: '20px',
                  }}
                />
                {t('goToFileView')}
              </Link>
            </Grid>
            <DeedStatus contactId={Number(contactId)} />
          </Grid>

          <Grid container sx={{ mt: 2 }}>
            <Typography component="h6" className="header-title-h6">
              {t('contactView')}
            </Typography>
          </Grid>

          <Formik
            initialValues={contactDetailsData}
            enableReinitialize={true}
            onSubmit={onSubmit}
            validationSchema={editContactSchema(t)}
            validateOnBlur={false}
            validateOnChange={false}
            validate={values => {
              try {
                editContactSchema(t).validateSync(values, {
                  abortEarly: false,
                });
              } catch (error) {
                if (
                  error instanceof Yup.ValidationError &&
                  error.inner.length > 0
                ) {
                  setTimeout(() => {
                    const errorElement = document.querySelector(
                      `[name="${error.inner[0].path}"]`
                    );
                    errorElement?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }, 100);
                }
                return {};
              }
              return {};
            }}
          >
            {({ isSubmitting, values, setFieldValue, errors }) => (
              <Form>
                {contactDetailsLoading ? (
                  <OverlayLoader open />
                ) : (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                    width="100%"
                  >
                    <Grid container spacing={{ xs: 2, md: 2 }}>
                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>{t('fileName')}: </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <Field
                          disabled={true}
                          name="fileName"
                          as={CustomInputField}
                          backgroundColor="#434857"
                          width="100%"
                          type="text"
                          inputProps={{
                            id: 'fileName',
                          }}
                        />
                      </Grid>

                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>
                          {t('contactName')}:{' '}
                        </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <Field
                          disabled={true}
                          name="contactName"
                          as={CustomInputField}
                          backgroundColor="#434857"
                          width="100%"
                          type="text"
                          inputProps={{
                            id: 'contactName',
                          }}
                        />
                      </Grid>

                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>{t('buyer')}: </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <BuyerDropdown
                          name="whose"
                          inputProps={{
                            id: 'whose',
                          }}
                          sx={{
                            width: { xs: '100%', md: '50%' },
                            background: '#434857',
                          }}
                        />
                      </Grid>

                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>{t('fileStatus')}: </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <FileStatusDropdown
                          type="status"
                          name="fileStatus"
                          inputProps={{
                            id: 'fileStatus',
                          }}
                          InputProps={{
                            slotProps: {
                              root: {
                                id: 'fileStatusField',
                              },
                            },
                          }}
                          sx={{
                            width: { xs: '100%', md: '50%' },
                            backgroundColor:
                              values.fileStatus === 'Dead' ||
                              values.fileStatus === 'Dead-Estate'
                                ? 'red'
                                : values.fileStatus === 'Paused'
                                  ? 'lightblue'
                                  : '#434857',
                          }}
                        />
                      </Grid>

                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>
                          {t('paperLocation')}:{' '}
                        </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <Grid container spacing={{ xs: 2, md: 2 }}>
                          <Grid item xs={12} md={7}>
                            <FileStatusDropdown
                              type="location"
                              name="returnedTo"
                              inputProps={{
                                id: 'returnedTo',
                              }}
                              sx={{
                                width: { xs: '100%', md: '86.5%' },
                                background: '#434857',
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={5}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <Field
                              name="paperFile"
                              inputProps={{
                                id: 'paperFile',
                              }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{ color: 'white', marginLeft: '-10px' }}
                              size="small"
                              color="info"
                            />
                            <StyledInputLabel>
                              {t('paperFileExists')}?
                            </StyledInputLabel>
                          </Grid>
                        </Grid>
                      </Grid>

                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>{t('asOf')}: </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <CustomDatePicker
                          name="returnDt"
                          type="date"
                          id="returnDt"
                          width="40%"
                          sx={{
                            paddingTop: '0 !important',
                          }}
                        />
                        {formErrors?.returnDt && (
                          <Box ref={errorReturnDtRef}>
                            <ErrorText id="error-returnDt">
                              {formErrors?.returnDt}
                            </ErrorText>
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {/* Contact, Requests, Offers etc tabs */}
                    <Grid
                      container
                      spacing={{ xs: 1, sm: 2 }}
                      sx={{
                        width: '100% !important',
                      }}
                    >
                      <Grid item xs={12}>
                        <Box sx={{ width: '100%' }}>
                          <MultiLineTabs onTabChange={handleTabChange}>
                            <LazyTab id="contact" label={t('contact')}>
                              <ContactInfo
                                values={values}
                                handlePhoneChange={handlePhoneChange}
                                addNewPhone={addNewPhone}
                                handleEmailChange={handleEmailChange}
                                addNewEmail={addNewEmail}
                                email={email}
                                phone={phone}
                                errors={errors}
                                phone1Ref={phone1Ref}
                                phone2Ref={phone2Ref}
                                phone3Ref={phone3Ref}
                                contactDetails={contactDetailsData}
                                setFieldValue={setFieldValue}
                                handleAltNameChange={handleAltNameChange}
                                addNewAltName={addNewAltName}
                                altName={altName}
                                handleTitleChange={handleTitleChange}
                                addNewTitle={addNewTitle}
                                title={title}
                              />
                              <Grid
                                container
                                spacing={{ xs: 2, sm: 2 }}
                                sx={{
                                  marginTop: '10px !important',
                                  justifyContent: 'center',
                                  width: '100% !important',
                                }}
                              >
                                <Grid
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '20px',
                                  }}
                                >
                                  <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    id="saveContact"
                                    variant="outlined"
                                    onClick={() => {
                                      try {
                                        editContactSchema(t).validateSync(
                                          values,
                                          {
                                            abortEarly: false,
                                          }
                                        );
                                      } catch (err) {
                                        if (
                                          err instanceof Yup.ValidationError &&
                                          err.inner.length > 0
                                        ) {
                                          return setErrors({
                                            [String(err.inner[0].path)]:
                                              err.inner[0].message,
                                          });
                                        }
                                      }
                                    }}
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      '&:disabled': {
                                        opacity: 0.2,
                                        cursor: 'not-allowed',
                                        borderColor: '#1997c6',
                                        color: '#fff',
                                      },
                                    }}
                                  >
                                    {t('saveContact')}
                                  </Button>

                                  <Button
                                    id="deleteContact"
                                    variant="outlined"
                                    onClick={handleOpen}
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      '&:disabled': {
                                        opacity: 0.2,
                                        cursor: 'not-allowed',
                                        borderColor: '#1997c6',
                                        color: '#fff',
                                      },
                                    }}
                                  >
                                    {t('deleteContact')}
                                  </Button>
                                </Grid>
                              </Grid>
                            </LazyTab>
                            <LazyTab label={t('requests')} id="requests">
                              <OrderTabContent
                                contactId={Number(contactId)}
                                fileId={Number(contactDetailsData.fileID)}
                                ordCity={contactDetailsData.city}
                                ordState={contactDetailsData.state}
                                grantor={`${`${contactDetailsData.firstName} ` || ''} ${contactDetailsData.lastName}`}
                              />
                            </LazyTab>
                            <LazyTab label={t('offers')} id="offers">
                              <LazyOffersTabContent
                                contactId={Number(contactId)}
                                fileId={Number(contactDetailsData.fileID)}
                              />
                            </LazyTab>
                            <LazyTab label={t('legals')} id="legals">
                              <Box sx={{ width: '100%' }}>
                                <LegalTable
                                  fileId={contactDetailsData.fileID}
                                  fileName={contactDetailsData.fileName}
                                  contactId={contactDetailsData.contactID}
                                  isFileView={true}
                                />
                              </Box>
                            </LazyTab>
                            <LazyTab label={t('tasks')} id="tasks">
                              <LazyTaskTabContent
                                contactId={Number(contactId)}
                                fileId={Number(contactDetailsData.fileID)}
                                city={contactDetailsData.city}
                                from="contactView"
                                deedId={''}
                              />
                            </LazyTab>
                            <LazyTab label={t('notes')} id="notes">
                              <Box sx={{ width: '100%' }}>
                                <LazyNoteTabContent
                                  contactId={Number(contactId)}
                                  orderBy="dateCompleted,dateCreated"
                                  order="desc"
                                />
                              </Box>
                            </LazyTab>
                          </MultiLineTabs>
                        </Box>
                      </Grid>
                    </Grid>
                    <CustomModel
                      open={openModel}
                      handleClose={handleClose}
                      handleDelete={handleDelete}
                      modalHeader="Delete Contact"
                      modalTitle={deleteContactTitle}
                      modalButtonLabel="Delete"
                    />
                  </Stack>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default EditContact;
